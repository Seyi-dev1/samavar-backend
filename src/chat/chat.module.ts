import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Message } from 'twilio/lib/twiml/MessagingResponse';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  imports: [
    MessagesModule
  ],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
