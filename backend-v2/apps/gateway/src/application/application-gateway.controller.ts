import { Controller, Get, Put, Delete, Body, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../../../../src/common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../src/common/decorators/current-user.decorator';
import { SERVICES } from '../../../../src/common/constants/services';
import { APPLICATION_PATTERNS } from '../../../../src/common/constants/message-patterns';
import { UpdateApplicationStatusDto, ApplicationQueryDto } from '../../../../src/modules/application/dto/application.dto';
import { firstValueFrom } from 'rxjs';

@Controller('applications')
export class ApplicationGatewayController {
  constructor(
    @Inject(SERVICES.APPLICATION_SERVICE) private applicationServiceClient: ClientProxy,
  ) {}

  @Get('recruiter')
  @UseGuards(JwtAuthGuard)
  async getAllRecruiterApplications(
    @CurrentUser() user: any,
    @Query() query: ApplicationQueryDto,
  ) {
    return firstValueFrom(
      this.applicationServiceClient.send(APPLICATION_PATTERNS.GET_ALL_RECRUITER_APPLICATIONS, { recruiterId: user.sub, query })
    );
  }

  @Get('recruiter/stats')
  @UseGuards(JwtAuthGuard)
  async getRecruiterApplicationStats(@CurrentUser() user: any) {
    return firstValueFrom(
      this.applicationServiceClient.send(APPLICATION_PATTERNS.GET_RECRUITER_APPLICATION_STATS, { recruiterId: user.sub })
    );
  }

  @Get('seeker')
  @UseGuards(JwtAuthGuard)
  async getSeekerApplications(
    @CurrentUser() user: any,
    @Query() query: ApplicationQueryDto,
  ) {
    return firstValueFrom(
      this.applicationServiceClient.send(APPLICATION_PATTERNS.GET_SEEKER_APPLICATIONS, { seekerId: user.sub, query })
    );
  }

  @Get('seeker/stats')
  @UseGuards(JwtAuthGuard)
  async getSeekerApplicationStats(@CurrentUser() user: any) {
    return firstValueFrom(
      this.applicationServiceClient.send(APPLICATION_PATTERNS.GET_SEEKER_APPLICATION_STATS, { seekerId: user.sub })
    );
  }

  @Get('job/:jobId')
  @UseGuards(JwtAuthGuard)
  async getJobApplications(
    @CurrentUser() user: any,
    @Param('jobId') jobId: string,
    @Query() query: ApplicationQueryDto,
  ) {
    return firstValueFrom(
      this.applicationServiceClient.send(APPLICATION_PATTERNS.GET_JOB_APPLICATIONS, { jobId, recruiterId: user.sub, query })
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getApplicationById(@CurrentUser() user: any, @Param('id') id: string) {
    return firstValueFrom(
      this.applicationServiceClient.send(APPLICATION_PATTERNS.GET_APPLICATION_BY_ID, { applicationId: id, userId: user.sub })
    );
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateApplicationStatus(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    return firstValueFrom(
      this.applicationServiceClient.send(APPLICATION_PATTERNS.UPDATE_APPLICATION_STATUS, { applicationId: id, recruiterId: user.sub, dto })
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteApplication(@CurrentUser() user: any, @Param('id') id: string) {
    return firstValueFrom(
      this.applicationServiceClient.send(APPLICATION_PATTERNS.DELETE_APPLICATION, { applicationId: id, seekerId: user.sub })
    );
  }
}
