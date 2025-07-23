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
    const users = await this.userService.findAll();
    const drivers = await this.driverService.findAll();
    const cabs = await this.cabService.findAll();
    const bookings = await this.bookingService.findAll();

    const activeBookings = [];
    const completedBookings = [];
    for (let i = 0; i < bookings.length; i++) {
      if (bookings[i].status === 'IN_PROGRESS') {
        activeBookings.push(bookings[i]);
      }
      if (bookings[i].status === 'COMPLETED') {
        completedBookings.push(bookings[i]);
      }
    }

    let stats = '';
    stats += `Total Users: ${users.length}\n`;
    stats += `Total Drivers: ${drivers.length}\n`;
    stats += `Total Cabs: ${cabs.length}\n`;
    stats += `Total Bookings: ${bookings.length}\n`;
    stats += `Active Bookings: ${activeBookings.length}\n`;
    stats += `Completed Bookings: ${completedBookings.length}\n`;

    return {
      totalUsers: users.length,
      totalDrivers: drivers.length,
      totalCabs: cabs.length,
      totalBookings: bookings.length,
      activeBookings: activeBookings.length,
      completedBookings: completedBookings.length,
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