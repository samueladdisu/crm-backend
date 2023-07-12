import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SecretaryDocument = HydratedDocument<Secretary>;

@Schema({ timestamps: true })
export class Secretary {
  @Prop({ required: true })
  fullName: string;

  @Prop()
  phone: string;

  @Prop()
  email: string;

  @Prop()
  reason: string;

  @Prop()
  participant: Array<string>;

  @Prop()
  time: string;

  @Prop()
  priority: string;

  @Prop()
  remarks: string;
}

export const SecretarySchema = SchemaFactory.createForClass(Secretary);
