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

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAndAnalyze(@UploadedFile() file: Express.Multer.File) {
    // file.path là đường dẫn tạm (multer disk storage)
    const { analysis, file: uploaded } = await this.appService.uploadAndAnalyze(
      file.path,
      file.originalname,
      file.mimetype,
    );
    return {
      fileId: uploaded.id,

      analysis,
    };
  }
}
