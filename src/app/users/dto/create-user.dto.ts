import { ApiProperty } from '@nestjs/swagger';
import {
  Length,
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @Length(2, 32)
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  @Length(6, 255)
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
