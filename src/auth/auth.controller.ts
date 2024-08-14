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
import { AuthService } from './auth.service'
import { CreateUserDto, UserDto } from './dto/user.dto'
import { ConfigService } from '@nestjs/config'
import { FastifyReply, FastifyRequest } from 'fastify'

@Controller('auth')
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
    await this.authService.register(userDto)
    return { message: 'please confirm your email' }
  }

  protected setToken(res: FastifyReply, { access_token, refresh_token }) {
    res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: this.isDevelopment ? 'lax' : 'strict',
      secure: this.isDevelopment ? false : true,
      path: '/',
    })
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: this.isDevelopment ? 'lax' : 'strict',
      secure: this.isDevelopment ? false : true,
      path: '/',
    })
    res.status(200).send({ message: 'Auth Successfully', access_token })
  }
}
