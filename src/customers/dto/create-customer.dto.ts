import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  salesRep: string;

  @IsString()
  @IsOptional()
  source: string;

  @IsString()
  @IsOptional()
  reason: string;

  @IsString()
  @IsOptional()
  remarks: string;

  @IsString()
  @IsOptional()
  servedBy: string;
}
