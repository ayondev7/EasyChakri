import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApplicationService } from './application.service';
import { APPLICATION_PATTERNS } from '../../../../src/common/constants/message-patterns';
import { UpdateApplicationStatusDto, ApplicationQueryDto } from '../../../../src/modules/application/dto/application.dto';

@Controller()
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @MessagePattern(APPLICATION_PATTERNS.GET_APPLICATION_BY_ID)
  async getApplicationById(@Payload() data: { applicationId: string; userId: string }) {
    return this.applicationService.getApplicationById(data.applicationId, data.userId);
  }

  @MessagePattern(APPLICATION_PATTERNS.GET_JOB_APPLICATIONS)
  async getJobApplications(
    @Payload() data: { jobId: string; recruiterId: string; query: ApplicationQueryDto }
  ) {
    return this.applicationService.getJobApplications(data.jobId, data.recruiterId, data.query);
  }

  @MessagePattern(APPLICATION_PATTERNS.GET_ALL_RECRUITER_APPLICATIONS)
  async getAllRecruiterApplications(
    @Payload() data: { recruiterId: string; query: ApplicationQueryDto }
  ) {
    return this.applicationService.getAllRecruiterApplications(data.recruiterId, data.query);
  }

  @MessagePattern(APPLICATION_PATTERNS.UPDATE_APPLICATION_STATUS)
  async updateApplicationStatus(
    @Payload() data: { applicationId: string; recruiterId: string; dto: UpdateApplicationStatusDto }
  ) {
    return this.applicationService.updateApplicationStatus(data.applicationId, data.recruiterId, data.dto);
  }

  @MessagePattern(APPLICATION_PATTERNS.GET_RECRUITER_APPLICATION_STATS)
  async getRecruiterApplicationStats(@Payload() data: { recruiterId: string }) {
    return this.applicationService.getRecruiterApplicationStats(data.recruiterId);
  }

  @MessagePattern(APPLICATION_PATTERNS.GET_SEEKER_APPLICATIONS)
  async getSeekerApplications(@Payload() data: { seekerId: string; query: ApplicationQueryDto }) {
    return this.applicationService.getSeekerApplications(data.seekerId, data.query);
  }

  @MessagePattern(APPLICATION_PATTERNS.GET_SEEKER_APPLICATION_STATS)
  async getSeekerApplicationStats(@Payload() data: { seekerId: string }) {
    return this.applicationService.getSeekerApplicationStats(data.seekerId);
  }

  @MessagePattern(APPLICATION_PATTERNS.DELETE_APPLICATION)
  async deleteApplication(@Payload() data: { applicationId: string; seekerId: string }) {
    return this.applicationService.deleteApplication(data.applicationId, data.seekerId);
  }
}
