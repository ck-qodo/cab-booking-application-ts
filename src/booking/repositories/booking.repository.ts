import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from '../entities/booking.entity';
import { BaseRepository } from '../../common/repositories/base.repository';

@Injectable()
export class BookingRepository extends BaseRepository<Booking> {
  constructor(
    @InjectRepository(Booking)
    protected readonly repository: Repository<Booking>,
  ) {
    super(repository, Booking);
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    return this.repository.find({
      where: { userId },
      relations: ['user', 'driver', 'cab'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByDriverId(driverId: string): Promise<Booking[]> {
    return this.repository.find({
      where: { driverId },
      relations: ['user', 'driver', 'cab'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: BookingStatus): Promise<Booking[]> {
    return this.repository.find({
      where: { status },
      relations: ['user', 'driver', 'cab'],
      order: { createdAt: 'DESC' },
    });
  }

  async findActiveBookingByDriverId(driverId: string): Promise<Booking | null> {
    return this.repository.findOne({
      where: {
        driverId,
        status: BookingStatus.IN_PROGRESS,
      },
      relations: ['user', 'driver', 'cab'],
    });
  }

  async findActiveBookingByUserId(userId: string): Promise<Booking | null> {
    return this.repository.findOne({
      where: {
        userId,
        status: BookingStatus.IN_PROGRESS,
      },
      relations: ['user', 'driver', 'cab'],
    });
  }
} 