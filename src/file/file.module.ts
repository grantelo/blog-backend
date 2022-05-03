import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({
  imports: [CloudinaryService],
  controllers: [FileController],
  providers: [FileService, CloudinaryService],
})
export class FileModule {}
