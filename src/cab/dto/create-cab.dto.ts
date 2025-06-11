import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum CabStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
}

export class CreateCabDto {
  @ApiProperty()
  @IsString()
  driverId: string;

  @ApiProperty()
  @IsString()
  licensePlate: string;

  @ApiProperty()
  @IsString()
  model: string;

  @ApiProperty()
  @IsString()
  color: string;

  @ApiProperty({ enum: CabStatus, default: CabStatus.ACTIVE })
  @IsEnum(CabStatus)
  @IsOptional()
  status?: CabStatus;
} 