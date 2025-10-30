import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { PrismaModule } from '../../../../src/modules/prisma/prisma.module';
import { NotificationModule } from '../../../../src/modules/notification/notification.module';

@Module({
  imports: [PrismaModule, NotificationModule],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {}
