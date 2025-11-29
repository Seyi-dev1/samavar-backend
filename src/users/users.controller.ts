import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { User } from './user.schema';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/create-user-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploadService } from 'src/image-upload/image-upload.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly imageUploadService: ImageUploadService,
  ) {}

  @Post('create')
  async createUser(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }

  @Post('update')
  @UseInterceptors(FileInterceptor('profilePhoto'))
  async updateUser(
    @Body() user: UpdateUserDto,
    @UploadedFile() profilePhoto?: Express.Multer.File,
  ): Promise<User> {
    console.log('photo', profilePhoto);
    console.log('body', user);
    if (profilePhoto) {
      const uploadedImage =
        await this.imageUploadService.uploadImage(profilePhoto);
      return this.userService.updateUser({
        ...user,
        avatarIndex: null,
        profilePhoto: uploadedImage.secure_url,
      });
    }
    if (!profilePhoto) {
      console.log('photo not found');
    }

    if (user.avatarIndex) {
      return this.userService.updateUser({
        ...user,
        profilePhoto: null,
      });
    }
    return this.userService.updateUser(user);
  }

  @Get()
  async getAllUsers() {
    const users = await this.userService.getAllUsers();
    return users;
  }
}
