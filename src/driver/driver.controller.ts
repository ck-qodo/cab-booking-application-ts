import { Controller, Put, Get, Body, Param } from '@nestjs/common';
import { DriverService } from './driver.service';

@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Put('availability/:driverId')
  async toggleAvailability(@Param('driverId') driverId: string, @Body() body: { isAvailable: boolean }) {
    return this.driverService.toggleAvailability(driverId, body.isAvailable);
  }

  @Get('current-trip/:driverId')
  async getCurrentTrip(@Param('driverId') driverId: string) {
    return this.driverService.getCurrentTrip(driverId);
  }

  @Get('earnings/:driverId')
  async getEarnings(@Param('driverId') driverId: string) {
    return this.driverService.getEarnings(driverId);
  }
} 