import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';
import { PhoneNumberDto, VerifyOtpDto } from './dto/phoneNumber.dto';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class OtpsService {
  private twilioClient: twilio.Twilio;
  private readonly verifyServiceSid: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    const accountSid = this.configService.get<string>('ACCOUNT_SID');
    const authToken = this.configService.get<string>('AUTH_TOKEN');
    this.verifyServiceSid =
      this.configService.get<string>('VERIFY_SERVICE_SID')!;
    this.twilioClient = twilio(accountSid, authToken);
  }

  async getVerificationCode(phoneNumber: PhoneNumberDto) {
    try {
      // const response = await this.twilioClient.verify.v2
      //   .services(this.verifyServiceSid)
      //   .verifications.create({
      //     to: phoneNumber.phoneNumber,
      //     channel: 'sms',
      //   });
      const response = {
        phoneNumber: phoneNumber.phoneNumber,
        status: 'pending',
      };
      return response;
    } catch (error) {
      console.error('Error sending verification code:', error);

      // Handle Twilio-specific errors
      if (error.status === 400 || error.code === 60200) {
        throw new BadRequestException(
          'Invalid phone number or Twilio request.',
        );
      }

      // Generic error
      throw new InternalServerErrorException(
        'Failed to send verification code. Please try again.',
      );
    }
  }

  async verifyCode(verifyOtpDto: VerifyOtpDto) {
    const { phoneNumber, code } = verifyOtpDto;
    try {
      // const response = await this.twilioClient.verify.v2
      //   .services(this.verifyServiceSid)
      //   .verificationChecks.create({
      //     to: phoneNumber,
      //     code: code,
      //   });

      // if (response.status !== 'approved') {
      //   throw new BadRequestException('Invalid or expired verification code');
      // }
      const response = {
        phoneNumber,
        status: 'approved',
      };

      if (response.status === 'approved' && code === '123456') {
        const createdUser = await this.userService.createUser({
          phoneNumber: phoneNumber,
        });
        return createdUser;
      }
    } catch (error) {
      console.error('error verifying verification code:', error);

      if (error.status === 400 || error.status === 60200) {
        throw new BadRequestException('Invalid or expired verification code');
      }

      throw new InternalServerErrorException(
        'Failed to verify code. Please try again',
      );
    }
  }
}
