/**
 * PRISMA SERVICE - Database Connection
 * 
 * EXPRESS EQUIVALENT: Your db.js file with Prisma client export
 * 
 * KEY DIFFERENCES:
 * - Express: Export prisma client directly: module.exports = new PrismaClient()
 * - NestJS: Use @Injectable() decorator for dependency injection
 * - NestJS: Lifecycle hooks (onModuleInit, onModuleDestroy) for connection management
 * - This service can be injected into any other service automatically
 */

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['query', 'error', 'warn'], // Log database queries in development
    });
  }

  // Connect to database when module initializes
  async onModuleInit() {
    await this.$connect();
    console.log('✅ Database connected successfully');
  }

  // Disconnect when application shuts down
  async onModuleDestroy() {
    await this.$disconnect();
    console.log('👋 Database disconnected');
  }
}
