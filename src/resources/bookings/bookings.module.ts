import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity, EventEntity } from '@core/entities';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BookingEntity, EventEntity])],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
