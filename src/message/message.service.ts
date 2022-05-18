import { getRepository, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Dialog } from 'src/dialog/entities/dialog.entity';
import { DialogService } from 'src/dialog/dialog.service';
import { Message } from './entities/message.entity';
import { SocketService } from 'src/socket/socket.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly repository: Repository<Message>,
    private readonly dialogService: DialogService,
    private readonly socketService: SocketService,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    console.log(createMessageDto);

    const message = await this.repository.save({
      text: createMessageDto.text,
      dialog: { id: createMessageDto.dialogId },
      user: { id: createMessageDto.userId },
    });

    const dialog = await this.dialogService.findOne(message.dialog.id);
    dialog.lastMessage = message;

    await this.dialogService.save(dialog);
    console.log('aadsad');
    console.log(createMessageDto.dialogId);
    //console.log(await this.socketService.socket.fetchSockets());
    this.socketService.socket
      .to(createMessageDto.dialogId.toString())
      .emit('message:created', message);
    //this.socketService.socket.emit('message:created', message);
    return message;
  }

  findAll() {
    return `This action returns all message`;
  }

  async findAllByDialog(userId: number, dialogId: number) {
    const a = await this.repository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.dialog', 'dialog')
      .leftJoinAndSelect('message.user', 'user')
      .where('dialog.id = :id', { id: dialogId })
      .getMany();

    console.log(a);

    this.socketService.socket
      .to(dialogId.toString())
      .emit('messages:readed', dialogId, userId);
    return a;
  }

  findOne(id: number) {
    return this.repository.findOne(id, { relations: ['user', 'dialog'] });
  }

  updateReadStatus(userId: number, dialogId: number) {
    return this.repository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.user', 'user')
      .leftJoinAndSelect('message.dialog', 'dialog')
      .update()
      .set({ read: true })
      .where('dialog.id = :id', { id: dialogId })
      .andWhere('user.id <> :id', { id: userId })
      .execute();
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  async remove(userId: number, id: number) {
    const message = await this.findOne(id);

    if (!message) throw new NotFoundException('Сообщение не найдено');

    console.log(message);
    console.log(userId);

    if (message.user.id !== userId)
      throw new ForbiddenException('Нет прав для удаления');

    const dialog = message.dialog;
    const messageId = message.id;

    await this.repository.remove(message);

    console.log('Удален');

    if (dialog?.lastMessage?.id === messageId)
      dialog.lastMessage = await this.repository.findOne(messageId, {
        where: { id: dialog.id },
        order: { createdAt: 'DESC' },
      });
    await getRepository(Dialog).save(dialog);
  }
}
