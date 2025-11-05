import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';
import { CodeDto, PhoneNumberDto } from './dto/phoneNumber.dto';

@Injectable()
export class OtpsService {
  private twilioClient: twilio.Twilio;
  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get<string>('ACCOUNT_SID');
    const authToken = this.configService.get<string>('AUTH_TOKEN');
    this.twilioClient = twilio(accountSid, authToken);
  }

  async getVerificationCode(phoneNumber: PhoneNumberDto) {
    const verifyServiceSid =
      this.configService.get<string>('VERIFY_SERVICE_SID');
    if (!verifyServiceSid) {
      throw new Error('VERIFY_SERVICE_SID is not configured');
    }

    try {
      const response = await this.twilioClient.verify.v2
        .services(verifyServiceSid)
        .verifications.create({
          to: phoneNumber.phoneNumber,
          channel: 'sms',
        });
      return { success: response.status, data: response };
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

  async verifyCode(phoneNumber: PhoneNumberDto, code: CodeDto) {
    try {
      const verifyServiceSid =
        this.configService.get<string>('VERIFY_SERVICE_SID');
      if (!verifyServiceSid) {
        throw new Error('VERIFY_SERVICE_SID is not configured');
      }
      const response = await this.twilioClient.verify.v2
        .services(verifyServiceSid)
        .verificationChecks.create({
          to: phoneNumber.phoneNumber,
          code: code.code,
        });

      if (response.status !== 'approved') {
        throw new BadRequestException('Invalid or expired verification code');
      }

      return { success: response.status, data: response };
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
