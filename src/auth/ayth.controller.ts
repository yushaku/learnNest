import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //[POST] /auth/sign-up
  @Post('sign-out')
  signUp() {
    this.authService.signOut();
  }

  //[POST] /auth/login
  @Post('login')
  login() {
    this.authService.login();
  }
}
