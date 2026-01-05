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
import { CreateUserDto, FindUsersByPhoneDto, UpdateUserDto } from './dto/create-user-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploadService } from 'src/image-upload/image-upload.service';
import { ChatService } from 'src/chat/chat.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly imageUploadService: ImageUploadService,
    private readonly chatService: ChatService,
  ) {}

  @Post('create')
  async createUser(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }

  @Post('update')
  @UseInterceptors(FileInterceptor('profilePhotoFile'))
  async updateUser(
    @Body() user: UpdateUserDto,
    @UploadedFile() profilePhotoFile?: Express.Multer.File,
  ): Promise<User> {
    console.log('photo', profilePhotoFile);
    console.log('body', user);
    if (profilePhotoFile) {
      const isProfilePhotoUnchanged = await this.userService.isProfilePhotoUnchanged(user)
      if(isProfilePhotoUnchanged) {
        return this.userService.updateUser({
          ...user,
          avatarIndex:null,
        })
      }
      const uploadedImage =
        await this.imageUploadService.uploadImage(profilePhotoFile);
      return this.userService.updateUser({
        ...user,
        avatarIndex: null,
        profilePhoto: uploadedImage.secure_url,
      });
    }
    if (!profilePhotoFile) {
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

  @Get('online')
  async getOnlineUsers() {
    const users =  this.chatService.getOnlineUsers();
    return users;
  }

  @Post('by_ids')
  async getUsersByIds(@Body() dto: any ) {
    console.log('running')
    console.log('userIds', dto.phoneNumbers);
    const users = await this.userService.getUsersByIds(dto.phoneNumbers);
    console.log('users', users);
    return users;
  }
}
