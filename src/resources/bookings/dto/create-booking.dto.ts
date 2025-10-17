import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({
    description: 'Event ID',
    example: '071ee457-3f88-4612-8b56-f99dc30540eb',
  })
  @IsUUID()
  eventId: string;

  @ApiProperty({ description: 'User ID', example: 'user123' })
  @IsString()
  userId: string;
}
