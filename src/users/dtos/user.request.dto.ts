import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class GetUserRequestDto {}

export class CreateUserRequestDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;
}

export class UpdateUserRequestDto {
  @IsString()
  username?: string;

  @IsEmail()
  email?: string;

  @IsString()
  fullName?: string;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
