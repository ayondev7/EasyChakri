import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create company profile (Recruiter only)
   * A recruiter can only have one company
   */
  async createCompany(recruiterId: string, dto: CreateCompanyDto) {
    // Check if recruiter already has a company
    const existingCompany = await this.prisma.company.findUnique({
      where: { recruiterId },
    });

    if (existingCompany) {
      throw new ConflictException('You already have a company profile');
    }

    const company = await this.prisma.company.create({
      data: {
        ...dto,
        recruiterId,
      },
    });

    return company;
  }

  /**
   * Get all companies with pagination
   */
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

  /**
   * Get company by ID
   */
  async getCompanyById(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
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
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  /**
   * Get recruiter's company
   */
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
      throw new NotFoundException('Company profile not found');
    }

    return company;
  }

  /**
   * Update company (Recruiter only - must own the company)
   */
  async updateCompany(companyId: string, recruiterId: string, dto: UpdateCompanyDto) {
    // Verify company belongs to recruiter
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (company.recruiterId !== recruiterId) {
      throw new ForbiddenException('You do not have permission to update this company');
    }

    const updatedCompany = await this.prisma.company.update({
      where: { id: companyId },
      data: dto,
    });

    return updatedCompany;
  }

  /**
   * Delete company (Recruiter only - must own the company)
   */
  async deleteCompany(companyId: string, recruiterId: string) {
    // Verify company belongs to recruiter
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (company.recruiterId !== recruiterId) {
      throw new ForbiddenException('You do not have permission to delete this company');
    }

    await this.prisma.company.delete({
      where: { id: companyId },
    });

    return { message: 'Company deleted successfully' };
  }
}
