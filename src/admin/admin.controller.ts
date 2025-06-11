import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Returns dashboard statistics' })
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Returns all users' })
  async getUsers() {
    return this.adminService.getUsers();
  }

  @Get('drivers')
  @ApiOperation({ summary: 'Get all drivers' })
  @ApiResponse({ status: 200, description: 'Returns all drivers' })
  async getDrivers() {
    return this.adminService.getDrivers();
  }

  @Get('cabs')
  @ApiOperation({ summary: 'Get all cabs' })
  @ApiResponse({ status: 200, description: 'Returns all cabs' })
  async getCabs() {
    return this.adminService.getCabs();
  }

  @Get('bookings')
  @ApiOperation({ summary: 'Get all bookings' })
  @ApiResponse({ status: 200, description: 'Returns all bookings' })
  async getBookings() {
    return this.adminService.getBookings();
  }

  @Put('users/:id/role')
  @ApiOperation({ summary: 'Update user role' })
  @ApiResponse({ status: 200, description: 'User role updated successfully' })
  async updateUserRole(
    @Param('id') userId: string,
    @Body('role') role: UserRole,
  ) {
    return this.adminService.updateUserRole(userId, role);
  }

  @Put('drivers/:id/status')
  @ApiOperation({ summary: 'Update driver status' })
  @ApiResponse({ status: 200, description: 'Driver status updated successfully' })
  async updateDriverStatus(
    @Param('id') driverId: string,
    @Body('isAvailable') isAvailable: boolean,
  ) {
    return this.adminService.updateDriverStatus(driverId, isAvailable);
  }

  @Put('cabs/:id/status')
  @ApiOperation({ summary: 'Update cab status' })
  @ApiResponse({ status: 200, description: 'Cab status updated successfully' })
  async updateCabStatus(
    @Param('id') cabId: string,
    @Body('isAvailable') isAvailable: boolean,
  ) {
    return this.adminService.updateCabStatus(cabId, isAvailable);
  }
} 