import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards 
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto, UpdateJobDto, JobQueryDto } from './dto/job.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('jobs')
export class JobController {
  constructor(private jobService: JobService) {}

  @Get('get-jobs')
  async getAllJobs(@Query() query: JobQueryDto) {
    return await this.jobService.getJobs(query);
  }

  @Get('get-job-details/:id')
  async getJob(@Param('id') id: string) {
    return await this.jobService.getJobById(id);
  }

  @Post('create-job')
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

  @Put('update-job/:id')
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

  @Delete('delete-job/:id')
  @UseGuards(JwtAuthGuard)
  async deleteJob(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return await this.jobService.deleteJob(id, user.id);
  }

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
