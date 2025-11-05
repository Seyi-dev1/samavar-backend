import { Body, Controller, Post } from '@nestjs/common';
import { OtpsService } from './otps.service';
import { CodeDto, PhoneNumberDto } from './dto/phoneNumber.dto';

@Controller('otps')
export class OtpsController {
  constructor(private readonly otpsService: OtpsService) {}

  @Post('request_otp')
  async requestOtp(@Body() phoneNumber: PhoneNumberDto) {
    return this.otpsService.getVerificationCode(phoneNumber);
  }

  @Post('verify_otp')
  async verifyOtp(@Body() code: CodeDto, @Body() phoneNumber: PhoneNumberDto) {
    return this.otpsService.verifyCode(phoneNumber, code);
  }
}
