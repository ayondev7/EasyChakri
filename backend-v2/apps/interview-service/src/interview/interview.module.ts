import { Module } from '@nestjs/common';
import { InterviewController } from './interview.controller';
import { InterviewService } from './interview.service';
import { PrismaModule } from '../../../../src/modules/prisma/prisma.module';
import { NotificationModule } from '../../../../src/modules/notification/notification.module';

@Module({
  imports: [PrismaModule, NotificationModule],
  controllers: [InterviewController],
  providers: [InterviewService],
})
export class InterviewModule {}
