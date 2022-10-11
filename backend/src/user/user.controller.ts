import { AuthGuard } from './../common/guards/auth.guard';
import {
  Controller,
  Delete,
  Get,
  Header,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioClientService } from '../minio-client/minio-client.service';
import { UserService } from './user.service';
import { JwtUser } from '../common/decorators';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private minioClientService: MinioClientService,
    private readonly userService: UserService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadUserImage(
    @UploadedFile() file: Express.Multer.File,
    @JwtUser('userId') userId: number,
  ) {
    const uploaded_image = await this.minioClientService.upload(file);

    const user = await this.userService.uploadUserImage(
      userId,
      uploaded_image.url,
    );

    return {
      user,
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
    return this.userService.getAll();
  }

  @Get('/:id')
  getOne(@JwtUser('userId') userId: number) {
    return this.userService.getOne(userId);
  }
}
