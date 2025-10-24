import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { CreateInterviewDto, UpdateInterviewDto, InterviewQueryDto } from './dto/interview.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('interviews')
@UseGuards(JwtAuthGuard)
export class InterviewController {
  constructor(private interviewService: InterviewService) {}

  @Post('schedule-interview')
  async scheduleInterview(
    @CurrentUser() user: any,
    @Body() dto: CreateInterviewDto,
  ) {
    const interview = await this.interviewService.createInterview(user.id, dto);
    return {
      message: 'Interview scheduled successfully',
      data: interview,
    };
  }

  @Put('update-interview/:id')
  async updateInterview(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateInterviewDto,
  ) {
    const interview = await this.interviewService.updateInterview(id, user.id, dto);
    return {
      message: 'Interview updated successfully',
      data: interview,
    };
  }

  @Get('get-interview-details/:id')
  async getInterview(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return await this.interviewService.getInterviewById(id, user.id);
  }

  @Get('recruiter/my-interviews')
  async getRecruiterInterviews(
    @CurrentUser() user: any,
    @Query() query: InterviewQueryDto,
  ) {
    return await this.interviewService.getRecruiterInterviews(user.id, query);
  }

  @Get('seeker/my-interviews')
  async getSeekerInterviews(
    @CurrentUser() user: any,
    @Query() query: InterviewQueryDto,
  ) {
    return await this.interviewService.getSeekerInterviews(user.id, query);
  }

  @Delete('cancel-interview/:id')
  async cancelInterview(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return await this.interviewService.cancelInterview(id, user.id);
  }

  @Get('interview-statistics')
  async getInterviewStats(@CurrentUser() user: any) {
    return await this.interviewService.getInterviewStats(user.id, user.role);
  }

  @Get('upcoming-interviews')
  async getUpcomingInterviews(@CurrentUser() user: any) {
    return await this.interviewService.getUpcomingInterviews(user.id, user.role);
  }
}
