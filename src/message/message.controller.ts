import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateMessageInterceptor } from './create-message.interceptor';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseInterceptors(CreateMessageInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(createMessageDto);
  }

  // @Get()
  // findAll() {
  //   return this.messageService.findAll();
  // }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAllByDialog(@Req() req, @Query('dialogId') dialogId: string) {
    const userId = req.user.id

    await this.messageService.updateReadStatus(userId, +dialogId)
    return this.messageService.findAllByDialog(req.user.userId, +dialogId)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(+id, updateMessageDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Req() req, @Param('id')id: string) {
    this.messageService.remove(req.user.id, +id);
  }
}
