import { Injectable, NotFoundException } from '@nestjs/common';
import { DriverRepository } from './repositories/driver.repository';
import { CreateDriverDto } from './dto/create-driver.dto';

@Injectable()
export class DriverService {
  constructor(private readonly driverRepository: DriverRepository) {}

  async create(createDriverDto: CreateDriverDto) {
    return this.driverRepository.create(createDriverDto);
  }

  async toggleAvailability(driverId: string, isAvailable: boolean) {
    const driver = await this.driverRepository.findOne(driverId);
    if (!driver) {
      throw new NotFoundException('Driver not found');
    }
    return this.driverRepository.update(driverId, { isAvailable });
  }

  async getCurrentTrip(driverId: string) {
    const driver = await this.driverRepository.findOne(driverId);
    if (!driver) {
      throw new NotFoundException('Driver not found');
    }
    // TODO: Implement logic to get current trip
    return { message: 'Get current trip endpoint' };
  }

  async getEarnings(driverId: string) {
    const driver = await this.driverRepository.findOne(driverId);
    if (!driver) {
      throw new NotFoundException('Driver not found');
    }
    return { earnings: driver.earnings };
  }
} 