import { Injectable } from '@nestjs/common';
import { MinioService } from 'src/minio/minio.service';

@Injectable()
export class UserService {
  constructor(private readonly minioService: MinioService) {}

  getUserImage() {
    return this.minioService.getListBucket();
  }

  uploadUserImage(file: any, key: string) {
    return this.minioService.upload(file, key);
  }
}
