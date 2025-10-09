import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto, UpdateJobDto, JobQueryDto } from './dto/job.dto';
import { generateUniqueJobSlug } from '../../utils/slug.util';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create new job (Recruiter only)
   */
  async createJob(recruiterId: string, dto: CreateJobDto) {
    // Verify company belongs to recruiter
    const company = await this.prisma.company.findUnique({
      where: { id: dto.companyId },
    });

    if (!company || company.recruiterId !== recruiterId) {
      throw new ForbiddenException('You do not have access to this company');
    }

    // Generate unique slug for job
    const slug = await generateUniqueJobSlug(this.prisma as any, dto.title)

    const job = await this.prisma.job.create({
      data: {
        ...dto,
        recruiterId,
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

  /**
   * Get all jobs with filters and pagination
   */
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

    // Build where clause
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

    // Get total count for pagination
    const total = await this.prisma.job.count({ where });

    // Get jobs
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

  /**
   * Get job by ID
   */
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

    // Increment views
    await this.prisma.job.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return job;
  }

  /**
   * Update job (Recruiter only - must own the job)
   */
  async updateJob(jobId: string, recruiterId: string, dto: UpdateJobDto) {
    // Verify job belongs to recruiter
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

  /**
   * Delete job (Recruiter only - must own the job)
   */
  async deleteJob(jobId: string, recruiterId: string) {
    // Verify job belongs to recruiter
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

  /**
   * Get jobs posted by a specific recruiter
   */
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
}
