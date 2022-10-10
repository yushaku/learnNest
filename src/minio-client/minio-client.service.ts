import * as crypto from 'crypto';
import { MinioService } from 'nestjs-minio-client';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class MinioClientService {
  constructor(private readonly minio: MinioService) {
    // this.minio.client.setBucketPolicy(
    //   process.env.MINIO_BUCKET_NAME,
    //   JSON.stringify(policy),
    //   function (err) {
    //     if (err) console.log(err);
    //     console.log('Bucket policy set');
    //   },
    // );
  }

  async upload(file: any, bucketName = 'yushaku') {
    if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
      throw new HttpException(
        'File type not supported',
        HttpStatus.BAD_REQUEST,
      );
    }

    const timestamp = Date.now().toString();
    const hashedFileName = crypto
      .createHash('md5')
      .update(timestamp)
      .digest('hex');

    const extension = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    );
    const fileName = hashedFileName + extension;

    this.minio.client.putObject(
      bucketName,
      fileName,
      file.buffer,
      file.size,
      function (err, res) {
        if (err) {
          throw new HttpException(
            'Error uploading file: ' + err,
            HttpStatus.BAD_REQUEST,
          );
        }
        console.log(res.etag);
      },
    );
    return {
      url: `${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${process.env.MINIO_BUCKET_NAME}/${fileName}`,
    };
  }

  async delete(objetName: string, bucketName = 'yushaku') {
    return this.minio.client.removeObject(
      bucketName,
      objetName,
      function (err) {
        if (err)
          throw new HttpException(
            'An error occurred when deleting!',
            HttpStatus.BAD_REQUEST,
          );
      },
    );
  }

  async getOne(objetName: string, bucketName = 'yushaku') {
    const data = await this.minio.client.getObject(bucketName, objetName);

    return data;
  }

  async getMany(bucketName = 'yushaku') {
    return this.minio.client.listBuckets();
  }
}

const policy = {
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Principal: {
        AWS: ['*'],
      },
      Action: [
        's3:ListBucketMultipartUploads',
        's3:GetBucketLocation',
        's3:ListBucket',
      ],
      Resource: ['arn:aws:s3:::yushaku'],
    },
    {
      Effect: 'Allow',
      Principal: {
        AWS: ['*'],
      },
      Action: [
        's3:PutObject',
        's3:AbortMultipartUpload',
        's3:DeleteObject',
        's3:GetObject',
        's3:ListMultipartUploadParts',
      ],
      Resource: ['arn:aws:s3:::yushaku/*'],
    },
  ],
};
