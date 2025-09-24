import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import * as fs from 'fs/promises';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');
    try {
      const uploaded = await this.appService.uploadToOpenAI(
        file.path,
        file.originalname,
        file.mimetype,
      );

      return {
        fileId: uploaded.id,
        bytes: uploaded.bytes,
        createdAt: uploaded.created_at,
        filename: uploaded.filename,
        mimeType: uploaded.mime_type,
      };
    } finally {
      // dọn file tạm
      if (file?.path) {
        await fs.unlink(file.path).catch(() => {});
      }
    }
  }
}
