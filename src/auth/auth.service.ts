import { PrismaService } from '@/prisma.service'
import { JWTService } from '@/shared/jwt.service'
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { CreateUserDto, UserDto } from './dto/user.dto'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JWTService,
  ) {}

  async login({ email, password }: UserDto) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) throw new NotFoundException("User's email does not exist")

    await this.verifyPassword(password, user.password)
    const { access_token, refresh_token } = this.jwt.genToken({
      userId: user.id,
    })

    return { access_token, refresh_token }
  }

  async register(userDto: CreateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: userDto.email },
    })
    if (user) throw new BadRequestException("email's user already existed")

    await this.createAccount(userDto)
  }

  async googleAuth(user: CreateUserDto) {
    const existedUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    })
    if (!existedUser) return this.createAccount(user)

    const { access_token, refresh_token } = this.jwt.genToken({
      userId: existedUser.id,
    })

    return { access_token, refresh_token }
  }

  async createAccount(userDto: CreateUserDto) {
    const saltRounds = 10

    const existedUser = await this.prisma.user.findUnique({
      where: { email: userDto.email },
    })
    if (existedUser)
      throw new BadRequestException("email's user already existed")

    const hash: string = await bcrypt.hash(userDto.password, saltRounds)

    const user = await this.prisma.user.create({
      data: {
        name: userDto.name,
        email: userDto.email,
        password: hash,
      },
    })

    const { access_token, refresh_token } = this.jwt.genToken({
      userId: user.id,
    })

    return { access_token, refresh_token }
  }

  async verifyPassword(rawPass: string, hashedPass: string) {
    const isMatching = await bcrypt.compare(rawPass, hashedPass)
    if (!isMatching) {
      throw new HttpException('Wrong credentials', HttpStatus.BAD_REQUEST)
    }
  }
}
