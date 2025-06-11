import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { DriverService } from '../driver/driver.service';
import { CabService } from '../cab/cab.service';
import { BookingService } from '../booking/booking.service';
import { UserRole } from '../user/entities/user.entity';

@Injectable()
export class AdminService {
  constructor(
    private readonly userService: UserService,
    private readonly driverService: DriverService,
    private readonly cabService: CabService,
    private readonly bookingService: BookingService,
  ) {}

  async getDashboardStats() {
    const [users, drivers, cabs, bookings] = await Promise.all([
      this.userService.findAll(),
      this.driverService.findAll(),
      this.cabService.findAll(),
      this.bookingService.findAll(),
    ]);

    return {
      totalUsers: users.length,
      totalDrivers: drivers.length,
      totalCabs: cabs.length,
      totalBookings: bookings.length,
      activeBookings: bookings.filter(b => b.status === 'IN_PROGRESS').length,
      completedBookings: bookings.filter(b => b.status === 'COMPLETED').length,
    };
  }

  async getUsers() {
    return this.userService.findAll();
  }

  async getDrivers() {
    return this.driverService.findAll();
  }

  async getCabs() {
    return this.cabService.findAll();
  }

  async getBookings() {
    return this.bookingService.findAll();
  }

  async updateUserRole(userId: string, role: UserRole) {
    return this.userService.update(userId, { role });
  }

  async updateDriverStatus(driverId: string, isAvailable: boolean) {
    return this.driverService.update(driverId, { isAvailable });
  }

  async updateCabStatus(cabId: string, isAvailable: boolean) {
    return this.cabService.update(cabId, { isAvailable });
  }
} 