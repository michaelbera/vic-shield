import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileEntity, FileDoc } from './entities/file.entity';
import { createHash } from 'crypto';

@Injectable()
export class FilesService {
  constructor(@InjectModel(FileEntity.name) private m: Model<FileDoc>) {}

  async save(file: Express.Multer.File) {
    const hashed = createHash('sha256').update(file.buffer).digest('hex');
    const doc = await this.m.findOneAndUpdate(
      { hash: hashed },
      {
        filename: file.originalname,
        contentType: file.mimetype || 'application/octet-stream',
        dataBase64: file.buffer.toString('base64'),
        hash: hashed,
      },
      { upsert: true, new: true },
    );
    return doc;
  }

  async get(hashed: string) {
    const doc = await this.m.findOne({ hash: hashed }).lean();
    if (!doc) throw new NotFoundException();
    return doc;
  }
}
