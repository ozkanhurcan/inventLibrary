import { AppDataSource } from '../src/config/database';

beforeAll(async () => {
  await AppDataSource.initialize();
});

beforeEach(async () => {
  await AppDataSource.transaction(async manager => {
    await manager.query('DELETE FROM book_borrows');
    await manager.query('DELETE FROM books');
    await manager.query('DELETE FROM users');
  });
});

afterAll(async () => {
  await AppDataSource.destroy();

}); 