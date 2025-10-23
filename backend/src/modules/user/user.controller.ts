/**
 * USER CONTROLLER
 * 
 * EXPRESS EQUIVALENT: User profile routes
 * All routes here require authentication (protected with JwtAuthGuard)
 */

import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ImageUtil } from '../../utils/image.util';

@Controller('users')
@UseGuards(JwtAuthGuard) // All routes in this controller require authentication
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * GET /api/users/me
   * Get current user profile
   */
  @Get('me')
  async getCurrentUser(@CurrentUser() user: any) {
    return await this.userService.getUserProfile(user.id);
  }

  /**
   * GET /api/users/profile-details
   * Get current user full profile details (for profile page)
   */
  @Get('profile-details')
  async getProfileDetails(@CurrentUser() user: any) {
    if (!user || !user.id) {
      throw new BadRequestException('Please sign in to continue.');
    }
    return await this.userService.getUserProfile(user.id);
  }

  @Get('profile-status')
  async checkProfileComplete(@CurrentUser() user: any) {
    console.log('Check profile complete - user from decorator:', user);
    if (!user || !user.id) {
      throw new BadRequestException('Please sign in to continue.');
    }
    return await this.userService.checkProfileComplete(user.id);
  }

  /**
   * GET /api/users/get-user/:id
   * Get user profile by ID (public)
   */
  @Get('get-user/:id')
  async getUserById(@Param('id') id: string) {
    return await this.userService.getUserProfile(id);
  }

  /**
   * PUT /api/users/me
   * Update current user profile
   */
  @Put('me')
  async updateProfile(
    @CurrentUser() user: any,
    @Body() dto: UpdateUserDto,
  ) {
    const updatedUser = await this.userService.updateUserProfile(user.id, dto);
    return {
      message: 'Profile updated successfully',
      data: updatedUser,
    };
  }

  /**
   * POST /api/users/me/upload-image
   * Upload profile image
   */
  @UseInterceptors(FileInterceptor('image'))
  @Put('me/upload-image')
  async uploadProfileImage(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Please select an image to upload.');
    }

    // Upload image using ImageUtil
    const uploadResult = await ImageUtil.uploadImage(
      file.buffer,
      file.originalname,
      'profile-images',
    );

    // Update user with new image URL
    const updatedUser = await this.userService.updateUserProfile(user.id, {
      image: uploadResult.url,
    });

    return {
      message: 'Profile image uploaded successfully',
      data: {
        image: uploadResult.url,
      },
    };
  }

  /**
   * DELETE /api/users/me
   * Delete current user account
   */
  @Delete('me')
  async deleteAccount(@CurrentUser() user: any) {
    return await this.userService.deleteUser(user.id);
  }
}
