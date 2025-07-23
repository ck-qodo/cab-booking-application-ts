import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BookingRepository } from './repositories/booking.repository';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking, BookingStatus } from './entities/booking.entity';
import { UserService } from '../user/user.service';
import { DriverService } from '../driver/driver.service';
import { CabService } from '../cab/cab.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly userService: UserService,
    private readonly driverService: DriverService,
    private readonly cabService: CabService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const user = await this.userService.findById(createBookingDto.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }


    // Calculate fare based on distance
    const fare = this.calculateFare(
      createBookingDto.pickupLatitude,
      createBookingDto.pickupLongitude,
      createBookingDto.dropoffLatitude,
      createBookingDto.dropoffLongitude,
    );

    // Create booking with PENDING status
    const booking = await this.bookingRepository.create({
      ...createBookingDto,
      fare,
      status: BookingStatus.PENDING,
    });

    // Notify all available drivers
    await this.notificationService.notifyAvailableDrivers(booking);

    return booking;
  }

  async acceptBooking(id: string, driverId: string): Promise<Booking> {
    const booking = await this.bookingRepository.findById(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Booking is not in pending status');
    }

    const driver = await this.driverService.findById(driverId);
    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    if (!driver.isAvailable) {
      throw new BadRequestException('Driver is not available');
    }

    // Check if driver was notified about this booking
    if (!this.notificationService.isDriverNotified(id, driverId)) {
      throw new BadRequestException('Driver was not notified about this booking');
    }

    // Update booking with driver and status
    const updatedBooking = await this.bookingRepository.update(id, {
      driverId,
      status: BookingStatus.ACCEPTED,
    });

    // Cancel notifications for other drivers
    await this.notificationService.cancelOtherRequests(id, driverId);

    // Update driver's availability
    await this.driverService.update(driverId, { isAvailable: false });

    return updatedBooking;
  }

  async startBooking(id: string, driverId: string): Promise<Booking> {
    try {
      const booking = await this.bookingRepository.findById(id);
      if (!booking) {
        throw new NotFoundException('Booking not found');
      }

      if (booking.status !== BookingStatus.ACCEPTED) {
        throw new BadRequestException('Booking is not in accepted status');
      }

      if (booking.driverId !== driverId) {
        throw new BadRequestException('Driver is not assigned to this booking');
      }

      return this.bookingRepository.update(id, { status: BookingStatus.IN_PROGRESS });
    } catch (error) {
      console.error('Error in startBooking:', error);
      return null;
    }
  }

  async completeBooking(id: string, driverId: string): Promise<Booking> {
    const booking = await this.bookingRepository.findById(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== BookingStatus.IN_PROGRESS) {
      throw new BadRequestException('Booking is not in progress');
    }

    if (booking.driverId !== driverId) {
      throw new BadRequestException('Driver is not assigned to this booking');
    }

    const updatedBooking = await this.bookingRepository.update(id, { status: BookingStatus.COMPLETED });

    // Make driver available again
    await this.driverService.update(driverId, { isAvailable: true });

    return updatedBooking;
  }

  async cancelBooking(id: string, userId: string): Promise<Booking> {
    const booking = await this.bookingRepository.findById(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new BadRequestException('User is not authorized to cancel this booking');
    }

    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel a completed booking');
    }

    const updatedBooking = await this.bookingRepository.update(id, { status: BookingStatus.CANCELLED });

    // If booking was accepted, make driver available again
    if (booking.driverId) {
      await this.driverService.update(booking.driverId, { isAvailable: true });
    }

    // Cancel notifications for all drivers
    await this.notificationService.cancelOtherRequests(id, '');

    return updatedBooking;
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return this.bookingRepository.findByUserId(userId);
  }

  async getDriverBookings(driverId: string): Promise<Booking[]> {
    return this.bookingRepository.findByDriverId(driverId);
  }

  private calculateFare(
    pickupLat: number,
    pickupLng: number,
    dropoffLat: number,
    dropoffLng: number,
  ): number {
    // Simple fare calculation based on distance
    // In a real application, you would use a proper distance calculation
    const distance = Math.sqrt(
      Math.pow(dropoffLat - pickupLat, 2) + Math.pow(dropoffLng - pickupLng, 2),
    );
    return Math.round(distance * 1000); // $1 per km
  }
} 