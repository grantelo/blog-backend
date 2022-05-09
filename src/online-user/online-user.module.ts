import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OnlineUser } from './entities/online-user.entity';
import { OnlineUserService } from './online-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([OnlineUser])],
  providers: [OnlineUserService],
  exports: [OnlineUserService]
})
export class OnlineUserModule {}
