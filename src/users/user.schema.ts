import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ default: null })
  firstName: string;

  @Prop({ default: null })
  lastName: string;

  @Prop({ required: true, unique: true })
  phoneNumber: string;

  @Prop({ default: null })
  profilePhoto?: string;

  @Prop({ default: null })
  avatarIndex?: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
