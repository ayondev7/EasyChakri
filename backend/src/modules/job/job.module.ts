import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationModule } from '../notification/notification.module';
import { RedisModule } from '../redis/redis.module';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard';

@Module({
  imports: [PrismaModule, NotificationModule, RedisModule],
  controllers: [JobController],
  providers: [JobService, OptionalJwtAuthGuard],
  exports: [JobService],
})
export class JobModule {}
