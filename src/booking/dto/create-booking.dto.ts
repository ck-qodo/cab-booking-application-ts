import { IsString, IsNumber, IsOptional, IsDateString, IsArray, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ description: 'Driver ID' })
  @IsString()
  driverId: string;

  @ApiProperty({ description: 'Cab ID' })
  @IsString()
  cabId: string;

  @ApiProperty({ description: 'Pickup latitude' })
  @IsNumber()
  pickupLatitude: number;

  @ApiProperty({ description: 'Pickup longitude' })
  @IsNumber()
  pickupLongitude: number;

  @ApiProperty({ description: 'Dropoff latitude' })
  @IsNumber()
  dropoffLatitude: number;

  @ApiProperty({ description: 'Dropoff longitude' })
  @IsNumber()
  dropoffLongitude: number;

  @ApiProperty({ description: 'Scheduled time (optional)', required: false })
  @IsOptional()
  @IsDateString()
  scheduledTime?: string;

  // This will be set by the controller from the authenticated user
  @IsString()
  userId: string;

  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  shareWithEmails?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  shareWithPhoneNumbers?: string[];
} 