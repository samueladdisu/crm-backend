import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CustomerDocument = HydratedDocument<Customer>;

export enum CustomerStatus {
  VISITED = 'visited',
  NOT_VISITED = 'not_visited',
}

@Schema({ timestamps: true })
export class Customer {
  @Prop({ required: true })
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop()
  email: string;

  @Prop({
    type: String,
    enum: CustomerStatus,
    default: CustomerStatus.NOT_VISITED,
  })
  status: string;

  @Prop()
  salesRep: string;

  @Prop()
  source: string;

  @Prop()
  reason: string;

  @Prop()
  remarks: string;

  @Prop()
  servedBy: string;

  @Prop()
  userId: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
