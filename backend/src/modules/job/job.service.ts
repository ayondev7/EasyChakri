import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { CreateJobDto, UpdateJobDto, JobQueryDto } from './dto/job.dto';
import { generateUniqueJobSlug } from '../../utils/slug.util';

@Injectable()
export class JobService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async createJob(recruiterId: string, dto: CreateJobDto) {
    let company = null as any

    company = await this.prisma.company.findFirst({ where: { recruiterId } });
    if (!company) {
      throw new NotFoundException('Please create your company profile before posting jobs.');
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

  async getSearchSuggestions(query: string, limit: number = 5) {
    if (!query || query.trim().length < 2) {
      return { data: [] };
    }

    const searchTerm = query.trim();

    const jobs = await this.prisma.job.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
          { company: { name: { contains: searchTerm, mode: 'insensitive' } } },
          { category: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        location: true,
        type: true,
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { data: jobs };
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
      sortBy,
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

    if (salaryRange) {
      const [minSalary, maxSalary] = salaryRange.split('-').map(Number);
      if (!isNaN(minSalary) && !isNaN(maxSalary)) {
        where.salary = {
          contains: '',
          mode: 'insensitive',
        };
      }
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'salary-high') {
      orderBy = { salary: 'asc' };
    } else if (sortBy === 'salary-low') {
      orderBy = { salary: 'desc' };
    }

    const total = await this.prisma.job.count({ where });

    const jobs = await this.prisma.job.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy,
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

  async getJobById(id: string, userId?: string) {
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
      throw new NotFoundException('We couldn\'t find this job listing. It may have been removed.');
    }

    if (userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (user && user.role === 'SEEKER') {
        await this.prisma.job.update({
          where: { id },
          data: { views: { increment: 1 } },
        });
      }
    }

    let hasApplied = false
    let isSaved = false

    if (userId) {
      const application = await this.prisma.application.findUnique({
        where: {
          seekerId_jobId: {
            seekerId: userId,
            jobId: id,
          },
        },
        select: { id: true },
      })

      hasApplied = !!application

      const saved = await this.prisma.savedJob.findUnique({
        where: {
          userId_jobId: {
            userId: userId,
            jobId: id,
          },
        },
        select: { id: true },
      })

      isSaved = !!saved
    }

    return {
      ...job,
      hasApplied,
      isSaved,
    }
  }

  async updateJob(jobId: string, recruiterId: string, dto: UpdateJobDto) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException('We couldn\'t find this job listing. It may have been removed.');
    }

    if (job.recruiterId !== recruiterId) {
      throw new ForbiddenException('You don\'t have permission to update this job listing.');
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
      throw new NotFoundException('We couldn\'t find this job listing. It may have been removed.');
    }

    if (job.recruiterId !== recruiterId) {
      throw new ForbiddenException('You don\'t have permission to delete this job listing.');
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
      throw new NotFoundException('We couldn\'t find this job listing. It may have been removed.');
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
      throw new NotFoundException('We couldn\'t find this job listing. It may have been removed.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: seekerId },
      select: {
        name: true,
        phone: true,
        location: true,
        bio: true,
        skills: true,
        experience: true,
        education: true,
        resume: true,
      },
    });

    if (!user) {
      throw new NotFoundException('We couldn\'t find your account. Please sign in again.');
    }

    const missingFields: string[] = [];
    const fieldLabels: Record<string, string> = {
      name: 'Full Name',
      phone: 'Phone Number',
      location: 'Location',
      bio: 'Bio',
      skills: 'Skills',
      experience: 'Years of Experience',
      education: 'Education',
      resume: 'Resume',
    };

    if (!user.name || user.name.trim() === '') missingFields.push('name');
    if (!user.phone || user.phone.trim() === '') missingFields.push('phone');
    if (!user.location || user.location.trim() === '') missingFields.push('location');
    if (!user.bio || user.bio.trim() === '') missingFields.push('bio');
    if (!user.skills || user.skills.length === 0) missingFields.push('skills');
    if (!user.experience || user.experience.trim() === '') missingFields.push('experience');
    if (!user.education || user.education.trim() === '') missingFields.push('education');
    if (!user.resume || user.resume.trim() === '') missingFields.push('resume');

    if (missingFields.length > 0) {
      const missingFieldsDisplay = missingFields.map(field => fieldLabels[field]).join(', ');
      throw new BadRequestException(
        `Please complete your profile before applying. Missing information: ${missingFieldsDisplay}. Visit your profile page to complete these details.`
      );
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
      throw new BadRequestException('You\'ve already applied for this job.');
    }

    const application = await this.prisma.$transaction(async (tx) => {
      const createdApplication = await tx.application.create({
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
              recruiter: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          seeker: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      await tx.notification.create({
        data: {
          userId: createdApplication.job.recruiterId,
          type: 'APPLICATION',
          title: 'New Application Received',
          message: `${createdApplication.seeker.name} has applied for ${createdApplication.job.title}`,
          link: `/recruiter/applications/${createdApplication.id}`,
        },
      });

      return createdApplication;
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

  async saveJob(jobId: string, userId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException('We couldn\'t find this job listing. It may have been removed.');
    }

    const existingSavedJob = await this.prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
    });

    if (existingSavedJob) {
      throw new BadRequestException('You\'ve already saved this job.');
    }

    const savedJob = await this.prisma.$transaction(async (tx) => {
      return await tx.savedJob.create({
        data: {
          userId,
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
    });

    return savedJob;
  }

  async unsaveJob(jobId: string, userId: string) {
    const savedJob = await this.prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
    });

    if (!savedJob) {
      throw new NotFoundException('This job is not in your saved list.');
    }

    await this.prisma.savedJob.delete({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
    });

    return true;
  }

  async getSavedJobs(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const total = await this.prisma.savedJob.count({
      where: { userId },
    });

    const savedJobs = await this.prisma.savedJob.findMany({
      where: { userId },
      skip,
      take: Number(limit),
      orderBy: { savedAt: 'desc' },
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
            _count: {
              select: {
                applications: true,
              },
            },
          },
        },
      },
    });

    return {
      data: savedJobs,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async isJobSaved(jobId: string, userId: string) {
    const savedJob = await this.prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
    });

    return !!savedJob;
  }

  async getRecruiterDashboardStats(recruiterId: string) {
    const [totalJobs, totalApplications, activeJobs, totalViews] = await Promise.all([
      this.prisma.job.count({
        where: { recruiterId },
      }),
      this.prisma.application.count({
        where: { job: { recruiterId } },
      }),
      this.prisma.job.count({
        where: {
          recruiterId,
          deadline: { gte: new Date() },
        },
      }),
      this.prisma.job.aggregate({
        where: { recruiterId },
        _sum: { views: true },
      }),
    ]);

    const applications = await this.prisma.application.findMany({
      where: { job: { recruiterId } },
      select: { status: true },
    });

    const applicationsByStatus = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentApplications = await this.prisma.application.count({
      where: {
        job: { recruiterId },
        appliedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    });

    return {
      totalJobs,
      totalApplications,
      activeJobs,
      totalViews: totalViews._sum.views || 0,
      applicationsByStatus,
      recentApplications,
    };
  }

  async getSeekerDashboardStats(seekerId: string) {
    const [totalApplications, savedJobsCount, interviewsCount] = await Promise.all([
      this.prisma.application.count({
        where: { seekerId },
      }),
      this.prisma.savedJob.count({
        where: { userId: seekerId },
      }),
      this.prisma.interview.count({
        where: { seekerId },
      }),
    ]);

    const applications = await this.prisma.application.findMany({
      where: { seekerId },
      select: { status: true },
    });

    const applicationsByStatus = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const upcomingInterviews = await this.prisma.interview.count({
      where: {
        seekerId,
        scheduledAt: { gte: new Date() },
        status: { in: ['SCHEDULED', 'CONFIRMED'] },
      },
    });

    const recentApplications = await this.prisma.application.count({
      where: {
        seekerId,
        appliedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    });

    return {
      totalApplications,
      savedJobsCount,
      interviewsCount,
      upcomingInterviews,
      applicationsByStatus,
      recentApplications,
    };
  }
}

