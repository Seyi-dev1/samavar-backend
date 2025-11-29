import { Module } from '@nestjs/common';
import { OtpsController } from './otps.controller';
import { OtpsService } from './otps.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [OtpsController],
  providers: [OtpsService],
})
export class OtpsModule {}
