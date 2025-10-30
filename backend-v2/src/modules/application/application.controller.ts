import { Controller, Get, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { UpdateApplicationStatusDto, ApplicationQueryDto } from './dto/application.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationController {
  constructor(private applicationService: ApplicationService) {}

  @Get('get-application-details/:id')
  async getApplication(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return await this.applicationService.getApplicationById(id, user.id);
  }

  @Get('job/:jobId/get-job-applications')
  async getJobApplications(
    @Param('jobId') jobId: string,
    @CurrentUser() user: any,
    @Query() query: ApplicationQueryDto,
  ) {
    return await this.applicationService.getJobApplications(jobId, user.id, query);
  }

  @Get('recruiter/all-applications')
  async getAllRecruiterApplications(
    @CurrentUser() user: any,
    @Query() query: ApplicationQueryDto,
  ) {
    return await this.applicationService.getAllRecruiterApplications(user.id, query);
  }

  @Put('update-application-status/:id')
  async updateApplicationStatus(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    const application = await this.applicationService.updateApplicationStatus(id, user.id, dto);
    return {
      message: 'Application status updated successfully',
      data: application,
    };
  }

  @Get('recruiter/application-statistics')
  async getRecruiterApplicationStats(@CurrentUser() user: any) {
    return await this.applicationService.getRecruiterApplicationStats(user.id);
  }

  @Get('seeker/my-applications')
  async getMyApplications(
    @CurrentUser() user: any,
    @Query() query: ApplicationQueryDto,
  ) {
    return await this.applicationService.getSeekerApplications(user.id, query);
  }

  @Get('seeker/application-statistics')
  async getSeekerApplicationStats(@CurrentUser() user: any) {
    return await this.applicationService.getSeekerApplicationStats(user.id);
  }

  @Delete('withdraw-application/:id')
  async withdrawApplication(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return await this.applicationService.deleteApplication(id, user.id);
  }
}
