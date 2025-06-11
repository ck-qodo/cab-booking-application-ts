import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CabController } from './cab.controller';
import { CabService } from './cab.service';
import { CabRepository } from './repositories/cab.repository';
import { Cab } from './entities/cab.entity';
import { DriverModule } from '../driver/driver.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cab]),
    DriverModule,
  ],
  controllers: [CabController],
  providers: [CabService, CabRepository],
  exports: [CabService],
})
export class CabModule {} 