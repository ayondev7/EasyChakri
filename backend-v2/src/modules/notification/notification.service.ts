import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SocketGateway } from '../socket/socket.gateway';
import { GetNotificationsDto } from './dto/notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    private socketGateway: SocketGateway,
  ) {}

  async createNotification(data: {
    userId: string;
    type: 'APPLICATION' | 'JOB' | 'INTERVIEW' | 'SYSTEM';
    title: string;
    message: string;
    link?: string;
  }) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        link: data.link,
      },
    });

    this.socketGateway.emitToUser(data.userId, 'notification:new', notification);

    return notification;
  }

  async getNotifications(userId: string, query: GetNotificationsDto) {
    const { page = 1, limit = 20, type, unreadOnly } = query;
    const skip = (page - 1) * limit;

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const where: any = {
      userId,
      createdAt: { gte: ninetyDaysAgo },
    };

    if (type) where.type = type;
    if (unreadOnly) where.isRead = false;

    const [notifications, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where }),
      this.prisma.notification.count({
        where: {
          userId,
          isRead: false,
          createdAt: { gte: ninetyDaysAgo },
        },
      }),
    ]);

    return {
      data: notifications,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        unreadCount,
      },
    };
  }

  async markAsRead(userId: string, notificationIds?: string[]) {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const where: any = {
      userId,
      isRead: false,
      createdAt: { gte: ninetyDaysAgo },
    };

    if (notificationIds && notificationIds.length > 0) {
      where.id = { in: notificationIds };
    }

    await this.prisma.notification.updateMany({
      where,
      data: { isRead: true },
    });

    return { message: 'Notifications marked as read' };
  }

  async getUnreadCount(userId: string) {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const count = await this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
        createdAt: { gte: ninetyDaysAgo },
      },
    });

    return { unreadCount: count };
  }

  async deleteOldNotifications() {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    await this.prisma.notification.deleteMany({
      where: {
        createdAt: { lt: ninetyDaysAgo },
      },
    });
  }
}
