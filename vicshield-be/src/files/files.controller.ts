import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { FilesService } from './files.service';
import * as multer from 'multer';

@Controller('files')
export class FilesController {
  constructor(private svc: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage: multer.memoryStorage() }))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('file is required');
    return this.svc.save(file); // { id }
  }

  @Get(':id')
  async get(@Param('id') id: string, @Res() res: Response) {
    const f = await this.svc.getByHash(id);
    res.setHeader('Content-Type', f.contentType || 'application/octet-stream');
    res.send(Buffer.from(f.dataBase64, 'base64'));
  }
}
