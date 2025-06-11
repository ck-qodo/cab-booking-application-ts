import { Injectable } from '@nestjs/common';
import { DriverService } from '../driver/driver.service';
import { Booking } from '../booking/entities/booking.entity';

@Injectable()
export class NotificationService {
  private activeBookingRequests: Map<string, Set<string>> = new Map(); // bookingId -> Set of notified driverIds

  constructor(private readonly driverService: DriverService) {}

  async notifyAvailableDrivers(booking: Booking) {
    // Get all available drivers
    const availableDrivers = await this.driverService.findAvailableDrivers();
    
    // Store the notified drivers for this booking
    this.activeBookingRequests.set(booking.id, new Set(availableDrivers.map(driver => driver.id)));

    // In a real application, you would send push notifications to drivers here
    // For now, we'll just simulate the notification
    console.log(`Notifying ${availableDrivers.length} drivers about booking ${booking.id}`);
    
    return availableDrivers;
  }

  async cancelOtherRequests(bookingId: string, acceptedDriverId: string) {
    // Remove this booking from active requests
    this.activeBookingRequests.delete(bookingId);
    
    // In a real application, you would send cancellation notifications to other drivers
    console.log(`Cancelling notifications for booking ${bookingId} as driver ${acceptedDriverId} accepted`);
  }

  isDriverNotified(bookingId: string, driverId: string): boolean {
    const notifiedDrivers = this.activeBookingRequests.get(bookingId);
    return notifiedDrivers?.has(driverId) || false;
  }

  // Basic notification logic
  async sendSMS(userId: string, message: string): Promise<any> {
    // TODO: Implement send SMS logic
    return { message: 'Send SMS endpoint' };
  }

  async sendEmail(userId: string, subject: string, body: string): Promise<any> {
    // TODO: Implement send email logic
    return { message: 'Send email endpoint' };
  }

  async sendOTP(userId: string): Promise<any> {
    // TODO: Implement send OTP logic
    return { message: 'Send OTP endpoint' };
  }
} 