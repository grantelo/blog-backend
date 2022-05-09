import { Module } from '@nestjs/common';
import { OnlineUserModule } from 'src/online-user/online-user.module';

@Module({
    imports: [OnlineUserModule],
    // providers: [OnlineUserService],
    // exports: [OnlineUserService]
  })
  export class ChatModule {}