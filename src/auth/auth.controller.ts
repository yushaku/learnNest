import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //[POST] /auth/login
  @Post('login')
  async login(@Body() authDto: LoginDto) {
    return await this.authService.login(authDto);
  }

  //[POST] /auth/signOut
  @Post('register')
  async register(@Body() authDto: RegisterDto) {
    return await this.authService.register(authDto);
  }
}
