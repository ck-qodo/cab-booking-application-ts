import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  type: string;

  @Column()
  message: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  sentAt: Date;
} 