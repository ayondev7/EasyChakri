import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { PrismaModule } from '../prisma/prisma.module';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard';

@Module({
  imports: [PrismaModule],
  controllers: [JobController],
  providers: [JobService, OptionalJwtAuthGuard],
  exports: [JobService],
})
export class JobModule {}
