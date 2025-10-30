import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InterviewService } from './interview.service';
import { INTERVIEW_PATTERNS } from '../../../../src/common/constants/message-patterns';
import { CreateInterviewDto, UpdateInterviewDto, InterviewQueryDto } from '../../../../src/modules/interview/dto/interview.dto';

@Controller()
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @MessagePattern(INTERVIEW_PATTERNS.CREATE_INTERVIEW)
  async createInterview(@Payload() data: { recruiterId: string; dto: CreateInterviewDto }) {
    return this.interviewService.createInterview(data.recruiterId, data.dto);
  }

  @MessagePattern(INTERVIEW_PATTERNS.UPDATE_INTERVIEW)
  async updateInterview(
    @Payload() data: { interviewId: string; userId: string; dto: UpdateInterviewDto }
  ) {
    return this.interviewService.updateInterview(data.interviewId, data.userId, data.dto);
  }

  @MessagePattern(INTERVIEW_PATTERNS.GET_INTERVIEW_BY_ID)
  async getInterviewById(@Payload() data: { interviewId: string; userId: string }) {
    return this.interviewService.getInterviewById(data.interviewId, data.userId);
  }

  @MessagePattern(INTERVIEW_PATTERNS.GET_RECRUITER_INTERVIEWS)
  async getRecruiterInterviews(@Payload() data: { recruiterId: string; query: InterviewQueryDto }) {
    return this.interviewService.getRecruiterInterviews(data.recruiterId, data.query);
  }

  @MessagePattern(INTERVIEW_PATTERNS.GET_SEEKER_INTERVIEWS)
  async getSeekerInterviews(@Payload() data: { seekerId: string; query: InterviewQueryDto }) {
    return this.interviewService.getSeekerInterviews(data.seekerId, data.query);
  }

  @MessagePattern(INTERVIEW_PATTERNS.CANCEL_INTERVIEW)
  async cancelInterview(@Payload() data: { interviewId: string; userId: string }) {
    return this.interviewService.cancelInterview(data.interviewId, data.userId);
  }

  @MessagePattern(INTERVIEW_PATTERNS.GET_INTERVIEW_STATS)
  async getInterviewStats(@Payload() data: { userId: string; role: string }) {
    return this.interviewService.getInterviewStats(data.userId, data.role);
  }

  @MessagePattern(INTERVIEW_PATTERNS.GET_UPCOMING_INTERVIEWS)
  async getUpcomingInterviews(@Payload() data: { userId: string; role: string }) {
    return this.interviewService.getUpcomingInterviews(data.userId, data.role);
  }
}
