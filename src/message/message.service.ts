import { UpdateMessageDto } from './dto/update-message.dto';
import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  create(createMessageDto: CreateMessageDto) {
    return this.prisma.message.create({ data: createMessageDto });
  }

  findAll(articleId: number, size: number, pageNo: number) {
    return this.prisma.message.findMany({
      where: { articleId },
      take: size,
      skip: (size - 1) * pageNo,
    });
  }

  update(body: UpdateMessageDto) {
    return this.prisma.message.update({
      where: { id: body.id },
      data: { text: body.text },
    });
  }

  delete(messageId: number) {
    return this.prisma.message.delete({ where: { id: messageId } });
  }
}
