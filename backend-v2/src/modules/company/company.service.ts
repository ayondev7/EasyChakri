import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import { generateUniqueCompanySlug } from '../../utils/slug.util';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async createCompany(recruiterId: string, dto: CreateCompanyDto) {
    const existingCompany = await this.prisma.company.findUnique({
      where: { recruiterId },
    });

    if (existingCompany) {
      throw new ConflictException('You already have a company profile. You can update your existing profile instead.');
    }

    const existingName = await this.prisma.company.findUnique({
      where: { name: dto.name },
    });

    if (existingName) {
      throw new ConflictException('A company with this name already exists. Please choose a different name.');
    }

    const slug = await generateUniqueCompanySlug(this.prisma as any, dto.name);

    const company = await this.prisma.company.create({
      data: {
        ...dto,
        slug,
        recruiterId,
      },
    });

    return company;
  }

  async getAllCompanies(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const total = await this.prisma.company.count();

    const companies = await this.prisma.company.findMany({
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            jobs: true,
          },
        },
      },
    });

    return {
      data: companies,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCompanyById(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { slug: id },
      include: {
        recruiter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        jobs: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            slug: true,
            type: true,
            location: true,
            salary: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            jobs: true,
          },
        },
      },
    });

    if (!company) {
      throw new NotFoundException('We couldn\'t find this company. It may have been removed.');
    }

    return company;
  }

  async getRecruiterCompany(recruiterId: string) {
    const company = await this.prisma.company.findUnique({
      where: { recruiterId },
      include: {
        _count: {
          select: {
            jobs: true,
          },
        },
      },
    });

    if (!company) {
      throw new NotFoundException('You don\'t have a company profile yet. Please create one to continue.');
    }

    return company;
  }

  async updateCompany(companyId: string, recruiterId: string, dto: UpdateCompanyDto) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('We couldn\'t find this company. It may have been removed.');
    }

    if (company.recruiterId !== recruiterId) {
      throw new ForbiddenException('You don\'t have permission to update this company profile.');
    }

    if (dto.name && dto.name !== company.name) {
      const existingName = await this.prisma.company.findUnique({
        where: { name: dto.name },
      });

      if (existingName) {
        throw new ConflictException('A company with this name already exists. Please choose a different name.');
      }

      const slug = await generateUniqueCompanySlug(this.prisma as any, dto.name);
      
      const updatedCompany = await this.prisma.company.update({
        where: { id: companyId },
        data: { ...dto, slug },
      });

      return updatedCompany;
    }

    const updatedCompany = await this.prisma.company.update({
      where: { id: companyId },
      data: dto,
    });

    return updatedCompany;
  }

  async deleteCompany(companyId: string, recruiterId: string) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('We couldn\'t find this company. It may have been removed.');
    }

    if (company.recruiterId !== recruiterId) {
      throw new ForbiddenException('You don\'t have permission to delete this company profile.');
    }

    await this.prisma.company.delete({
      where: { id: companyId },
    });

    return { message: 'Company deleted successfully' };
  }

  async getCompaniesByIndustry() {
    const companiesWithJobs = await this.prisma.company.findMany({
      select: {
        id: true,
        name: true,
        logo: true,
        industry: true,
        _count: {
          select: {
            jobs: true,
          },
        },
      },
      where: {
        jobs: {
          some: {},
        },
      },
    });

    const groupedByIndustry = companiesWithJobs.reduce((acc, company) => {
      if (!acc[company.industry]) {
        acc[company.industry] = {
          industry: company.industry,
          count: 0,
          companies: [],
        };
      }
      acc[company.industry].count += company._count.jobs;
      acc[company.industry].companies.push({
        id: company.id,
        name: company.name,
        logo: company.logo,
      });
      return acc;
    }, {} as Record<string, { industry: string; count: number; companies: Array<{ id: string; name: string; logo: string | null }> }>);

    const industries = Object.values(groupedByIndustry)
      .sort((a, b) => b.count - a.count)
      .map(item => ({
        industry: item.industry,
        count: item.count,
        companies: item.companies.slice(0, 4),
      }));

    return { data: industries };
  }
}
