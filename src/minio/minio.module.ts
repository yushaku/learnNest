import { S3 } from 'aws-sdk';
import { AwsSdkModule } from 'nest-aws-sdk';

import { Global, Module } from '@nestjs/common';

import { MinioService } from './minio.service';

@Global()
@Module({
  imports: [AwsSdkModule.forFeatures([S3])],
  providers: [MinioService],
  exports: [MinioService],
})
export class MinioModule {}
