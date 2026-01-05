import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Message extends Document {
  @Prop({ required: true })
  chatId: string; // The chat this message belongs to

  @Prop({ required: true })
  messageId: string; // The message unique identifier

  @Prop({ required: true })
  senderId: string; // The user who sent the message

  @Prop({ required: true })
  receiverId: string; // The user who should receive the message

  @Prop({ required: true })
  content: string; // Text content of the message

  @Prop({ required: true, type: Date })
  createdAt: Date; 

  @Prop({  type:Date, default: null })
  deliveredAt: Date; // Timestamp when the message was delivered to the receiver

  @Prop({  type:Date, default: null })
  seenAt: Date; // Timestamp when the message was seen by the receiver


  @Prop({ default: 'sent', enum: ['pending','sent', 'delivered', 'read'] })
  status: 'pending'|'sent' | 'delivered' | 'read'; // Delivery status

  @Prop({ default: 'text', enum: ['text', 'image', 'video', 'file'] })
  type?: 'text' | 'image' | 'video' | 'file'; // Optional type for attachments

  
}

export const MessageSchema = SchemaFactory.createForClass(Message);
