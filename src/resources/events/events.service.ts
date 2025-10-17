import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from '@core/entities';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepo: Repository<EventEntity>,
  ) {}

  async create(dto: CreateEventDto) {
    const event = this.eventRepo.create({
      name: dto.name,
      totalSeats: dto.totalSeats,
    });
    return this.eventRepo.save(event);
  }
}
