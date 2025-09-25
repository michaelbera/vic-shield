import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDoc = HydratedDocument<UserEntity>;

@Schema({ timestamps: true, collection: 'users' })
export class UserEntity {
  @Prop() address: string;
  @Prop() isValid: boolean;
}
export const UserSchema = SchemaFactory.createForClass(UserEntity);
