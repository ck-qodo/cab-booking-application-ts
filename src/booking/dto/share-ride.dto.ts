import { IsString, IsEmail, IsArray, IsOptional } from 'class-validator';

export class ShareRideDto {
  @IsString()
  bookingId: string;

  @IsArray()
  @IsEmail({}, { each: true })
  @IsOptional()
  emails?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  phoneNumbers?: string[];
} 