import { Injectable } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnlineUserService } from 'src/online-user/online-user.service';
import { SocketService } from 'src/socket/socket.service';
import { UsersService } from '../users/users.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(
    private onlineUserService: OnlineUserService,
    private userService: UsersService,
    private socketService: SocketService,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    this.socketService.socket = server;
  }

  async handleConnection(socket: Socket, ...args: any[]) {
    const userId = +socket.handshake.query.userId as number;

    if (!userId) return;

    let onlineUser = await this.onlineUserService.findOne(userId);
    console.log('aaaz');
    console.log(onlineUser);

    if (!onlineUser) {
      console.log('xff');
      console.log();

      onlineUser = await this.onlineUserService.create({ userId });
      console.log(onlineUser);

      socket.broadcast.emit('user:online', userId);
    } else {
      onlineUser.countTabs++;
      console.log(onlineUser);
      await this.onlineUserService.save(onlineUser);
    }

    await this.userService.update(onlineUser.user.id, {
      isOnline: true,
    });
  }

  async handleDisconnect(socket: Socket) {
    const userId = +socket.handshake.query.userId as number;

    const onlineUser = await this.onlineUserService.findOne(userId);

    onlineUser.countTabs--;

    if (!onlineUser.countTabs) {
      await this.onlineUserService.remove(onlineUser);
      await this.userService.update(onlineUser.user.id, {
        isOnline: false,
      });
      return socket.broadcast.emit('user:disconnected', onlineUser.user.id);
    }

    await this.onlineUserService.save(onlineUser);
  }

  @SubscribeMessage('dialog:join')
  handleDialogJoin(socket: Socket, dialogId: string): void {
    console.log('dialog:join');

    console.log(dialogId);

    socket.join(dialogId.toString());
  }

  @SubscribeMessage('dialog:typing')
  handleDialogTyping(socket: Socket): void {
    socket.broadcast.emit('dialog:typing');
  }

  @SubscribeMessage('message:read')
  handleMessageRead(socket: Socket, dialogId: number): void {
    socket.to(dialogId.toString()).emit('message:readed', dialogId);
  }
}
