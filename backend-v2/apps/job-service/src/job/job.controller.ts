import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JobService } from './job.service';
import { JOB_PATTERNS } from '../../../../src/common/constants/message-patterns';
import { CreateJobDto, UpdateJobDto, JobQueryDto } from '../../../../src/modules/job/dto/job.dto';

@Controller()
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @MessagePattern(JOB_PATTERNS.CREATE_JOB)
  async createJob(@Payload() data: { recruiterId: string; dto: CreateJobDto }) {
    return this.jobService.createJob(data.recruiterId, data.dto);
  }

  @MessagePattern(JOB_PATTERNS.GET_SEARCH_SUGGESTIONS)
  async getSearchSuggestions(@Payload() data: { query: string; limit?: number }) {
    return this.jobService.getSearchSuggestions(data.query, data.limit);
  }

  @MessagePattern(JOB_PATTERNS.GET_JOBS)
  async getJobs(@Payload() data: { query: JobQueryDto }) {
    return this.jobService.getJobs(data.query);
  }

  @MessagePattern(JOB_PATTERNS.GET_JOB_BY_ID)
  async getJobById(@Payload() data: { id: string; userId?: string }) {
    return this.jobService.getJobById(data.id, data.userId);
  }

  @MessagePattern(JOB_PATTERNS.UPDATE_JOB)
  async updateJob(@Payload() data: { jobId: string; recruiterId: string; dto: UpdateJobDto }) {
    return this.jobService.updateJob(data.jobId, data.recruiterId, data.dto);
  }

  @MessagePattern(JOB_PATTERNS.DELETE_JOB)
  async deleteJob(@Payload() data: { jobId: string; recruiterId: string }) {
    return this.jobService.deleteJob(data.jobId, data.recruiterId);
  }

  @MessagePattern(JOB_PATTERNS.GET_RECRUITER_JOBS)
  async getRecruiterJobs(@Payload() data: { recruiterId: string; page?: number; limit?: number }) {
    return this.jobService.getRecruiterJobs(data.recruiterId, data.page, data.limit);
  }

  @MessagePattern(JOB_PATTERNS.GET_JOBS_BY_EXPERIENCE)
  async getJobsByExperience() {
    return this.jobService.getJobsByExperience();
  }

  @MessagePattern(JOB_PATTERNS.GET_JOBS_BY_CATEGORY)
  async getJobsByCategory() {
    return this.jobService.getJobsByCategory();
  }

  @MessagePattern(JOB_PATTERNS.GET_JOBS_BY_LOCATION)
  async getJobsByLocation(@Payload() data: { limit?: number }) {
    return this.jobService.getJobsByLocation(data.limit);
  }

  @MessagePattern(JOB_PATTERNS.GET_JOBS_BY_SKILL)
  async getJobsBySkill(@Payload() data: { limit?: number }) {
    return this.jobService.getJobsBySkill(data.limit);
  }

  @MessagePattern(JOB_PATTERNS.GET_TRENDING_SEARCHES)
  async getTrendingSearches(@Payload() data: { limit?: number }) {
    return this.jobService.getTrendingSearches(data.limit);
  }

  @MessagePattern(JOB_PATTERNS.GET_SIMILAR_JOBS)
  async getSimilarJobs(@Payload() data: { jobId: string; limit?: number }) {
    return this.jobService.getSimilarJobs(data.jobId, data.limit);
  }

  @MessagePattern(JOB_PATTERNS.APPLY_FOR_JOB)
  async applyForJob(@Payload() data: { jobId: string; seekerId: string }) {
    return this.jobService.applyForJob(data.jobId, data.seekerId);
  }

  @MessagePattern(JOB_PATTERNS.SAVE_JOB)
  async saveJob(@Payload() data: { jobId: string; userId: string }) {
    return this.jobService.saveJob(data.jobId, data.userId);
  }

  @MessagePattern(JOB_PATTERNS.UNSAVE_JOB)
  async unsaveJob(@Payload() data: { jobId: string; userId: string }) {
    return this.jobService.unsaveJob(data.jobId, data.userId);
  }

  @MessagePattern(JOB_PATTERNS.GET_SAVED_JOBS)
  async getSavedJobs(@Payload() data: { userId: string; page?: number; limit?: number }) {
    return this.jobService.getSavedJobs(data.userId, data.page, data.limit);
  }

  @MessagePattern(JOB_PATTERNS.IS_JOB_SAVED)
  async isJobSaved(@Payload() data: { jobId: string; userId: string }) {
    return this.jobService.isJobSaved(data.jobId, data.userId);
  }

  @MessagePattern(JOB_PATTERNS.GET_RECRUITER_DASHBOARD_STATS)
  async getRecruiterDashboardStats(@Payload() data: { recruiterId: string }) {
    return this.jobService.getRecruiterDashboardStats(data.recruiterId);
  }

  @MessagePattern(JOB_PATTERNS.GET_SEEKER_DASHBOARD_STATS)
  async getSeekerDashboardStats(@Payload() data: { seekerId: string }) {
    return this.jobService.getSeekerDashboardStats(data.seekerId);
  }

  @MessagePattern(JOB_PATTERNS.GET_SEEKER_APPLICATIONS)
  async getSeekerApplications(@Payload() data: { seekerId: string; page?: number; limit?: number }) {
    return this.jobService.getSeekerApplications(data.seekerId, data.page, data.limit);
  }

  @MessagePattern(JOB_PATTERNS.GET_APPLICATION_STATS)
  async getApplicationStats(@Payload() data: { seekerId: string }) {
    return this.jobService.getApplicationStats(data.seekerId);
  }
}
