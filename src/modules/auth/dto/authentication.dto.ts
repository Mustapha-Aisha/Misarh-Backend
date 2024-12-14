import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  Length,
  IsIn,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;


  @IsString()
  @MinLength(6)
  password: string;
}

export class VerifyCodeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(6, 6)
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsIn(['REGISTER', 'RESET_PASSWORD'])
  @IsNotEmpty()
  type: 'REGISTER' | 'RESET_PASSWORD';
}

export class ResetAccountDto {
  @IsEmail()
  @IsNotEmpty()
  generic_data: string;
}

export class ChangePasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  confirm_password: string;
}

export class CreateLoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
