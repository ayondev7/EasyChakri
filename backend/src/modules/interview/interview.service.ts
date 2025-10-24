import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInterviewDto, UpdateInterviewDto, InterviewQueryDto } from './dto/interview.dto';

@Injectable()
export class InterviewService {
  constructor(private prisma: PrismaService) {}

  async createInterview(recruiterId: string, dto: CreateInterviewDto) {
    const application = await this.prisma.application.findUnique({
      where: { id: dto.applicationId },
      include: {
        job: {
          include: {
            recruiter: true,
          },
        },
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.job.recruiterId !== recruiterId) {
      throw new ForbiddenException('You can only schedule interviews for your job applications');
    }

    if (new Date(dto.scheduledAt) < new Date()) {
      throw new BadRequestException('Interview cannot be scheduled in the past');
    }

    const interview = await this.prisma.interview.create({
      data: {
        applicationId: dto.applicationId,
        seekerId: application.seekerId,
        interviewerId: recruiterId,
        type: dto.type,
        scheduledAt: dto.scheduledAt,
        duration: dto.duration,
        location: dto.location,
        meetingLink: dto.meetingLink,
        platform: dto.platform,
        notes: dto.notes,
      },
      include: {
        application: {
          include: {
            job: {
              include: {
                company: true,
              },
            },
          },
        },
        seeker: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        interviewer: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    await this.prisma.application.update({
      where: { id: dto.applicationId },
      data: { status: 'INTERVIEW_SCHEDULED' },
    });

    await this.prisma.notification.create({
      data: {
        userId: application.seekerId,
        type: 'INTERVIEW',
        title: 'Interview Scheduled',
        message: `Your interview for ${application.job.title} has been scheduled`,
        link: `/seeker/interviews/${interview.id}`,
      },
    });

    return interview;
  }

  async updateInterview(interviewId: string, userId: string, dto: UpdateInterviewDto) {
    const interview = await this.prisma.interview.findUnique({
      where: { id: interviewId },
      include: {
        application: {
          include: {
            job: true,
          },
        },
      },
    });

    if (!interview) {
      throw new NotFoundException('Interview not found');
    }

    if (interview.interviewerId !== userId && interview.seekerId !== userId) {
      throw new ForbiddenException('You do not have permission to update this interview');
    }

    if (dto.scheduledAt && new Date(dto.scheduledAt) < new Date()) {
      throw new BadRequestException('Interview cannot be scheduled in the past');
    }

    const updatedInterview = await this.prisma.interview.update({
      where: { id: interviewId },
      data: dto,
      include: {
        application: {
          include: {
            job: {
              include: {
                company: true,
              },
            },
          },
        },
        seeker: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        interviewer: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (dto.status === 'COMPLETED') {
      await this.prisma.application.update({
        where: { id: interview.applicationId },
        data: { status: 'INTERVIEW_COMPLETED' },
      });
    }

    const notificationUserId = interview.interviewerId === userId ? interview.seekerId : interview.interviewerId;
    await this.prisma.notification.create({
      data: {
        userId: notificationUserId,
        type: 'INTERVIEW',
        title: 'Interview Updated',
        message: `Interview for ${interview.application.job.title} has been updated`,
        link: `/interviews/${interview.id}`,
      },
    });

    return updatedInterview;
  }

  async getInterviewById(interviewId: string, userId: string) {
    const interview = await this.prisma.interview.findUnique({
      where: { id: interviewId },
      include: {
        application: {
          include: {
            job: {
              include: {
                company: true,
                recruiter: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
        seeker: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            resume: true,
            skills: true,
            experience: true,
          },
        },
        interviewer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
          },
        },
      },
    });

    if (!interview) {
      throw new NotFoundException('Interview not found');
    }

    if (interview.interviewerId !== userId && interview.seekerId !== userId) {
      throw new ForbiddenException('You do not have permission to view this interview');
    }

    return { data: interview };
  }

  async getRecruiterInterviews(recruiterId: string, query: InterviewQueryDto) {
    const { page = 1, limit = 10, status, type } = query;
    const skip = (page - 1) * limit;

    const where: any = { interviewerId: recruiterId };
    if (status) where.status = status;
    if (type) where.type = type;

    const [interviews, total] = await Promise.all([
      this.prisma.interview.findMany({
        where,
        skip,
        take: limit,
        orderBy: { scheduledAt: 'asc' },
        include: {
          application: {
            include: {
              job: {
                include: {
                  company: true,
                },
              },
            },
          },
          seeker: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              image: true,
              resume: true,
            },
          },
        },
      }),
      this.prisma.interview.count({ where }),
    ]);

    return {
      data: interviews,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getSeekerInterviews(seekerId: string, query: InterviewQueryDto) {
    const { page = 1, limit = 10, status, type } = query;
    const skip = (page - 1) * limit;

    const where: any = { seekerId };
    if (status) where.status = status;
    if (type) where.type = type;

    const [interviews, total] = await Promise.all([
      this.prisma.interview.findMany({
        where,
        skip,
        take: limit,
        orderBy: { scheduledAt: 'asc' },
        include: {
          application: {
            include: {
              job: {
                include: {
                  company: true,
                },
              },
            },
          },
          interviewer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              image: true,
            },
          },
        },
      }),
      this.prisma.interview.count({ where }),
    ]);

    return {
      data: interviews,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async cancelInterview(interviewId: string, userId: string) {
    const interview = await this.prisma.interview.findUnique({
      where: { id: interviewId },
      include: {
        application: {
          include: {
            job: true,
          },
        },
      },
    });

    if (!interview) {
      throw new NotFoundException('Interview not found');
    }

    if (interview.interviewerId !== userId && interview.seekerId !== userId) {
      throw new ForbiddenException('You do not have permission to cancel this interview');
    }

    if (interview.status === 'CANCELLED' || interview.status === 'COMPLETED') {
      throw new BadRequestException(`Interview is already ${interview.status.toLowerCase()}`);
    }

    await this.prisma.interview.update({
      where: { id: interviewId },
      data: { status: 'CANCELLED' },
    });

    const notificationUserId = interview.interviewerId === userId ? interview.seekerId : interview.interviewerId;
    await this.prisma.notification.create({
      data: {
        userId: notificationUserId,
        type: 'INTERVIEW',
        title: 'Interview Cancelled',
        message: `Interview for ${interview.application.job.title} has been cancelled`,
        link: `/interviews/${interview.id}`,
      },
    });

    return { message: 'Interview cancelled successfully' };
  }

  async getInterviewStats(userId: string, role: string) {
    const where = role === 'RECRUITER' ? { interviewerId: userId } : { seekerId: userId };

    const [total, scheduled, confirmed, completed, cancelled] = await Promise.all([
      this.prisma.interview.count({ where }),
      this.prisma.interview.count({ where: { ...where, status: 'SCHEDULED' } }),
      this.prisma.interview.count({ where: { ...where, status: 'CONFIRMED' } }),
      this.prisma.interview.count({ where: { ...where, status: 'COMPLETED' } }),
      this.prisma.interview.count({ where: { ...where, status: 'CANCELLED' } }),
    ]);

    return {
      total,
      stats: {
        SCHEDULED: scheduled,
        CONFIRMED: confirmed,
        COMPLETED: completed,
        CANCELLED: cancelled,
      },
    };
  }

  async getUpcomingInterviews(userId: string, role: string) {
    const where: any = role === 'RECRUITER' ? { interviewerId: userId } : { seekerId: userId };
    where.scheduledAt = { gte: new Date() };
    where.status = { in: ['SCHEDULED', 'CONFIRMED'] };

    const interviews = await this.prisma.interview.findMany({
      where,
      take: 5,
      orderBy: { scheduledAt: 'asc' },
      include: {
        application: {
          include: {
            job: {
              include: {
                company: true,
              },
            },
          },
        },
        seeker: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        interviewer: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return { data: interviews };
  }
}
