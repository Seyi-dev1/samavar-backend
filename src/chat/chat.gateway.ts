import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { MessagesService } from 'src/messages/messages.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService, private readonly messageService:MessagesService) {}

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    this.chatService.removeUser(client.id);
  }

  @SubscribeMessage('register')
  handleRegister(client: Socket, userId: any) {
    this.chatService.registerUser(userId, client.id);

    // Fetch and send offline messages
    const offlineMessages = this.messageService.getOfflineMessages(userId.phoneNumber)
    offlineMessages.then((messages) => {
      messages.forEach((message) => {
        const receiverSocketId = this.chatService.getSocketId(
          message.senderId,
        );
        const deliveryTime = new Date().toISOString()
        this.messageService.updateMessageStatus(message.chatId, 'delivered', deliveryTime, undefined);
        client.emit('newMessage', {messageId:message.messageId, chatId:message.chatId, senderId:message.senderId, receiverId:message.receiverId, createdAt:message.createdAt, status:'delivered', content:message.content, type:message.type, deliveredAt:deliveryTime, seenAt:null});
        if (receiverSocketId) {
          this.server.to(receiverSocketId).emit('messageSent', {messageId:message.messageId, chatId:message.chatId , status: 'delivered', deliveredAt:deliveryTime, seenAt:null  });
        }
      });
    });

    //get delivery reports for messages sent by this user that are delivered
    const sentMessages = this.messageService.getDeliveredMessages(userId.phoneNumber, userId.lastSyncedAt)
    sentMessages.then((messages) => {
      messages.forEach((message) => {
        client.emit('messageSent', { chatId: message.chatId , status: message.status , messageId: message.messageId, deliveredAt:message.deliveredAt, seenAt:message.seenAt  });
      });
    });
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, payload: any) {
    console.log('Received message:', payload);

    await this.messageService.createMessage(payload)

    client.emit('messageSent', { chatId: payload.chatId , status: 'sent' , messageId: payload.messageId, deliveredAt: null, seenAt: null });

    const receiverSocketId = this.chatService.getSocketId(
      payload.receiverId,
    );
    
    if (receiverSocketId) {
      const deliveryTime = new Date().toISOString()
      this.messageService.updateMessageStatus(payload.chatId, 'delivered', deliveryTime, undefined);
      this.server.to(receiverSocketId).emit('newMessage', {...payload, status:'delivered', deliveredAt: deliveryTime, seenAt: null});
      client.emit('messageSent', { chatId: payload.chatId , status: 'delivered' , messageId: payload.messageId, deliveredAt: deliveryTime, seenAt: null });
    }
  }

  @SubscribeMessage('markMessagesAsSeen')
  async handleMarkMessagesAsSeen( client: Socket, payload: any) {
    console.log('markMessagesAsSeen payload', payload.chatId, payload.receiverId);
    const seenTime = new Date().toISOString()
    await this.messageService.updateMessageStatus(payload.chatId, 'seen', undefined, seenTime);

    const receiverSocketId = this.chatService.getSocketId(
      payload.receiverId,
    );

    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('messagesSeen', {
        chatId: payload.chatId,
        status: 'seen',
        seenAt: seenTime,
      });
    }
  }

}
