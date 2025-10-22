import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingEntity, EventEntity } from '@core/entities';
import { DataSource, Repository } from 'typeorm';
import { ERROR_MESSAGES } from '@core/messages';
import { StatsPeriod, TopUsersStatsDto } from './dto/top-users-stats.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepo: Repository<BookingEntity>,
    @InjectRepository(EventEntity)
    private readonly eventRepo: Repository<EventEntity>,
    private readonly dataSource: DataSource,
  ) {}
  async reserve(dto: CreateBookingDto) {
    return this.dataSource.transaction(async (manager) => {
      // Lock event row to serialize checks and prevent race conditions
      const event = await manager
        .getRepository(EventEntity)
        .createQueryBuilder('e')
        .setLock('pessimistic_write')
        .where('e.id = :id', { id: dto.eventId })
        .getOne();
      if (!event) {
        throw new NotFoundException(ERROR_MESSAGES.EVENT_NOT_FOUND);
      }

      // Check if this user already booked this event
      const existing = await manager.getRepository(BookingEntity).findOne({
        where: { userId: dto.userId, event: { id: dto.eventId } },
        relations: ['event'],
      });
      if (existing) {
        throw new BadRequestException(ERROR_MESSAGES.ALREADY_BOOKED);
      }

      // Count current bookings for this event (safe after event row lock)
      const count = await manager.getRepository(BookingEntity).count({
        where: { event: { id: dto.eventId } },
        relations: ['event'],
      });

      if (count >= event.totalSeats) {
        throw new BadRequestException(ERROR_MESSAGES.NO_SEATS_AVAILABLE);
      }

      const booking = manager.getRepository(BookingEntity).create({
        event,
        userId: dto.userId,
      });
      return manager.getRepository(BookingEntity).save(booking);
    });
  }

  async topUsersStats(dto: TopUsersStatsDto) {
    const { period, limit = 10 } = dto;

    const now = new Date();
    let startDate: Date;

    switch (period) {
      case StatsPeriod.DAY:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case StatsPeriod.WEEK: {
        const day = now.getDay() || 7;
        startDate = new Date(now);
        startDate.setDate(now.getDate() - day + 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      }
      case StatsPeriod.MONTH:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        throw new BadRequestException('Invalid stats period');
    }

    const rows = await this.bookingRepo
      .createQueryBuilder('b')
      .select('b.userId', 'userId')
      .addSelect('COUNT(b.id)', 'bookingscount')
      .where('b.createdAt >= :startDate', { startDate })
      .groupBy('b.userId')
      .orderBy('COUNT(b.id)', 'DESC')
      .limit(limit)
      .getRawMany<{ userId: string; bookingscount: string }>();

    return rows.map((r) => ({
      userId: r.userId,
      bookingsCount: Number(r.bookingscount),
    }));
  }
}
