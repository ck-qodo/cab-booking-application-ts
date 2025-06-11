import { Controller, Get } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';

@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get('health')
  async healthCheck() {
    return this.monitoringService.healthCheck();
  }

  @Get('metrics')
  async getMetrics() {
    return this.monitoringService.getMetrics();
  }
} 