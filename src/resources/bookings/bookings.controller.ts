import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('reserve')
  @ApiOperation({ summary: 'Reserve a seat for an event' })
  @ApiCreatedResponse({ description: 'Seat reserved successfully' })
  @ApiBadRequestResponse({
    description: 'Already booked or no seats available',
  })
  @ApiNotFoundResponse({ description: 'Event not found' })
  create(@Body() dto: CreateBookingDto) {
    return this.bookingsService.reserve(dto);
  }
}
