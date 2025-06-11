import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User } from '../user/entities/user.entity';

interface RequestWithUser extends Request {
  user: User;
}

@ApiTags('bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @Roles('user')
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'User/Driver/Cab not found' })
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @Request() req: RequestWithUser,
  ) {
    createBookingDto.userId = req.user.id;
    return this.bookingService.create(createBookingDto);
  }

  @Post(':id/accept')
  @Roles('driver')
  @ApiOperation({ summary: 'Accept a booking' })
  @ApiResponse({ status: 200, description: 'Booking accepted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid booking status' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async acceptBooking(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ) {
    return this.bookingService.acceptBooking(id, req.user.id);
  }

  @Post(':id/start')
  @Roles('driver')
  @ApiOperation({ summary: 'Start a trip' })
  @ApiResponse({ status: 200, description: 'Trip started successfully' })
  @ApiResponse({ status: 400, description: 'Invalid booking status' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async startTrip(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ) {
    return this.bookingService.startTrip(id, req.user.id);
  }

  @Post(':id/complete')
  @Roles('driver')
  @ApiOperation({ summary: 'Complete a trip' })
  @ApiResponse({ status: 200, description: 'Trip completed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid booking status' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async completeTrip(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ) {
    return this.bookingService.completeTrip(id, req.user.id);
  }

  @Post(':id/cancel')
  @Roles('user')
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiResponse({ status: 200, description: 'Booking cancelled successfully' })
  @ApiResponse({ status: 400, description: 'Invalid booking status' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async cancelBooking(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ) {
    return this.bookingService.cancelBooking(id, req.user.id);
  }

  @Get('user')
  @Roles('user')
  @ApiOperation({ summary: 'Get user bookings' })
  @ApiResponse({ status: 200, description: 'Returns list of user bookings' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserBookings(@Request() req: RequestWithUser) {
    return this.bookingService.getUserBookings(req.user.id);
  }

  @Get('driver')
  @Roles('driver')
  @ApiOperation({ summary: 'Get driver bookings' })
  @ApiResponse({ status: 200, description: 'Returns list of driver bookings' })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  async getDriverBookings(@Request() req: RequestWithUser) {
    return this.bookingService.getDriverBookings(req.user.id);
  }
} 