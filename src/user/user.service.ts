import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'

import { LoginDTO, RegisterDTO } from './dto/user.dto'
import { PrismaService } from '@/prisma.service'

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async login({ email, password }: LoginDTO) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (user) {
      return ''
    }

    return ''
  }

  async register({ email, password, inviteCode }: RegisterDTO) {
    return ''
  }

  async genAccressToken(user: User) {}

  async genRefreshToken(user: User) {}

  async userInfo(address: string) {}
}
