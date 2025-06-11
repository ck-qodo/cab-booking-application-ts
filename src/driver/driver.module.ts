import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';
import { DriverRepository } from './repositories/driver.repository';
import { Driver } from './entities/driver.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Driver])],
  controllers: [DriverController],
  providers: [DriverService, DriverRepository],
  exports: [DriverService, DriverRepository],
})
export class DriverModule {} 