import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
        phone: true,
        location: true,
        bio: true,
        skills: true,
        experience: true,
        education: true,
        resume: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('We couldn\'t find your account. Please sign in again.');
    }

    return {
      ...user,
      role: user.role.toLowerCase() as 'seeker' | 'recruiter',
    };
  }

  async updateUserProfile(userId: string, dto: UpdateUserDto) {
    const updateData: any = {};
    
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.phone !== undefined) updateData.phone = dto.phone;
    if (dto.location !== undefined) updateData.location = dto.location;
    if (dto.bio !== undefined) updateData.bio = dto.bio;
    if (dto.skills !== undefined) updateData.skills = dto.skills;
    if (dto.experience !== undefined) updateData.experience = dto.experience;
    if (dto.education !== undefined) updateData.education = dto.education;
    if (dto.image !== undefined) updateData.image = dto.image;
    if (dto.resume !== undefined) updateData.resume = dto.resume;

    if (Object.keys(updateData).length === 0) {
      return this.getUserProfile(userId);
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
        phone: true,
        location: true,
        bio: true,
        skills: true,
        experience: true,
        education: true,
        resume: true,
        updatedAt: true,
      },
    });

    return {
      ...user,
      role: user.role.toLowerCase() as 'seeker' | 'recruiter',
    };
  }

  async checkProfileComplete(userId: string) {
    console.log('checkProfileComplete called with userId:', userId);
    
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        phone: true,
        location: true,
        bio: true,
        skills: true,
        experience: true,
        education: true,
        resume: true,
      },
    });

    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      throw new NotFoundException('We couldn\'t find your account. Please sign in again.');
    }

    const missingFields: string[] = [];

    if (!user.name || user.name.trim() === '') {
      missingFields.push('name');
    }
    if (!user.phone || user.phone.trim() === '') {
      missingFields.push('phone');
    }
    if (!user.location || user.location.trim() === '') {
      missingFields.push('location');
    }
    if (!user.bio || user.bio.trim() === '') {
      missingFields.push('bio');
    }
    if (!user.skills || user.skills.length === 0) {
      missingFields.push('skills');
    }
    if (!user.experience || user.experience.trim() === '') {
      missingFields.push('experience');
    }
    if (!user.education || user.education.trim() === '') {
      missingFields.push('education');
    }
    if (!user.resume || user.resume.trim() === '') {
      missingFields.push('resume');
    }

    return {
      isComplete: missingFields.length === 0,
      missingFields,
    };
  }

  async deleteUser(userId: string) {
    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'User account deleted successfully' };
  }
}
