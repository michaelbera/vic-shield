import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ContractDoc = HydratedDocument<ContractEntity>;

@Schema({ timestamps: true, collection: 'contracts' })
export class ContractEntity {
  @Prop() owner: string;
  @Prop() title: string;
  @Prop() description: string;
  @Prop() hash: string;
  @Prop() score: number;
  @Prop() signers: number[];
  @Prop() aiContent: string;
}
export const ContractSchema = SchemaFactory.createForClass(ContractEntity);
