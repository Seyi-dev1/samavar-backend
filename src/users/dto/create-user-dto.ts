import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'PhoneNumber is required' })
  @IsString({ message: 'PhoneNumber must be a string' })
  phoneNumber: string;
}

export class UpdateUserDto {
  @IsNotEmpty({ message: 'PhoneNumber is required' })
  @IsString({ message: 'PhoneNumber must be a string' })
  phoneNumber: string;

  @IsOptional()
  @IsString({ message: 'firstName must be string' })
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'LastName must be string' })
  lastName?: string;

  @IsOptional()
  @IsString({ message: 'profilePhoto must be string' })
  profilePhoto?: string | null;

  // @IsNotEmpty({ message: 'LastName is required' })
  @IsOptional()
  avatarIndex?: number | null;
}
