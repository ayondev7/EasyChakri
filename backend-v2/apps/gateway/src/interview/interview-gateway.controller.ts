import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../../../../src/common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../src/common/decorators/current-user.decorator';
import { SERVICES } from '../../../../src/common/constants/services';
import { INTERVIEW_PATTERNS } from '../../../../src/common/constants/message-patterns';
import { CreateInterviewDto, UpdateInterviewDto, InterviewQueryDto } from '../../../../src/modules/interview/dto/interview.dto';
import { firstValueFrom } from 'rxjs';

@Controller('interviews')
export class InterviewGatewayController {
  constructor(
    @Inject(SERVICES.INTERVIEW_SERVICE) private interviewServiceClient: ClientProxy,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createInterview(@CurrentUser() user: any, @Body() dto: CreateInterviewDto) {
    return firstValueFrom(
      this.interviewServiceClient.send(INTERVIEW_PATTERNS.CREATE_INTERVIEW, { recruiterId: user.sub, dto })
    );
  }

  @Get('recruiter')
  @UseGuards(JwtAuthGuard)
  async getRecruiterInterviews(
    @CurrentUser() user: any,
    @Query() query: InterviewQueryDto,
  ) {
    return firstValueFrom(
      this.interviewServiceClient.send(INTERVIEW_PATTERNS.GET_RECRUITER_INTERVIEWS, { recruiterId: user.sub, query })
    );
  }

  @Get('seeker')
  @UseGuards(JwtAuthGuard)
  async getSeekerInterviews(
    @CurrentUser() user: any,
    @Query() query: InterviewQueryDto,
  ) {
    return firstValueFrom(
      this.interviewServiceClient.send(INTERVIEW_PATTERNS.GET_SEEKER_INTERVIEWS, { seekerId: user.sub, query })
    );
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getInterviewStats(@CurrentUser() user: any) {
    return firstValueFrom(
      this.interviewServiceClient.send(INTERVIEW_PATTERNS.GET_INTERVIEW_STATS, { userId: user.sub, role: user.role })
    );
  }

  @Get('upcoming')
  @UseGuards(JwtAuthGuard)
  async getUpcomingInterviews(@CurrentUser() user: any) {
    return firstValueFrom(
      this.interviewServiceClient.send(INTERVIEW_PATTERNS.GET_UPCOMING_INTERVIEWS, { userId: user.sub, role: user.role })
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getInterviewById(@CurrentUser() user: any, @Param('id') id: string) {
    return firstValueFrom(
      this.interviewServiceClient.send(INTERVIEW_PATTERNS.GET_INTERVIEW_BY_ID, { interviewId: id, userId: user.sub })
    );
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateInterview(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateInterviewDto,
  ) {
    return firstValueFrom(
      this.interviewServiceClient.send(INTERVIEW_PATTERNS.UPDATE_INTERVIEW, { interviewId: id, userId: user.sub, dto })
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async cancelInterview(@CurrentUser() user: any, @Param('id') id: string) {
    return firstValueFrom(
      this.interviewServiceClient.send(INTERVIEW_PATTERNS.CANCEL_INTERVIEW, { interviewId: id, userId: user.sub })
    );
  }
}
