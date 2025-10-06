/**
 * APP.MODULE.TS - Root Module
 * 
 * EXPRESS EQUIVALENT: Your main app.js where you import and configure everything
 * 
 * KEY DIFFERENCES:
 * - Express: You manually import routes and use app.use()
 * - NestJS: Modules are declared with @Module decorator
 * - Everything is organized in modules (feature-based architecture)
 * - Dependency Injection is built-in (no need for manual passing of dependencies)
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { JobModule } from './modules/job/job.module';
import { CompanyModule } from './modules/company/company.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    // ConfigModule - loads environment variables
    // Express equivalent: require('dotenv').config()
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available everywhere without importing
      envFilePath: '.env',
    }),

    // Database Module - Prisma
    // Express equivalent: your db.js connection file
    PrismaModule,

    // Feature Modules - organized by domain
    // Express equivalent: app.use('/api/users', userRoutes)
    AuthModule,
    UserModule,
    JobModule,
    CompanyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
