import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  private onlineUsers = new Map<string, string>(); // userId -> socketId
  private onlineUsers2 = new Map<any, string>()

  constructor() {
    
  }

  registerUser(userId: any, socketId: string) {
    this.onlineUsers.set(userId.phoneNumber, socketId);
    this.onlineUsers2.set(userId, socketId)
    console.log(this.onlineUsers)
    console.log(this.onlineUsers2)
  }

  removeUser(socketId: string) {
    for (const [userId, sId] of this.onlineUsers.entries()) {
      if (sId === socketId) {
        this.onlineUsers.delete(userId);
        break;
      }
    }
  }

  getSocketId(userId: string) {
    const result = this.onlineUsers.get(userId);
    console.log('getting socket id for', userId, 'result:', result);
    return result
  }

  getOnlineUsers() {
    console.log('getting online users', this.onlineUsers2);
    const usersArray = Array.from(this.onlineUsers2.keys());
    console.log(usersArray)
    return usersArray;
  }

  async sendMessage(data: any) {
    // const message = await this.messageService.createMessage(data);

    // if (this.onlineUsers.has(data.receiverId)) {
    //   await this.messageService.markDelivered(message.id);
    // }

    // return message;
  }
}
