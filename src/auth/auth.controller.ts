import { TOKEN } from '@/shared/constant'
import { GoogleOAuthGuard } from '@/shared/guard'
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ThrottlerGuard } from '@nestjs/throttler'
import { FastifyReply, FastifyRequest } from 'fastify'
import { AuthService } from './auth.service'
import { CreateUserDto, UserDto } from './dto/user.dto'

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  private isDevelopment: boolean

  constructor(
    private authService: AuthService,
    private config: ConfigService,
  ) {
    this.isDevelopment =
      this.config.get('NODE_ENV') === 'development' ? true : false
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  googleLogin() {
    return
  }

  @Get('google/redirect')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(
    @Req() req: FastifyRequest & { user: CreateUserDto },
    @Res() res: FastifyReply,
  ) {
    const user = req.user as CreateUserDto
    const token = await this.authService.googleAuth(user)

    this.setToken(res, token)
    res.redirect(this.config.get('CLIENT_URL') ?? 'http://localhost:3000')
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() userDto: UserDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const token = await this.authService.login(userDto)
    this.setToken(res, token)
  }

  @Post('register')
  async register(@Body() userDto: CreateUserDto) {
    const { access_token } = await this.authService.register(userDto)

    return { message: 'Auth Successfully', access_token }
  }

  @Post('logout')
  @HttpCode(200)
  async logOut(@Res({ passthrough: true }) res: FastifyReply) {
    res.clearCookie(TOKEN.ACCESS)
    res.clearCookie(TOKEN.REFRESH)
  }

  protected setToken(res: FastifyReply, { access_token, refresh_token }) {
    res.cookie(TOKEN.ACCESS, access_token, {
      httpOnly: true,
      sameSite: this.isDevelopment ? 'lax' : 'strict',
      secure: this.isDevelopment ? false : true,
      path: '/',
    })
    res.cookie(TOKEN.REFRESH, refresh_token, {
      httpOnly: true,
      sameSite: this.isDevelopment ? 'lax' : 'strict',
      secure: this.isDevelopment ? false : true,
      path: '/',
    })
    res.status(200).send({ message: 'Auth Successfully', access_token })
  }
}
