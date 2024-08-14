import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { ScheduleModule } from '@nestjs/schedule'
import { UserCronService } from './user.cron'
import { UserConsumer } from './user.consumer'
import { BullModule } from '@nestjs/bullmq'
import { QUEUE_LIST } from '@/shared/constant'
import { PrismaService } from '@/prisma.service'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BullModule.registerQueue({ name: QUEUE_LIST.USER }),
  ],
  controllers: [UserController],
  providers: [UserService, UserCronService, UserConsumer, PrismaService],
})
export class UserModule {}
