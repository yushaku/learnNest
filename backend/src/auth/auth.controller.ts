import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() authDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(authDto);
    res.cookie('access_token', result.jwtToken);
    return { message: 'login successfully' };
  }

  @Post('register')
  async register(
    @Body() authDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(authDto);
    res.cookie('access_token', result.jwtToken);

    return {
      message: 'register successfully',
    };
  }
}
