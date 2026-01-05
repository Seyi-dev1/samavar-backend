import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './message.schema';
import { Model } from 'mongoose';

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel(Message.name)
        private MessageModel: Model<Message>,
      ) {}

      async createMessage(data: Message) {
        try {
            const newMessage = new this.MessageModel({...data, status: 'sent', });
        return await newMessage.save();
        } catch (error) {
            console.error('could not create new message', error);
            throw 'Error creating message';
        }
        
      }

      async updateMessageStatus(chatIdId: string, status: 'sent' | 'delivered' | 'seen', deliveredAt?: string, seenAt?: string) {
        try {
            console.log('updating message status', chatIdId, status);
            return await this.MessageModel.updateMany(
                {chatId: chatIdId, status: { $ne: 'seen' } },
                {
               $set:deliveredAt? { status: status, deliveredAt:new Date(deliveredAt) }:seenAt?{status: status, seenAt:new Date(seenAt)} : { status: status },
                } 
            );
        } catch (error) {
            console.error('could not update message status', error);
            throw 'Error updating message status';
        }
      }

      async getOfflineMessages(receiverId: string) {
        try {
            const result = await this.MessageModel.find({
                receiverId: receiverId,
                status: { $in: ['sent'] },
            });
            console.log('offline messages for', receiverId, result);
            return result;
        } catch (error) {
            console.error('could not get offline messages', error);
            throw 'Error getting offline messages';
        }
      }

        async getDeliveredMessages(senderId: string, lastSyncedAt:string) {
        try {
            const result = await this.MessageModel.find({
                senderId: senderId,
                deliveredAt: {
                               $ne: null,
                               $gt: new Date(lastSyncedAt)
                             }
            });
            console.log('sent messages for', senderId, result);
            return result;  
        } catch (error) {
            console.error('could not get sent messages', error);
            throw 'Error getting sent messages';
        }
    }
}
