import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { ImageUploadService } from 'src/image-upload/image-upload.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService, ImageUploadService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
