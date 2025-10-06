/**
 * JOB CONTROLLER
 * 
 * EXPRESS EQUIVALENT:
 * Public routes (GET): No auth required
 * Protected routes (POST, PUT, DELETE): Auth required with @UseGuards(JwtAuthGuard)
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto, UpdateJobDto, JobQueryDto } from './dto/job.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('jobs')
export class JobController {
  constructor(private jobService: JobService) {}

  /**
   * GET /api/jobs
   * Get all jobs with filters (Public)
   */
  @Get()
  async getAllJobs(@Query() query: JobQueryDto) {
    return await this.jobService.getJobs(query);
  }

  /**
   * GET /api/jobs/:id
   * Get job by ID (Public)
   */
  @Get(':id')
  async getJob(@Param('id') id: string) {
    return await this.jobService.getJobById(id);
  }

  /**
   * POST /api/jobs
   * Create new job (Protected - Recruiter only)
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  async createJob(
    @CurrentUser() user: any,
    @Body() dto: CreateJobDto,
  ) {
    const job = await this.jobService.createJob(user.id, dto);
    return {
      message: 'Job created successfully',
      data: job,
    };
  }

  /**
   * PUT /api/jobs/:id
   * Update job (Protected - Recruiter only, must own the job)
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateJob(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateJobDto,
  ) {
    const job = await this.jobService.updateJob(id, user.id, dto);
    return {
      message: 'Job updated successfully',
      data: job,
    };
  }

  /**
   * DELETE /api/jobs/:id
   * Delete job (Protected - Recruiter only, must own the job)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteJob(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return await this.jobService.deleteJob(id, user.id);
  }

  /**
   * GET /api/jobs/recruiter/my-jobs
   * Get jobs posted by current recruiter (Protected)
   */
  @Get('recruiter/my-jobs')
  @UseGuards(JwtAuthGuard)
  async getMyJobs(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.jobService.getRecruiterJobs(user.id, page, limit);
  }
}
