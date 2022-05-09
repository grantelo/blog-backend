import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateDialogInterceptor } from './create-dialog.interceptor';
import { DialogService } from './dialog.service';
import { CreateDialogDto } from './dto/create-dialog.dto';
import { UpdateDialogDto } from './dto/update-dialog.dto';

@Controller('dialog')
export class DialogController {
  constructor(private readonly dialogService: DialogService) {}

  @UseInterceptors(CreateDialogInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createDialogDto: CreateDialogDto) {
    return this.dialogService.create(createDialogDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req) {
    return this.dialogService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dialogService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDialogDto: UpdateDialogDto) {
    return this.dialogService.update(+id, updateDialogDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Req() req, @Param('id') dialogId: string) {
    this.dialogService.remove(req.user.id, +dialogId);
  }
}
