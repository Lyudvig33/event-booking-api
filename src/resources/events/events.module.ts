import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from '@core/entities';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity])],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
