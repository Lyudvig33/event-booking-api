import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export enum StatsPeriod {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

export class TopUsersStatsDto {
  @ApiProperty({
    enum: StatsPeriod,
    example: StatsPeriod.DAY,
    description:
      'The period for which to retrieve top users (day, week, month).',
  })
  @IsEnum(StatsPeriod)
  period: StatsPeriod;

  @ApiPropertyOptional({
    example: 10,
    description: 'Number of top users to return (default: 10, min:1, max:50).',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;
}
