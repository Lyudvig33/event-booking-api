import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from './base';
import { EventEntity } from './event.entity';

@Entity({ name: 'bookings' })
@Unique(['event', 'userId'])
export class BookingEntity extends BaseEntity {
  @ManyToOne(() => EventEntity, (event) => event.bookings, {
    onDelete: 'CASCADE',
  })
  event: EventEntity;

  @Column({ name: 'user_id' })
  userId: string;
}
