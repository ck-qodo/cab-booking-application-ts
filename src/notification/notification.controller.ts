import { Controller, Post, Body, Param } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('sms/:userId')
  async sendSMS(@Param('userId') userId: string, @Body() body: { message: string }) {
    return this.notificationService.sendSMS(userId, body.message);
  }

  @Post('email/:userId')
  async sendEmail(@Param('userId') userId: string, @Body() body: { subject: string; body: string }) {
    return this.notificationService.sendEmail(userId, body.subject, body.body);
  }

  @Post('otp/:userId')
  async sendOTP(@Param('userId') userId: string) {
    return this.notificationService.sendOTP(userId);
  }
} 