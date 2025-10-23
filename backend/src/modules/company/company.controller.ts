/**
 * COMPANY CONTROLLER
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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CompanyService } from './company.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ImageUtil } from '../../utils/image.util';

@Controller('companies')
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Get('stats/by-industry')
  async getCompaniesByIndustry() {
    return await this.companyService.getCompaniesByIndustry();
  }

  @Get('recruiter/my-company')
  @UseGuards(JwtAuthGuard)
  async getMyCompany(@CurrentUser() user: any) {
    return await this.companyService.getRecruiterCompany(user.id);
  }

  @Get('get-companies')
  async getAllCompanies(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.companyService.getAllCompanies(page, limit);
  }

  @Get('get-company/:id')
  async getCompany(@Param('id') id: string) {
    return await this.companyService.getCompanyById(id);
  }

  /**
   * POST /api/companies/create-company
   * Create company profile (Protected - Recruiter only)
   */
  @Post('create-company')
  @UseGuards(JwtAuthGuard)
  async createCompany(
    @CurrentUser() user: any,
    @Body() dto: CreateCompanyDto,
  ) {
    const company = await this.companyService.createCompany(user.id, dto);
    return {
      message: 'Company created successfully',
      data: company,
    };
  }

  /**
   * PUT /api/companies/update-company/:id
   * Update company (Protected - Recruiter only, must own the company)
   */
  @Put('update-company/:id')
  @UseGuards(JwtAuthGuard)
  async updateCompany(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateCompanyDto,
  ) {
    const company = await this.companyService.updateCompany(id, user.id, dto);
    return {
      message: 'Company updated successfully',
      data: company,
    };
  }

  /**
   * PUT /api/companies/upload-logo/:id
   * Upload company logo (Protected)
   */
  @UseInterceptors(FileInterceptor('logo'))
  @Put('upload-logo/:id')
  @UseGuards(JwtAuthGuard)
  async uploadLogo(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Upload logo using ImageUtil
    const uploadResult = await ImageUtil.uploadImage(
      file.buffer,
      file.originalname,
      'company-logos',
    );

    // Update company with new logo URL
    const company = await this.companyService.updateCompany(id, user.id, {
      logo: uploadResult.url,
    });

    return {
      message: 'Company logo uploaded successfully',
      data: {
        logo: uploadResult.url,
      },
    };
  }

  /**
   * DELETE /api/companies/delete-company/:id
   * Delete company (Protected - Recruiter only, must own the company)
   */
  @Delete('delete-company/:id')
  @UseGuards(JwtAuthGuard)
  async deleteCompany(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return await this.companyService.deleteCompany(id, user.id);
  }
}
