import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OtpsModule } from './otps/otps.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    OtpsModule,
    ConfigModule.forRoot({
      isGlobal: true, // Makes it available across the entire app
    }),
    MongooseModule.forRoot(
      'mongodb+srv://samoluwaseyi25:bzGInRHOINlEnq6g@samavarcluster1.8mq6ysp.mongodb.net/?appName=SamavarCluster1',
    ),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
