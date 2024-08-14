import { JwtDecoded, JwtUser } from '@/shared/decorators'
import { AuthGuard } from '@/shared/guard/auth.guard'
import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { FastifyReply } from 'fastify'
import { LoginDTO, RegisterDTO } from './dto/user.dto'
import { UserService } from './user.service'

@ApiBearerAuth()
@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(
    @Body() data: LoginDTO,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const access_token = await this.userService.login(data)
    res.setCookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000,
    })

    res.send({ token: access_token })
  }

  @Post('register')
  async register(
    @Body() data: RegisterDTO,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const access_token = await this.userService.register(data)
    res.setCookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000,
    })

    res.send({ token: access_token })
  }

  @Get('info')
  @UseGuards(AuthGuard)
  info(@JwtUser() { address }: JwtDecoded) {
    return this.userService.userInfo(address)
  }
}
