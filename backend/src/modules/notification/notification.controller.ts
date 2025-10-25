import {
  Controller,
  Get,
  Put,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { GetNotificationsDto, MarkAsReadDto } from './dto/notification.dto';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  async getNotifications(
    @CurrentUser() user: any,
    @Query() query: GetNotificationsDto,
  ) {
    return this.notificationService.getNotifications(user.id, query);
  }

  @Get('unread-count')
  async getUnreadCount(@CurrentUser() user: any) {
    return this.notificationService.getUnreadCount(user.id);
  }

  @Put('mark-as-read')
  async markAsRead(
    @CurrentUser() user: any,
    @Body() dto: MarkAsReadDto,
  ) {
    return this.notificationService.markAsRead(user.id, dto.notificationIds);
  }
}
