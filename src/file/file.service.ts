import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class FileService {
  constructor(private cloudinaryService: CloudinaryService) {}

  async uploadImage(file: Express.Multer.File) {
    const data = await this.cloudinaryService.uploadImage(file);

    return {
      success: 1,
      file: {
        url: data.url,
      },
    };
  }
}
