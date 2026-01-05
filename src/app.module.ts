import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OtpsModule } from './otps/otps.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ImageUploadModule } from './image-upload/image-upload.module';
import { ChatModule } from './chat/chat.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    
    ConfigModule.forRoot({
      isGlobal: true, // Makes it available across the entire app
    }),
    MongooseModule.forRootAsync({
       imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_CONNECTION_URI'),
      }),
    } 
    ),
    OtpsModule,
    UsersModule,
    ImageUploadModule,
    ChatModule,
    MessagesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
