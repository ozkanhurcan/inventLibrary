import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '@entities/User.entity';
import { Book } from '@entities/Book.entity';
import { BookBorrow } from '@entities/BookBorrow.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Book, BookBorrow],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
}); 