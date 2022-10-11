import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { authModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { MinioClientModule } from './minio-client/minio-client.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CommonModule,
    authModule,
    PrismaModule,
    UserModule,
    MinioClientModule,
    MessageModule,
  ],
  controllers: [UserController],
})
export class AppModule {}
