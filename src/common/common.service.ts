import { Injectable, Scope } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({ scope: Scope.REQUEST })
export class CommonService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  public createAccessToken(payload: Record<string, unknown>) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('jwtSecret'),
      expiresIn: this.configService.get('jwtTTL'),
    });
  }
}
