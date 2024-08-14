import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

@Injectable()
export class UserCronService {
  logger = new Logger(UserCronService.name)

  constructor() {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateTimeBase() {
    this.logger.log('this is a simple cron job')
  }
}
