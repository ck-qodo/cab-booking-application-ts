import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { Driver } from '../../driver/entities/driver.entity';
import { Cab } from '../../cab/entities/cab.entity';

export enum BookingStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('bookings')
export class Booking {
  @ApiProperty({ description: 'Booking ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User ID' })
  @Column()
  userId: string;

  @ApiProperty({ description: 'Driver ID' })
  @Column()
  driverId: string;

  @ApiProperty({ description: 'Cab ID' })
  @Column()
  cabId: string;

  @ApiProperty({ description: 'Pickup latitude' })
  @Column('decimal', { precision: 10, scale: 8 })
  pickupLatitude: number;

  @ApiProperty({ description: 'Pickup longitude' })
  @Column('decimal', { precision: 11, scale: 8 })
  pickupLongitude: number;

  @ApiProperty({ description: 'Dropoff latitude' })
  @Column('decimal', { precision: 10, scale: 8 })
  dropoffLatitude: number;

  @ApiProperty({ description: 'Dropoff longitude' })
  @Column('decimal', { precision: 11, scale: 8 })
  dropoffLongitude: number;

  @ApiProperty({ description: 'Fare amount' })
  @Column('decimal', { precision: 10, scale: 2 })
  fare: number;

  @ApiProperty({ description: 'Booking status', enum: BookingStatus })
  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @ApiProperty({ description: 'Scheduled time', required: false })
  @Column({ nullable: true })
  scheduledTime: Date;

  @ApiProperty({ description: 'Created at timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Updated at timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Driver)
  @JoinColumn({ name: 'driverId' })
  driver: Driver;

  @ManyToOne(() => Cab)
  @JoinColumn({ name: 'cabId' })
  cab: Cab;
} 