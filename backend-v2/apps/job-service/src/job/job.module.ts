import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { PrismaModule } from '../../../../src/modules/prisma/prisma.module';
import { NotificationModule } from '../../../../src/modules/notification/notification.module';

@Module({
  imports: [PrismaModule, NotificationModule],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}
