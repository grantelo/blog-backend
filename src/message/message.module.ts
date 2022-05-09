import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { DialogModule } from 'src/dialog/dialog.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), DialogModule],
  controllers: [MessageController],
  providers: [MessageService]
})
export class MessageModule {}
