import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { Cab } from '../../cab/entities/cab.entity';

@Entity('drivers')
export class Driver {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  userId: string;

  @ApiProperty()
  @Column()
  licenseNumber: string;

  @ApiProperty()
  @Column()
  vehicleType: string;

  @ApiProperty()
  @Column({ default: true })
  isAvailable: boolean;

  @ApiProperty()
  @Column('decimal', { precision: 10, scale: 8, nullable: true })
  currentLatitude: number;

  @ApiProperty()
  @Column('decimal', { precision: 11, scale: 8, nullable: true })
  currentLongitude: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Cab, cab => cab.driver)
  cabs: Cab[];
} 