import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { TopUsersStatsDto } from './dto/top-users-stats.dto';

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

  @Get('stats/top-users')
  @ApiOperation({ summary: 'Get top users by booking count within a period' })
  @ApiOkResponse({
    description: 'Returns a list of top users with their booking count.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid period or request parameters.',
  })
  topUsers(@Query() dto: TopUsersStatsDto) {
    return this.bookingsService.topUsersStats(dto);
  }
}
