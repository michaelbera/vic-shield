import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileEntity, FileDoc } from './entities/file.entity';
import { createHash } from 'crypto';
import OpenAI, { toFile } from 'openai';
import * as path from 'path';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  private readonly client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  constructor(@InjectModel(FileEntity.name) private m: Model<FileDoc>) {}

  async save(upload: Express.Multer.File) {
    const hash = createHash('sha256').update(upload.buffer).digest('hex');

    let doc = await this.m.findOneAndUpdate(
      { hash },
      {
        filename: upload.originalname,
        contentType: upload.mimetype || 'application/octet-stream',
        dataBase64: upload.buffer.toString('base64'),
        hash,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    const isPdf =
      upload.mimetype === 'application/pdf' ||
      path.extname(upload.originalname).toLowerCase() === '.pdf';

    if (isPdf && !doc.openaiFileId) {
      try {
        const safeFilename =
          path.extname(upload.originalname).toLowerCase() === '.pdf'
            ? upload.originalname
            : `${path.parse(upload.originalname).name || 'document'}.pdf`;

        const openaiFile = await this.client.files.create({
          file: await toFile(upload.buffer, safeFilename, {
            type: 'application/pdf',
          }),
          purpose: 'assistants',
        });

        doc.openaiFileId = openaiFile.id;
        await doc.save();
      } catch (err) {
        this.logger.error('Upload PDF to OpenAI failed', err as any);
      }
    }

    return {
      id: doc._id,
      hash: doc.hash,
      filename: doc.filename,
      contentType: doc.contentType,
      openaiFileId: doc.openaiFileId ?? null,
    };
  }

  async getByHash(hash: string) {
    const doc = await this.m.findOne({ hash }).lean();
    if (!doc) throw new NotFoundException('File not found');
    return doc;
  }
}
