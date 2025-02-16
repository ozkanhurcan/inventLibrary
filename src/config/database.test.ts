import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { AppDataSource } from './database';

config({ path: '.env.test' });

export const TestDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  dropSchema: true,
  entities: ['src/entities/*.ts'],
  migrations: ['src/migrations/*.ts']
});

describe('Database Configuration', () => {
  it('should have correct configuration', () => {
    expect(AppDataSource.options.type).toBe('postgres');
    expect(AppDataSource.options.database).toBe(process.env.DB_NAME);
    expect(AppDataSource.options.synchronize).toBe(false);
  });
}); 