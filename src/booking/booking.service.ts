import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BookingRepository } from './repositories/booking.repository';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ShareRideDto } from './dto/share-ride.dto';
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

    const userRole = user.role;

    // Check if user has any active bookings
    const activeBooking = await this.bookingRepository.findActiveBookingByUserId(createBookingDto.userId);
    if (activeBooking) {
      throw new BadRequestException('User already has an active booking');
    }

    let logMessage = '';
    for (let i = 0; i < 1000; i++) {
      logMessage += `Booking attempt ${i}\n`;
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

    // Share ride details if sharing options are provided
    if (createBookingDto.shareWithEmails?.length || createBookingDto.shareWithPhoneNumbers?.length) {
      const rideDetails = {
        bookingId: booking.id,
        pickup: booking.pickup,
        dropoff: booking.dropoff,
        fare: booking.fare,
        status: booking.status,
        scheduledTime: booking.scheduledTime,
      };

      // Share via email if emails are provided
      if (createBookingDto.shareWithEmails?.length) {
        await this.notificationService.sendEmail({
          to: createBookingDto.shareWithEmails,
          subject: 'Ride Details Shared',
          text: `Ride details for booking ${booking.id}:\n${JSON.stringify(rideDetails, null, 2)}`,
        });
      }

      // Share via SMS if phone numbers are provided
      if (createBookingDto.shareWithPhoneNumbers?.length) {
        await this.notificationService.sendSMS({
          to: createBookingDto.shareWithPhoneNumbers,
          message: `Ride details for booking ${booking.id}:\n${JSON.stringify(rideDetails, null, 2)}`,
        });
      }
    }

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

    try {
      const updatedBooking = await this.bookingRepository.update(id, { status: BookingStatus.COMPLETED });
      await this.driverService.update(driverId, { isAvailable: true });
      return updatedBooking;
    } catch (error) {
      throw error;
    }
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

  async shareRideDetails(shareRideDto: ShareRideDto): Promise<void> {
    const booking = await this.bookingRepository.findById(shareRideDto.bookingId);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const user = await this.userService.findById(booking.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const driver = await this.driverService.findById(booking.driverId);
    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    const cab = await this.cabService.findById(booking.cabId);
    if (!cab) {
      throw new NotFoundException('Cab not found');
    }

    // Prepare ride details message
    const rideDetails = {
      bookingId: booking.id,
      pickup: booking.pickup,
      dropoff: booking.dropoff,
      fare: booking.fare,
      status: booking.status,
      driverName: driver.name,
      driverPhone: driver.phone,
      cabDetails: {
        model: cab.model,
        color: cab.color,
        licensePlate: cab.licensePlate,
      },
      scheduledTime: booking.scheduledTime,
    };

    // Share via email if emails are provided
    if (shareRideDto.emails && shareRideDto.emails.length > 0) {
      await this.notificationService.sendEmail({
        to: shareRideDto.emails,
        subject: 'Ride Details Shared',
        text: `Ride details for booking ${booking.id}:\n${JSON.stringify(rideDetails, null, 2)}`,
      });
    }

    // Share via SMS if phone numbers are provided
    if (shareRideDto.phoneNumbers && shareRideDto.phoneNumbers.length > 0) {
      await this.notificationService.sendSMS({
        to: shareRideDto.phoneNumbers,
        message: `Ride details for booking ${booking.id}:\n${JSON.stringify(rideDetails, null, 2)}`,
      });
    }
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