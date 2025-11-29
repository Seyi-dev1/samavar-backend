import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './dto/create-user-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async createUser(user: CreateUserDto) {
    console.log(user.phoneNumber);
    try {
      const userExists = await this.userModel.findOne({
        phoneNumber: user.phoneNumber,
      });
      if (userExists) {
        return userExists;
      }
      const newUser = new this.userModel(user);
      await newUser.save();
      return newUser;
    } catch (error) {
      console.error('could not create new user', error);

      //handle internal server errors
      throw new InternalServerErrorException(
        'Something went wrong. Please try again.',
      );
    }
  }

  async updateUser(user: UpdateUserDto) {
    try {
      const userExists = await this.userModel.findOneAndUpdate(
        {
          phoneNumber: user.phoneNumber,
        },
        {
          $set: user,
        },
        {
          new: true,
        },
      );

      if (!userExists) {
        throw new BadRequestException(
          'A user with the provided phoneNumber was not found',
        );
      }

      return userExists;
    } catch (error) {
      console.error('could not update user', error);

      //handle internal server errors
      throw new InternalServerErrorException(
        'Something went wrong. Please try again.',
      );
    }
  }

  async getAllUsers() {
    try {
      const users = await this.userModel.find().exec();
      return users;
    } catch (error) {
      console.log('could not find users', error);
      throw new InternalServerErrorException(
        'Something went wrong. Please try again.',
      );
    }
  }
}
