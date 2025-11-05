import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ default: '' })
  name: string;

  @Prop({ required: true, unique:true })
  phoneNumber: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
