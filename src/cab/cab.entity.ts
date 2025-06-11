import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Cab {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  driverId: string;

  @Column({ unique: true })
  licensePlate: string;

  @Column()
  model: string;

  @Column()
  color: string;

  @Column({ default: 'available' })
  status: string;
} 