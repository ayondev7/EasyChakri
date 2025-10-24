import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateApplicationStatusDto, ApplicationQueryDto } from './dto/application.dto';

@Injectable()
export class ApplicationService {
  constructor(private prisma: PrismaService) {}

  async getApplicationById(applicationId: string, userId: string) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
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
            education: true,
            bio: true,
          },
        },
        interviews: {
          orderBy: { scheduledAt: 'desc' },
        },
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.seekerId !== userId && application.job.recruiterId !== userId) {
      throw new ForbiddenException('You do not have permission to view this application');
    }

    return { data: application };
  }

  async getJobApplications(jobId: string, recruiterId: string, query: ApplicationQueryDto) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.recruiterId !== recruiterId) {
      throw new ForbiddenException('You can only view applications for your own jobs');
    }

    const { page = 1, limit = 10, status } = query;
    const skip = (page - 1) * limit;

    const where: any = { jobId };
    if (status) where.status = status;

    const [applications, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        skip,
        take: limit,
        orderBy: { appliedAt: 'desc' },
        include: {
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
              education: true,
            },
          },
          interviews: {
            orderBy: { scheduledAt: 'desc' },
            take: 1,
          },
        },
      }),
      this.prisma.application.count({ where }),
    ]);

    return {
      data: applications,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAllRecruiterApplications(recruiterId: string, query: ApplicationQueryDto) {
    const { page = 1, limit = 10, status } = query;
    const skip = (page - 1) * limit;

    const where: any = { job: { recruiterId } };
    if (status) where.status = status;

    const [applications, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        skip,
        take: limit,
        orderBy: { appliedAt: 'desc' },
        include: {
          job: {
            include: {
              company: true,
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
          interviews: {
            orderBy: { scheduledAt: 'desc' },
            take: 1,
          },
        },
      }),
      this.prisma.application.count({ where }),
    ]);

    return {
      data: applications,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateApplicationStatus(
    applicationId: string,
    recruiterId: string,
    dto: UpdateApplicationStatusDto,
  ) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
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
      throw new ForbiddenException('You can only update applications for your own jobs');
    }

    if (application.status === 'ACCEPTED' || application.status === 'REJECTED') {
      throw new BadRequestException('Cannot update an already finalized application');
    }

    const updatedApplication = await this.prisma.application.update({
      where: { id: applicationId },
      data: { status: dto.status },
      include: {
        job: {
          include: {
            company: true,
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
      },
    });

    let notificationMessage = '';
    switch (dto.status) {
      case 'REVIEWED':
        notificationMessage = `Your application for ${application.job.title} has been reviewed`;
        break;
      case 'SHORTLISTED':
        notificationMessage = `Congratulations! You have been shortlisted for ${application.job.title}`;
        break;
      case 'REJECTED':
        notificationMessage = `Your application for ${application.job.title} has been rejected`;
        break;
      case 'ACCEPTED':
        notificationMessage = `Congratulations! Your application for ${application.job.title} has been accepted`;
        break;
      default:
        notificationMessage = `Your application status for ${application.job.title} has been updated to ${dto.status}`;
    }

    await this.prisma.notification.create({
      data: {
        userId: application.seekerId,
        type: 'APPLICATION',
        title: 'Application Status Update',
        message: notificationMessage,
        link: `/seeker/applications/${application.id}`,
      },
    });

    return updatedApplication;
  }

  async getRecruiterApplicationStats(recruiterId: string) {
    const applications = await this.prisma.application.findMany({
      where: { job: { recruiterId } },
      select: { status: true },
    });

    const stats = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: applications.length,
      stats,
    };
  }

  async deleteApplication(applicationId: string, seekerId: string) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.seekerId !== seekerId) {
      throw new ForbiddenException('You can only delete your own applications');
    }

    if (application.status !== 'PENDING') {
      throw new BadRequestException('Cannot withdraw application after it has been reviewed');
    }

    await this.prisma.application.delete({
      where: { id: applicationId },
    });

    return { message: 'Application withdrawn successfully' };
  }
}
