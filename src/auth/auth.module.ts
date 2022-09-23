import { AuthController } from './ayth.controller';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class authModule {}
