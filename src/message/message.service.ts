import { getManager, getRepository, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Dialog } from 'src/dialog/entities/dialog.entity';
import { DialogService } from 'src/dialog/dialog.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly repository: Repository<Message>,
    private readonly dialogService: DialogService
  ) {}
  async create(createMessageDto: CreateMessageDto) {
    const message = await this.repository.save({text: createMessageDto.text, dialog: {id: createMessageDto.dialogId}, user: {id: createMessageDto.userId}})
    console.log(message);

    const dialog = await this.dialogService.findOne(message.dialog.id)
    dialog.lastMessage = message

    await this.dialogService.save(dialog)
    
    return message
  }

  findAll() {
    return `This action returns all message`;
  }

  async findAllByDialog(userId: number, dialogId: number) {
    return this.repository.find({relations: ['dialog', 'user'], where: {user: {id: userId}}})
  }

  findOne(id: number) {
    return this.repository.findOne(id, {relations: ['user', 'dialog']});
  }

   updateReadStatus(userId: number, dialogId: number) {
    return this.repository
    .createQueryBuilder('message')
    .leftJoin('message.users', 'users')
    .update()
    .set({read: true})
    .where('dialog.id = :id', { id: dialogId })
    .where('users.id <> :id', { id: userId })
    .execute()
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  async remove(userId: number, id: number) {
    const message = await this.findOne(id)

    if (!message) throw new NotFoundException("Сообщение не найдено")

    if (message.user.id !== userId) throw new ForbiddenException("Нет прав для удаления")

    const dialog = message.dialog
    const messageId = message.id

    await this.repository.remove(message)

    if (dialog.lastMessage.id === messageId) dialog.lastMessage = await this.repository.findOne(messageId, {where: {id: dialog.id}, order: {createdAt: 'DESC'}})

    await getRepository(Dialog).save(dialog)
  }
}
