import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get user profile by ID
   */
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
      throw new NotFoundException('User not found');
    }

    return {
      ...user,
      role: user.role.toLowerCase() as 'seeker' | 'recruiter',
    };
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
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
      throw new NotFoundException('User not found');
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

  /**
   * Delete user account
   */
  async deleteUser(userId: string) {
    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'User account deleted successfully' };
  }
}
