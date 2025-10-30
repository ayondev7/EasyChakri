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
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  async getCurrentUser(@CurrentUser() user: any) {
    return await this.userService.getUserProfile(user.id);
  }

  @Get('profile-details')
  async getProfileDetails(@CurrentUser() user: any) {
    if (!user || !user.id) {
      throw new BadRequestException('Please sign in to continue.');
    }
    return await this.userService.getUserProfile(user.id);
  }

  @Get('get-profile-information')
  async getProfileInformation(@CurrentUser() user: any) {
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

  @Get('get-user/:id')
  async getUserById(@Param('id') id: string) {
    return await this.userService.getUserProfile(id);
  }

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

  @UseInterceptors(FileInterceptor('image'))
  @Put('me/upload-image')
  async uploadProfileImage(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Please select an image to upload.');
    }

    const uploadResult = await ImageUtil.uploadImage(
      file.buffer,
      file.originalname,
      'profile-images',
    );

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

  @Delete('me')
  async deleteAccount(@CurrentUser() user: any) {
    return await this.userService.deleteUser(user.id);
  }
}
