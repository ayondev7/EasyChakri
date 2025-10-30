import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../../../../src/common/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../../../src/common/guards/optional-jwt-auth.guard';
import { CurrentUser } from '../../../../src/common/decorators/current-user.decorator';
import { SERVICES } from '../../../../src/common/constants/services';
import { JOB_PATTERNS } from '../../../../src/common/constants/message-patterns';
import { CreateJobDto, UpdateJobDto, JobQueryDto } from '../../../../src/modules/job/dto/job.dto';
import { firstValueFrom } from 'rxjs';

@Controller('jobs')
export class JobGatewayController {
  constructor(
    @Inject(SERVICES.JOB_SERVICE) private jobServiceClient: ClientProxy,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createJob(@CurrentUser() user: any, @Body() dto: CreateJobDto) {
    return firstValueFrom(
      this.jobServiceClient.send(JOB_PATTERNS.CREATE_JOB, { recruiterId: user.sub, dto })
    );
  }

  @Get('search/suggestions')
  async getSearchSuggestions(
    @Query('query') query: string,
    @Query('limit') limit?: number,
  ) {
    return firstValueFrom(
      this.jobServiceClient.send(JOB_PATTERNS.GET_SEARCH_SUGGESTIONS, { query, limit })
    );
  }

  @Get('analytics/experience')
  async getJobsByExperience() {
    return firstValueFrom(
      this.jobServiceClient.send(JOB_PATTERNS.GET_JOBS_BY_EXPERIENCE, {})
    );
  }

  @Get('analytics/category')
  async getJobsByCategory() {
    return firstValueFrom(
      this.jobServiceClient.send(JOB_PATTERNS.GET_JOBS_BY_CATEGORY, {})
    );
  }

  @Get('analytics/location')
  async getJobsByLocation(@Query('limit') limit?: number) {
    return firstValueFrom(
      this.jobServiceClient.send(JOB_PATTERNS.GET_JOBS_BY_LOCATION, { limit })
    );
  }

  @Get('analytics/skills')
  async getJobsBySkill(@Query('limit') limit?: number) {
    return firstValueFrom(
      this.jobServiceClient.send(JOB_PATTERNS.GET_JOBS_BY_SKILL, { limit })
    );
  }

  @Get('trending')
  async getTrendingSearches(@Query('limit') limit?: number) {
    return firstValueFrom(
      this.jobServiceClient.send(JOB_PATTERNS.GET_TRENDING_SEARCHES, { limit })
    );
  }

  @Get('recruiter')
  @UseGuards(JwtAuthGuard)
  async getRecruiterJobs(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return firstValueFrom(
      this.jobServiceClient.send(JOB_PATTERNS.GET_RECRUITER_JOBS, { recruiterId: user.sub, page, limit })
    );
  }

  @Get('recruiter/dashboard-stats')
  @UseGuards(JwtAuthGuard)
  async getRecruiterDashboardStats(@CurrentUser() user: any) {
    return firstValueFrom(
      this.jobServiceClient.send(JOB_PATTERNS.GET_RECRUITER_DASHBOARD_STATS, { recruiterId: user.sub })
    );
  }

  @Get('seeker/dashboard-stats')
  @UseGuards(JwtAuthGuard)
  async getSeekerDashboardStats(@CurrentUser() user: any) {
    return firstValueFrom(
      this.jobServiceClient.send(JOB_PATTERNS.GET_SEEKER_DASHBOARD_STATS, { seekerId: user.sub })
    );
  }

  @Get('seeker/applications')
  @UseGuards(JwtAuthGuard)
  async getSeekerApplications(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return firstValueFrom(
      this.jobServiceClient.send(JOB_PATTERNS.GET_SEEKER_APPLICATIONS, { seekerId: user.sub, page, limit })
    );
  }

  @Get('seeker/application-stats')
  @UseGuards(JwtAuthGuard)
  async getApplicationStats(@CurrentUser() user: any) {
    return firstValueFrom(
      this.jobServiceClient.send(JOB_PATTERNS.GET_APPLICATION_STATS, { seekerId: user.sub })
    );
  }

  @Post(':jobId/apply')
  @UseGuards(JwtAuthGuard)
  async applyForJob(@CurrentUser() user: any, @Param('jobId') jobId: string) {
    return firstValueFrom(
      this.jobServiceClient.send(JOB_PATTERNS.APPLY_FOR_JOB, { jobId, seekerId: user.sub })
    );
  }

  @Post(':jobId/save')
  @UseGuards(JwtAuthGuard)
  async saveJob(@CurrentUser() user: any, @Param('jobId') jobId: string) {
    return firstValueFrom(
      this.jobServiceClient.send(JOB_PATTERNS.SAVE_JOB, { jobId, userId: user.sub })
    );
  }

  @Delete(':jobId/unsave')
  @UseGuards(JwtAuthGuard)
  async unsaveJob(@CurrentUser() user: any, @Param('jobId') jobId: string) {
    return firstValueFrom(
      this.jobServiceClient.send(JOB_PATTERNS.UNSAVE_JOB, { jobId, userId: user.sub })
    );
  }

  @Get('saved')
  @UseGuards(JwtAuthGuard)
  async getSavedJobs(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return firstValueFrom(
      this.jobServiceClient.send(JOB_PATTERNS.GET_SAVED_JOBS, { userId: user.sub, page, limit })
    );
  }

  @Get('saved/:jobId')
  @UseGuards(JwtAuthGuard)
  async isJobSaved(@CurrentUser() user: any, @Param('jobId') jobId: string) {
    return firstValueFrom(
      this.jobServiceClient.send(JOB_PATTERNS.IS_JOB_SAVED, { jobId, userId: user.sub })
    );
  }

  @Get(':id/similar')
  async getSimilarJobs(@Param('id') id: string, @Query('limit') limit?: number) {
    return firstValueFrom(
      this.jobServiceClient.send(JOB_PATTERNS.GET_SIMILAR_JOBS, { jobId: id, limit })
    );
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async getJobById(@CurrentUser() user: any, @Param('id') id: string) {
    return firstValueFrom(
      this.jobServiceClient.send(JOB_PATTERNS.GET_JOB_BY_ID, { id, userId: user?.sub })
    );
  }

  @Get()
  async getJobs(@Query() query: JobQueryDto) {
    return firstValueFrom(
      this.jobServiceClient.send(JOB_PATTERNS.GET_JOBS, { query })
    );
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateJob(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateJobDto,
  ) {
    return firstValueFrom(
      this.jobServiceClient.send(JOB_PATTERNS.UPDATE_JOB, { jobId: id, recruiterId: user.sub, dto })
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteJob(@CurrentUser() user: any, @Param('id') id: string) {
    return firstValueFrom(
      this.jobServiceClient.send(JOB_PATTERNS.DELETE_JOB, { jobId: id, recruiterId: user.sub })
    );
  }
}
