import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Driver } from '../../driver/entities/driver.entity';
import { Booking } from '../../booking/entities/booking.entity';
import { CabStatus } from '../dto/create-cab.dto';

@Entity('cabs')
export class Cab {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  driverId: string;

  @ManyToOne(() => Driver)
  driver: Driver;

  @ApiProperty()
  @Column()
  licensePlate: string;

  @ApiProperty()
  @Column()
  model: string;

  @ApiProperty()
  @Column()
  color: string;

  @ApiProperty({ enum: CabStatus })
  @Column({
    type: 'enum',
    enum: CabStatus,
    default: CabStatus.ACTIVE,
  })
  status: CabStatus;

  @OneToMany(() => Booking, booking => booking.cab)
  bookings: Booking[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
} 