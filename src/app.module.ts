import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TerminusModule } from '@nestjs/terminus'
import { LoggerModule } from 'nestjs-pino'
import { AppController } from './app.controller'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'

import Joi from 'joi'
import { ShareModule } from './shared/share.module'

const { NODE_ENV = 'development' } = process.env
const isProd = NODE_ENV === 'production'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.string().required(),

        JWT_SECRET: Joi.string().required(),
        COOKIE_SECRET: Joi.string().required(),

        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
      }),
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: true,
      },
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: isProd ? 'info' : 'debug',
        transport: {
          target: 'pino-pretty',
          options: { singleLine: true, ignore: 'pid,hostname' },
        },
        autoLogging: isProd ? false : false,
        quietReqLogger: true,
      },
    }),
    TerminusModule,
    UserModule,
    AuthModule,
    ShareModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
