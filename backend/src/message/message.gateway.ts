import { UpdateMessageDto } from './dto/update-message.dto';
import { Server, Socket } from 'socket.io';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: '*',
  },
})
export class MessageGateway {
  constructor(
    private readonly messageService: MessageService,
    private readonly userService: UserService,
  ) {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('JOIN_ROOM')
  joinRoom(
    @MessageBody('articleId') articleId: number,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(articleId.toString());
    console.log(`Room ${articleId} : client ${client.id} joined `);
    return `Joined article chat ${articleId}`;
  }

  @SubscribeMessage('LEAVE_ROOM')
  async handleLeaveRoom(
    @MessageBody('articleId') articleId: number,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(articleId.toString());
    console.log(`Room ${articleId} : client ${client.id} left`);
    return `Left Room ${articleId}`;
  }

  @SubscribeMessage('CREATE_MESSAGE')
  async create(@MessageBody() createMessageDto: CreateMessageDto) {
    const message = await this.messageService.create(createMessageDto);
    const user = await this.userService.getOne(createMessageDto.userId);
    const newMessage = {
      ...message,
      user,
    };

    this.server.sockets
      .to(createMessageDto.articleId.toString())
      .emit('RECEIVE_MESSAGE_FROM_CLIENT', newMessage);

    return newMessage;
  }

  @SubscribeMessage('UPDATE_MESSAGE')
  async handleUpdateMessages(@MessageBody() body: UpdateMessageDto) {
    const updated_message = await this.messageService.update(body);

    this.server.sockets
      .to(body.articleId.toString())
      .emit('RECEIVE_MESSAGE_FROM_CLIENT', updated_message);

    return updated_message;
  }

  @SubscribeMessage('DELETE_MESSAGE')
  async handleDeleteMessages(
    @MessageBody() body: { articleId: number; messageId: number },
  ) {
    const message = await this.messageService.delete(body.messageId);

    this.server.sockets
      .to(body.articleId.toString())
      .emit('RECEIVE_MESSAGE_FROM_CLIENT', message);

    return 1;
  }

  @SubscribeMessage('GET_ALL_MESSAGES')
  findAll(
    @MessageBody() request: { articleId: number; size: number; pageNo: number },
  ) {
    return this.messageService.findAll(
      request.articleId,
      request.size,
      request.pageNo,
    );
  }

  @SubscribeMessage('TYPING')
  async typing(
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    const user = await this.userService.getOne(+client.id);
    client.broadcast.emit('TYPING', { clientName: user.name, isTyping });
  }
}
