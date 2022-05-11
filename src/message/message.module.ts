import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DialogModule } from 'src/dialog/dialog.module';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { Message } from './entities/message.entity';
import { SocketService } from 'src/socket/socket.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), DialogModule, SocketService],
  controllers: [MessageController],
  providers: [MessageService]
})
export class MessageModule {}
