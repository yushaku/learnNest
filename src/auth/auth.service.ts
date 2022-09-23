import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  login() {
    console.log('call service');

    return { message: 'login' };
  }

  signOut() {
    return { message: 'signOut' };
  }
}
