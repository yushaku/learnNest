import { QUEUE_LIST } from '@/shared/constant'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'

@Processor(QUEUE_LIST.USER)
export class UserConsumer extends WorkerHost {
  constructor() {
    super()
  }

  async process(job: Job) {
    switch (job.name) {
      case 'CREATE_USER': {
        break
      }

      default:
        break
    }
  }
}
