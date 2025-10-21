import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
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
      experience,
      salaryRange,
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

    // Handle experience filter
    if (experience) {
      const experiencePatterns: Record<string, string[]> = {
        'fresher': ['0-1', '0-2', 'fresher', 'entry'],
        'mid': ['2-3', '3-5', '2-5', 'mid'],
        'senior': ['5+', '6+', '7+', 'senior', 'lead'],
      };

      const patterns = experiencePatterns[experience];
      if (patterns) {
        where.OR = where.OR ? [...where.OR, ...patterns.map(p => ({
          experience: {
            contains: p,
            mode: 'insensitive',
          },
        }))] : patterns.map(p => ({
          experience: {
            contains: p,
            mode: 'insensitive',
          },
        }));
      }
    }

    // Handle salary range filter
    if (salaryRange) {
      const [minSalary, maxSalary] = salaryRange.split('-').map(Number);
      if (!isNaN(minSalary) && !isNaN(maxSalary)) {
        // This is a simplified approach - you might need to adjust based on how salary is stored
        // For now, we'll use text matching since salary is stored as a string like "$50k-$80k"
        where.salary = {
          contains: '',
          mode: 'insensitive',
        };
      }
    }

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

  async getJobsByLocation(limit?: number) {
    const jobsWithLocation = await this.prisma.job.groupBy({
      by: ['location'],
      _count: {
        location: true,
      },
      orderBy: {
        _count: {
          location: 'desc',
        },
      },
      take: limit ? Number(limit) : undefined,
    });

    const locations = jobsWithLocation.map((item) => ({
      location: item.location,
      count: item._count.location,
    }));

    return { data: locations };
  }

  async getJobsBySkill(limit?: number) {
    const allJobs = await this.prisma.job.findMany({
      select: {
        skills: true,
      },
    });

    const skillCounts = new Map<string, number>();

    allJobs.forEach((job) => {
      job.skills.forEach((skill) => {
        const normalizedSkill = skill.trim();
        if (normalizedSkill) {
          skillCounts.set(
            normalizedSkill,
            (skillCounts.get(normalizedSkill) || 0) + 1
          );
        }
      });
    });

    const topLimit = limit ? Number(limit) : undefined;
    const skills = Array.from(skillCounts.entries())
      .map(([skill, count]) => ({
        skill,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, topLimit);

    return { data: skills };
  }

  async getTrendingSearches(limit = 12) {
    const limitNum = Number(limit);
    const halfLimit = Math.floor(limitNum / 2);

    const titleCounts = await this.prisma.job.groupBy({
      by: ['title'],
      _count: {
        title: true,
      },
      orderBy: {
        _count: {
          title: 'desc',
        },
      },
      take: halfLimit,
    });

    const allJobs = await this.prisma.job.findMany({
      select: {
        skills: true,
      },
    });

    const skillCounts = new Map<string, number>();

    allJobs.forEach((job) => {
      job.skills.forEach((skill) => {
        const normalizedSkill = skill.trim();
        if (normalizedSkill) {
          skillCounts.set(
            normalizedSkill,
            (skillCounts.get(normalizedSkill) || 0) + 1
          );
        }
      });
    });

    const topSkills = Array.from(skillCounts.entries())
      .map(([skill, count]) => ({
        keyword: skill,
        count,
        type: 'skill',
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, halfLimit);

    const topTitles = titleCounts.map((item) => ({
      keyword: item.title,
      count: item._count.title,
      type: 'title',
    }));

    const trending = [...topTitles, ...topSkills]
      .sort((a, b) => b.count - a.count)
      .slice(0, limitNum);

    return { data: trending };
  }

  async getSimilarJobs(jobId: string, limit = 3) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      select: {
        companyId: true,
        skills: true,
        category: true,
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const similarJobs = await this.prisma.job.findMany({
      where: {
        id: { not: jobId },
        OR: [
          { companyId: job.companyId },
          { category: job.category },
          {
            skills: {
              hasSome: job.skills,
            },
          },
        ],
      },
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

    return { data: similarJobs };
  }

  async applyForJob(jobId: string, seekerId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const existingApplication = await this.prisma.application.findUnique({
      where: {
        seekerId_jobId: {
          seekerId,
          jobId,
        },
      },
    });

    if (existingApplication) {
      throw new BadRequestException('You have already applied for this job');
    }

    const application = await this.prisma.application.create({
      data: {
        seekerId,
        jobId,
      },
      include: {
        job: {
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
        },
      },
    });

    return application;
  }

  async getSeekerApplications(seekerId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const total = await this.prisma.application.count({
      where: { seekerId },
    });

    const applications = await this.prisma.application.findMany({
      where: { seekerId },
      skip,
      take: Number(limit),
      orderBy: { appliedAt: 'desc' },
      include: {
        job: {
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
        },
      },
    });

    return {
      data: applications,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getApplicationStats(seekerId: string) {
    const total = await this.prisma.application.count({
      where: { seekerId },
    });

    const statusCounts = await this.prisma.application.groupBy({
      by: ['status'],
      where: { seekerId },
      _count: {
        status: true,
      },
    });

    const stats = statusCounts.reduce((acc, item) => {
      acc[item.status] = item._count.status;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      stats,
    };
  }
}

