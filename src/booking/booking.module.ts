import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { BookingRepository } from './repositories/booking.repository';
import { Booking } from './entities/booking.entity';
import { UserModule } from '../user/user.module';
import { DriverModule } from '../driver/driver.module';
import { CabModule } from '../cab/cab.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    UserModule,
    DriverModule,
    CabModule,
    NotificationModule,
  ],
  controllers: [BookingController],
  providers: [BookingService, BookingRepository],
  exports: [BookingService],
})
export class BookingModule {} 