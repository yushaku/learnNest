import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';

import { PrismaService } from './../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto';
import { JwtService } from '@nestjs/jwt';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async login(authDto: LoginDto): Promise<{ jwtToken: string }> {
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

    const jwtToken = await this.signToken(existedUser.id, existedUser.email);
    return { jwtToken };
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

  async signToken(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };

    return this.jwt.signAsync(payload, {
      expiresIn: this.config.get('EXPIRED_IN'),
      secret: this.config.get('JWT_SECRET'),
    });
  }
}
