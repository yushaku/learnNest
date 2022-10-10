import { SharedIniFileCredentials } from 'aws-sdk';
import { AwsSdkModule } from 'nest-aws-sdk';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { authModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { MinioClientModule } from './minio-client/minio-client.module';
import { MinioModule } from './minio/minio.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AwsSdkModule.forRootAsync({
      defaultServiceOptions: {
        useValue: {
          region: 'us-east-1',
          credentials: new SharedIniFileCredentials({
            profile: 'my-profile',
          }),
        },
      },
    }),
    CommonModule,
    authModule,
    PrismaModule,
    UserModule,
    MinioModule,
    MinioClientModule,
    MessageModule,
  ],
  controllers: [UserController],
})
export class AppModule {}
