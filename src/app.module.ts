import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OtpsModule } from './otps/otps.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    OtpsModule,
    ConfigModule.forRoot({
      isGlobal: true, // Makes it available across the entire app
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
