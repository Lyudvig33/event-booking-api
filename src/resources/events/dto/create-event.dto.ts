import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString, Min } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ description: 'Event name', example: 'Demo Event' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Total seats', example: 100 })
  @IsInt()
  @IsPositive()
  @Min(1)
  totalSeats: number;
}
