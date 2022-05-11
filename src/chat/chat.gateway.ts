import { Injectable } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnlineUserService } from 'src/online-user/online-user.service';
import { SocketService } from 'src/socket/socket.service';


@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  constructor(
    private onlineUserService: OnlineUserService,
    private socketService: SocketService
  ) {}

  private onlineUser: any

  @WebSocketServer()
  server: Server

  afterInit(server: Server) {
    console.log("after init");
    
    console.log(this.server);

    server.emit('message:hello', 'hello')
    this.socketService.socket = this.server;
  }

  async handleConnection(socket: Socket, ...args: any[]) {
    console.log(socket.handshake.query);
    
    const userId = +socket.handshake.query.userId as number

    if (!userId) return

    this.onlineUser = await this.onlineUserService.findOne(userId)

    if (!this.onlineUser) {
      console.log("xff");
      console.log();
      
      this.onlineUser = await this.onlineUserService.create({userId})
      console.log(this.onlineUser);
      
      socket.broadcast.emit("user:online", userId)
    }
    else {
      this.onlineUser.countTabs++
      await this.onlineUserService.save(this.onlineUser)
    }
  }

  async handleDisconnect(socket: Socket) {
    if (!this.onlineUser) return

    this.onlineUser.countTabs--

    if(!this.onlineUser.countTabs) {
      await this.onlineUserService.remove(this.onlineUser)
      return socket.broadcast.emit("user:disconnected", this.onlineUser.id)
    }

    await this.onlineUserService.save(this.onlineUser)
  }

  @SubscribeMessage('dialog:join')
  handleDialogJoin(socket: Socket, dialogId: string): void {
    console.log('dialog:join');
    
    console.log(dialogId);
    
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
