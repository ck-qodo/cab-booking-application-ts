import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  driverId: string;

  @Column()
  cabId: string;

  @Column()
  pickup: string;

  @Column()
  dropoff: string;

  @Column({ type: 'float' })
  fare: number;

  @Column({ default: 'pending' })
  status: string;

  @Column({ nullable: true })
  scheduledTime: Date;
} 