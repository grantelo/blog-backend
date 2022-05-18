import { Module } from '@nestjs/common';
import { OnlineUserModule } from 'src/online-user/online-user.module';
import { SocketModule } from 'src/socket/socket.module';
import { ChatGateway } from './chat.gateway';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [OnlineUserModule, SocketModule, UsersModule],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class ChatModule {}
