/**
 * PRISMA MODULE
 * 
 * EXPRESS EQUIVALENT: Not needed in Express - you just import db.js where needed
 * 
 * KEY DIFFERENCE:
 * - NestJS uses modules to organize code and manage dependencies
 * - This makes PrismaService available to other modules via dependency injection
 * - Just import PrismaModule in any module that needs database access
 */

import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Makes PrismaService available globally without importing PrismaModule everywhere
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Export so other modules can inject it
})
export class PrismaModule {}
