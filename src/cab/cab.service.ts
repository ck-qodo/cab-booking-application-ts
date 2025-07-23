import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CabRepository } from './repositories/cab.repository';
import { CreateCabDto, CabStatus } from './dto/create-cab.dto';
import { DriverService } from '../driver/driver.service';
import { BookingService } from '../booking/booking.service';

@Injectable()
export class CabService {
  constructor(
    private readonly cabRepository: CabRepository,
    private readonly driverService: DriverService,
    private readonly bookingService: BookingService,
  ) {}

  async create(createCabDto: CreateCabDto) {
    // Check if driver exists
    const driver = await this.driverService.findOne(createCabDto.driverId);
    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    // Check if license plate is unique
    const existingCab = await this.cabRepository.findByLicensePlate(createCabDto.licensePlate);
    if (existingCab) {
      throw new BadRequestException('License plate already registered');
    }

    return this.cabRepository.create(createCabDto);
  }

  async updateStatus(cabId: string, status: CabStatus) {
    const cab = await this.cabRepository.findOne(cabId);
    if (!cab) {
      throw new NotFoundException('Cab not found');
    }

    return this.cabRepository.update(cabId, { status });
  }

  async getDriverCabs(driverId: string) {
    const driver = await this.driverService.findOne(driverId);
    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    return this.cabRepository.findByDriverId(driverId);
  }

  async getAvailableCabs() {
    const cabs = await this.cabRepository.findByStatus(CabStatus.ACTIVE);
    const cabsWithDrivers = await Promise.all(
      cabs.map(async (cab) => {
        const driver = await this.driverService.findOne(cab.driverId);
        return { ...cab, driver };
      })
    );
    return cabsWithDrivers;
  }

  async getCabDetails(cabId: string) {
    const cab = await this.cabRepository.findOne(cabId);
    if (!cab) {
      throw new NotFoundException('Cab not found');
    }
    const driver = await this.driverService.findOne(cab.driverId);
    const bookings = await this.bookingService.findAll();
    const cabBookings = bookings.filter(b => b.cabId === cabId);
    
    return {
      ...cab,
      driver,
      bookings: cabBookings
    };
  }
} 