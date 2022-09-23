import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';

import { PrismaService } from './../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(authDto: LoginDto) {
    const { email, password } = authDto;

    const existedUser = await this.prisma.user.findFirst({
      where: { email },
    });
    if (!existedUser)
      throw new ForbiddenException('email is not exist, please register first');

    const PasswordIsCorrect = await argon.verify(
      existedUser.hashPassword,
      password,
    );
    if (!PasswordIsCorrect)
      throw new ForbiddenException('hey you enter wrong password, bro!');

    delete existedUser.hashPassword;

    return existedUser;
  }

  async register(authDto: RegisterDto) {
    const { email, name, password } = authDto;

    const hashPassword = await argon.hash(password);
    try {
      const createdUser = await this.prisma.user.create({
        data: {
          email,
          name,
          hashPassword,
        },
      });

      delete createdUser.hashPassword;
      return createdUser;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'Credential taken: email already existed',
          );
        }
      }
      throw error;
    }
  }
}
