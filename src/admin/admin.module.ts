import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserModule } from '../user/user.module';
import { DriverModule } from '../driver/driver.module';
import { CabModule } from '../cab/cab.module';
import { BookingModule } from '../booking/booking.module';

@Module({
  imports: [
    UserModule,
    DriverModule,
    CabModule,
    BookingModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {} 