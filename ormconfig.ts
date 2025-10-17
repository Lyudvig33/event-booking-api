import * as path from 'path';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import {
  initializeTransactionalContext,
  addTransactionalDataSource,
} from 'typeorm-transactional';

const envFile = path.resolve(__dirname, '.env');

dotenv.config({
  path: envFile,
});

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['../entities/*.entity.{js,ts}'],
  synchronize: true,
});

initializeTransactionalContext();
addTransactionalDataSource(dataSource);
