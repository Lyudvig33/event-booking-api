import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base';
import { BookingEntity } from './booking.entity';

@Entity({ name: 'event' })
export class EventEntity extends BaseEntity {
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'total_seats' })
  totalSeats: number;

  @OneToMany(() => BookingEntity, (booking) => booking.event)
  bookings: BookingEntity[];
}
