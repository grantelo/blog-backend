import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('file')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return this.fileService.uploadImage(file);
  }
}
