import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateSecretaryDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  reason: string;

  @IsOptional()
  participant: Array<string>;

  @IsNotEmpty()
  time: string;

  @IsNotEmpty()
  @IsString()
  priority: string;

  @IsOptional()
  @IsString()
  remarks: string;
}
