import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto, UpdateJobDto, JobQueryDto } from './dto/job.dto';
import { generateUniqueJobSlug } from '../../utils/slug.util';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}

  async createJob(recruiterId: string, dto: CreateJobDto) {
    let company = null as any

    company = await this.prisma.company.findFirst({ where: { recruiterId } });
    if (!company) {
      throw new NotFoundException('No company associated with your account. Please create a company profile before posting jobs.');
    }

    const slug = await generateUniqueJobSlug(this.prisma as any, dto.title)

    const job = await this.prisma.job.create({
      data: {
        ...dto,
        recruiterId,
        companyId: company.id,
        slug,
        deadline: dto.deadline ? new Date(dto.deadline) : null,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            location: true,
            industry: true,
          },
        },
      },
    });

    return job;
  }

  async getJobs(query: JobQueryDto) {
    const {
      search,
      type,
      location,
      category,
      isRemote,
      page = 1,
      limit = 10,
    } = query;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { company: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (type) where.type = type;
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (category) where.category = { contains: category, mode: 'insensitive' };
    if (isRemote !== undefined) where.isRemote = isRemote;

    const total = await this.prisma.job.count({ where });

    const jobs = await this.prisma.job.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            location: true,
            industry: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    return {
      data: jobs,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getJobById(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            location: true,
            industry: true,
            description: true,
            website: true,
          },
        },
        recruiter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    await this.prisma.job.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return job;
  }

  async updateJob(jobId: string, recruiterId: string, dto: UpdateJobDto) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.recruiterId !== recruiterId) {
      throw new ForbiddenException('You do not have permission to update this job');
    }

    const updatedJob = await this.prisma.job.update({
      where: { id: jobId },
      data: {
        ...dto,
        deadline: dto.deadline ? new Date(dto.deadline) : undefined,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            location: true,
            industry: true,
          },
        },
      },
    });

    return updatedJob;
  }

  async deleteJob(jobId: string, recruiterId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.recruiterId !== recruiterId) {
      throw new ForbiddenException('You do not have permission to delete this job');
    }

    await this.prisma.job.delete({
      where: { id: jobId },
    });

    return { message: 'Job deleted successfully' };
  }

  async getRecruiterJobs(recruiterId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const total = await this.prisma.job.count({
      where: { recruiterId },
    });

    const jobs = await this.prisma.job.findMany({
      where: { recruiterId },
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    return {
      data: jobs,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getJobsByExperience() {
    const experienceLevels = [
      { level: 'Fresher', pattern: ['0-1', '0-2', 'fresher', 'entry'] },
      { level: 'Mid-Level', pattern: ['2-3', '3-5', '2-5', 'mid'] },
      { level: 'Senior', pattern: ['5+', '6+', '7+', 'senior', 'lead'] },
    ];

    const results = await Promise.all(
      experienceLevels.map(async ({ level, pattern }) => {
        const count = await this.prisma.job.count({
          where: {
            OR: pattern.map(p => ({
              experience: {
                contains: p,
                mode: 'insensitive',
              },
            })),
          },
        });

        return {
          level,
          count,
        };
      })
    );

    return { data: results };
  }

  async getJobsByCategory() {
    const jobsWithCategory = await this.prisma.job.groupBy({
      by: ['category'],
      _count: {
        category: true,
      },
      orderBy: {
        _count: {
          category: 'desc',
        },
      },
    });

    const categories = jobsWithCategory.map((item) => ({
      category: item.category,
      count: item._count.category,
    }));

    return { data: categories };
  }
}

