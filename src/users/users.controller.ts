import { Body, Controller, Post } from '@nestjs/common';
import { User } from './user.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Post('create')
  async createUser(@Body() user: User) {
    return this.userService.createUser(user);
  }
}
