import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { JobModule } from './modules/job/job.module';
import { CompanyModule } from './modules/company/company.module';
import { AuthModule } from './modules/auth/auth.module';
import { InterviewModule } from './modules/interview/interview.module';
import { ApplicationModule } from './modules/application/application.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    JobModule,
    CompanyModule,
    InterviewModule,
    ApplicationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
