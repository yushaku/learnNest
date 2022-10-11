import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  getUserImage() {
    return;
  }

  uploadUserImage(userId: number, url: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { imageLink: url },
      select: {
        name: true,
        email: true,
        imageLink: true,
      },
    });
  }

  getOne(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        imageLink: true,
      },
    });
  }

  getAll() {
    return this.prisma.user.findMany();
  }
}
