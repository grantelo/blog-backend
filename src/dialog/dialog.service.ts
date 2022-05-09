import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateDialogDto } from './dto/create-dialog.dto';
import { UpdateDialogDto } from './dto/update-dialog.dto';
import { Dialog } from './entities/dialog.entity';

@Injectable()
export class DialogService {
  constructor(
    @InjectRepository(Dialog)
    private readonly repository: Repository<Dialog>,
    private readonly userService: UsersService,
  ) {}

  create(createDialogDto: CreateDialogDto) {
    console.log("fff");
    console.log(createDialogDto);
    
    return this.repository.save({users: createDialogDto.users.map(userId =>({id: userId}))})
  }

  async findAll(userId: number) {
    const a = await this.repository
    .createQueryBuilder('dialog')
    .leftJoinAndSelect('dialog.messages', 'messages')
    .leftJoinAndSelect('dialog.lastMessage', 'lastMessage')
    .leftJoinAndSelect('dialog.users', 'users')
    .leftJoin('dialog.hidden_users', 'hidden_users')
    .where('users.id = :id', { id: userId })
    .where('hidden_users.id <> :id', { id: userId })
    .getMany()

    console.log(a);
    

    return a

  }

  findOne(id: number) {
    return this.repository.findOne(id, {relations: ['users', 'hidden_users']})
  }

  save(dialog: Dialog) {
    return this.repository.save(dialog)
  }

  update(id: number, updateDialogDto: UpdateDialogDto) {
    return `This action updates a #${id} dialog`;
  }

  async remove(userId: number, dialogId: number) {
    const dialog = await this.repository.findOne(dialogId, {relations: ['hidden_users', 'users']})

    if (!dialog) throw new NotFoundException("Диалог не найден")

    const user = await this.userService.findById(userId)

    if (dialog?.hidden_users?.find(user => user.id === userId)) throw new NotFoundException("Диалог уже удален")

    console.log(dialog);
    
        
    const countUsersInDialog = dialog.users.length
    const countHiddenUsersInDialog = dialog.hidden_users.length

    if (countHiddenUsersInDialog + 1 === countUsersInDialog) return this.repository.remove(dialog)

    if (!dialog.hidden_users) dialog.hidden_users = [user]
    else dialog.hidden_users.push(user)
  
    return this.repository.save(dialog)
  }
}
