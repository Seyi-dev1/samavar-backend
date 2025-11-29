import { IsNotEmpty, IsString } from 'class-validator';
export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}

export class PhoneNumberDto {
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}
