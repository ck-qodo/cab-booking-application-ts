import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsEmail, IsString } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsString()
  name: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @Column('jsonb', { nullable: true })
  paymentMethods: any[];

  @Column('jsonb', { nullable: true })
  rideHistory: any[];

  @Column({ default: 'user' })
  role: string;
} 