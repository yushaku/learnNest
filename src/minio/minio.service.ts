import { Injectable } from '@nestjs/common';
import { InjectAwsService } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';

@Injectable()
export class MinioService {
  constructor(@InjectAwsService(S3) private readonly s3: S3) {}

  async upload(
    file: any,
    key: string,
    bucket: string = process.env.MINIO_BUCKET,
  ) {
    const s3Params = {
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
    };

    return this.s3.upload(s3Params, {}, (error, data) => {
      if (error) console.log(error);
      return data.Location;
    });
  }

  async getListBucket() {
    return (await this.s3.listBuckets().promise()).Buckets;
  }

  async listBucketContents(bucket: string) {
    const response = await this.s3.listObjectsV2({ Bucket: bucket }).promise();
    return response.Contents.map((c) => c.Key);
  }
}
