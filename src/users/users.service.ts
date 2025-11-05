import {
  BadRequestException,
  Body,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(user: User) {
    try {
      const newUser = new this.userModel(user);
      await newUser.save();
      return newUser;
    } catch (error) {
      console.error('could not create new user', error);

      //handle bad request error
      if (error.status === 400) {
        throw new BadRequestException('invalid details for user creation');
      }

      //handle internal server errors
      throw new InternalServerErrorException(
        'Something went wrong. Please try again.',
      );
    }
  }
}
