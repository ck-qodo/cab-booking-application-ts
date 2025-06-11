import { Controller, Post, Put, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CabService } from './cab.service';
import { CreateCabDto, CabStatus } from './dto/create-cab.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('cabs')
@Controller('cabs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CabController {
  constructor(private readonly cabService: CabService) {}

  @Post()
  @Roles('admin', 'driver')
  @ApiOperation({ summary: 'Register a new cab' })
  @ApiResponse({ status: 201, description: 'Cab successfully registered' })
  async create(@Body() createCabDto: CreateCabDto) {
    return this.cabService.create(createCabDto);
  }

  @Put(':id/status')
  @Roles('admin', 'driver')
  @ApiOperation({ summary: 'Update cab status' })
  @ApiResponse({ status: 200, description: 'Cab status successfully updated' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: CabStatus,
  ) {
    return this.cabService.updateStatus(id, status);
  }

  @Get('driver/:driverId')
  @Roles('admin', 'driver')
  @ApiOperation({ summary: 'Get all cabs for a driver' })
  @ApiResponse({ status: 200, description: 'Returns all cabs for the specified driver' })
  async getDriverCabs(@Param('driverId') driverId: string) {
    return this.cabService.getDriverCabs(driverId);
  }

  @Get('available')
  @ApiOperation({ summary: 'Get all available cabs' })
  @ApiResponse({ status: 200, description: 'Returns all available cabs' })
  async getAvailableCabs() {
    return this.cabService.getAvailableCabs();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get cab details' })
  @ApiResponse({ status: 200, description: 'Returns cab details' })
  async getCabDetails(@Param('id') id: string) {
    return this.cabService.getCabDetails(id);
  }
} 