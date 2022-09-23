import { authModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [authModule, PrismaModule],
})
export class AppModule {}
