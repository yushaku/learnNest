import {
  Controller,
  Delete,
  Get,
  Header,
  Post,
  Query,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioClientService } from 'src/minio-client/minio-client.service';

@Controller('user')
export class UserController {
  constructor(private minioClientService: MinioClientService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadUserImage(@UploadedFile() file: Express.Multer.File) {
    const uploaded_image = await this.minioClientService.upload(file);

    return {
      image_url: uploaded_image.url,
      message: 'Image upload successful',
    };
  }

  @Get('name')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="payment-history.csv"')
  getUserImage(@Query('imageName') imageName: string) {
    const file = this.minioClientService.getOne(imageName);
    return file;
  }

  @Delete('name')
  delete(@Query('imageName') imageName: string) {
    return this.minioClientService.delete(imageName);
  }

  @Get()
  getMany() {
    return this.minioClientService.getMany();
  }
}
