import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Headers,
  UnauthorizedException,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import {
  CredentialSignupDto,
  CredentialSigninDto,
  GoogleSigninDto,
} from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'companyLogo', maxCount: 1 },
    ]),
  )
  async signup(
    @Body() dto: CredentialSignupDto,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      companyLogo?: Express.Multer.File[];
    },
  ) {
    const result = await this.authService.credentialSignup(dto, files);
    return {
      message: 'User registered successfully',
      data: result,
    };
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() dto: CredentialSigninDto) {
    const result = await this.authService.credentialSignin(dto);
    return {
      message: 'Login successful',
      data: result,
    };
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  async googleAuth(@Body() dto: GoogleSigninDto) {
    const result = await this.authService.googleSignin(dto);
    return {
      message: 'Google authentication successful',
      data: result,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    const result = await this.authService.refreshToken(refreshToken);
    return {
      message: 'Token refreshed successfully',
      data: result,
    };
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifyToken(@Headers('authorization') authorization: string) {
    if (!authorization) {
      throw new UnauthorizedException('Please sign in to continue.');
    }

    const token = authorization.replace('Bearer ', '');
    const result = await this.authService.verifyToken(token);
    return {
      message: 'Token is valid',
      data: result,
    };
  }
}
