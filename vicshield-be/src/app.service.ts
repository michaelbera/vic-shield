import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import * as fs from 'fs';

@Injectable()
export class AppService {
  private client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  /**
   * Upload file local path -> OpenAI, purpose: 'assistants'
   * Trả về đối tượng file đã upload.
   */
  async uploadToOpenAI(
    localPath: string,
    originalName: string,
    mimeType?: string,
  ) {
    // OpenAI SDK tự stream file từ path
    const file = await this.client.files.create({
      file: fs.createReadStream(localPath),
      purpose: 'assistants', // dùng cho Assistants/Responses
    });

    return {
      id: file.id,
      bytes: file.bytes,
      created_at: file.created_at,
      filename: originalName,
      mime_type: mimeType ?? 'application/octet-stream',
    };
  }
}
