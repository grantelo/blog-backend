import { Inject} from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnlineUser } from 'src/online-user/entities/online-user.entity';
import { OnlineUserService } from 'src/online-user/online-user.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject() 
    private readonly onlineUserService: OnlineUserService,
    private onlineUser: OnlineUser
  ) {}
  afterInit(server: any) {
    throw new Error('Method not implemented.');
  }

  @WebSocketServer()
  server: Server

  async handleConnection(socket: Socket, ...args: any[]) {
    const userId = +socket.handshake.query.userId as number
    this.onlineUser = await this.onlineUserService.findOne(userId)

    if (!this.onlineUser) {
      this.onlineUser = await this.onlineUserService.create({userId})
      socket.broadcast.emit("user:online", userId)
    }
    else {
      this.onlineUser.countTabs += 1
      await this.onlineUserService.save(this.onlineUser)
    }
  }

  async handleDisconnect(socket: Socket) {
    this.onlineUser.countTabs--

    if(!this.onlineUser.countTabs) {
      await this.onlineUserService.remove(this.onlineUser)
      return socket.broadcast.emit("user:disconnected", this.onlineUser.id)
    }

    await this.onlineUserService.save(this.onlineUser)
  }

  @SubscribeMessage('dialog:join')
  handleDialogJoin(socket: Socket, dialogId: string): void {
    socket.join(dialogId)
  }

  @SubscribeMessage('dialog:typing')
  handleDialogTyping(socket: Socket): void {
    socket.broadcast.emit("dialog:typing")
  }

  @SubscribeMessage('message:read')
  handleMessageRead(socket: Socket, dialogId: string): void {
    socket.to(dialogId).emit("message:readed", dialogId)
  }

}
