import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { APP_VALIDATIONS } from '@core/validators';
import { databaseConfiguration, appConfig } from '@core/config';
import * as ENTITIES from '@core/entities';
import { BookingsModule } from '@resources/bookings/bookings.module';
import { EventsModule } from '@resources/events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      validationSchema: APP_VALIDATIONS,
      load: [appConfig, databaseConfiguration],
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'global',
          limit: 100_000, // Allows 100_000 requests per minute.
          ttl: 60000,
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>(`DB_CONFIG.host`),
          port: configService.get<number>(`DB_CONFIG.port`),
          username: configService.get<string>(`DB_CONFIG.username`),
          password: configService.get<string>(`DB_CONFIG.password`),
          database: configService.get<string>(`DB_CONFIG.database`),
          autoLoadEntities: true,
          entities: Object.values(ENTITIES),
          // Do not use synchronize in production mode
          // https://docs.nestjs.com/techniques/database
          synchronize: true,
        };
      },
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    BookingsModule,
    EventsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
