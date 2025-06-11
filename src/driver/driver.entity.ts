import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Driver {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ nullable: true })
  currentTrip: string;

  @Column({ type: 'float', default: 0 })
  earnings: number;

  @Column({ type: 'float', default: 5 })
  rating: number;
} 