import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { TokenUtil } from '../../utils/token.util';
import { ImageUtil } from '../../utils/image.util';
import { generateUniqueCompanySlug } from '../../utils/slug.util';
import {
  CredentialSignupDto,
  CredentialSigninDto,
  GoogleSigninDto,
  AuthResponseDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async credentialSignup(
    dto: CredentialSignupDto,
    files?: {
      image?: Express.Multer.File[];
      companyLogo?: Express.Multer.File[];
    },
  ): Promise<AuthResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('This email is already registered. Please sign in or use a different email.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    let imageUrl: string | undefined = undefined;
    if (files?.image?.[0]) {
      const uploadResult = await ImageUtil.uploadImage(
        files.image[0].buffer,
        files.image[0].originalname,
        'users',
      );
      imageUrl = uploadResult.url;
    }

    if (dto.role === 'RECRUITER') {
      if (!dto.companyName || !dto.companyDescription || !dto.companyIndustry || !dto.companySize || !dto.companyLocation) {
        throw new BadRequestException('Please provide your company information to continue as a recruiter.');
      }

      let logoUrl: string | undefined = undefined;
      if (files?.companyLogo?.[0]) {
        const uploadResult = await ImageUtil.uploadImage(
          files.companyLogo[0].buffer,
          files.companyLogo[0].originalname,
          'companies',
        );
        logoUrl = uploadResult.url;
      }

      const user = await this.prisma.$transaction(async (tx) => {
        const slug = await generateUniqueCompanySlug(tx, dto.companyName);

        return await tx.user.create({
          data: {
            email: dto.email,
            password: hashedPassword,
            name: dto.name,
            role: dto.role,
            phone: dto.phone,
            dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
            image: imageUrl,
            location: dto.location,
            companyProfile: {
              create: {
                name: dto.companyName,
                slug: slug,
                description: dto.companyDescription,
                website: dto.companyWebsite,
                logo: logoUrl,
                industry: dto.companyIndustry,
                size: dto.companySize,
                location: dto.companyLocation,
              },
            },
          },
          include: {
            companyProfile: true,
          },
        });
      });

      const tokens = TokenUtil.generateTokens({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role.toLowerCase() as 'seeker' | 'recruiter',
          image: user.image,
        },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } else {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          name: dto.name,
          role: dto.role,
          phone: dto.phone,
          dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
          image: imageUrl,
          location: dto.location,
        },
      });

      const tokens = TokenUtil.generateTokens({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role.toLowerCase() as 'seeker' | 'recruiter',
          image: user.image,
        },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    }
  }

  async credentialSignin(dto: CredentialSigninDto): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('The email or password you entered is incorrect. Please try again.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('The email or password you entered is incorrect. Please try again.');
    }

    const tokens = TokenUtil.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.toLowerCase() as 'seeker' | 'recruiter',
        image: user.image,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async googleSignin(dto: GoogleSigninDto): Promise<AuthResponseDto> {
    let user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (user) {
      const tokens = TokenUtil.generateTokens({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role.toLowerCase() as 'seeker' | 'recruiter',
          image: user.image,
        },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } else {
      user = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          image: dto.image,
          role: 'SEEKER',
          password: '',
          providerId: 'google',
        },
      });

      const tokens = TokenUtil.generateTokens({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role.toLowerCase() as 'seeker' | 'recruiter',
          image: user.image,
        },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    }
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = TokenUtil.verifyToken(refreshToken);

      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user) {
        throw new UnauthorizedException('Your session has expired. Please sign in again.');
      }

      const accessToken = TokenUtil.generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Your session has expired. Please sign in again.');
    }
  }

  async verifyToken(token: string): Promise<{ user: { id: string; email: string; name: string; role: string; image?: string } }> {
    try {
      const payload = TokenUtil.verifyToken(token);

      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user) {
        throw new UnauthorizedException('Your session has expired. Please sign in again.');
      }

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role.toLowerCase() as 'seeker' | 'recruiter',
          image: user.image,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Your session has expired. Please sign in again.');
    }
  }
}
