import { authModule } from './auth/auth.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [authModule],
})
export class AppModule {}
