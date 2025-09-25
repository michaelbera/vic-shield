import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FileDoc = HydratedDocument<FileEntity>;

@Schema({ timestamps: true, collection: 'files' })
export class FileEntity {
  @Prop() filename: string;
  @Prop() contentType: string;
  @Prop() dataBase64: string; // nội dung file dạng base64
  @Prop() hash: string; // sha256 hash of the file content
  @Prop() openaiFileId: string; // OpenAI file ID if uploaded to OpenAI
}

export const FileSchema = SchemaFactory.createForClass(FileEntity);
