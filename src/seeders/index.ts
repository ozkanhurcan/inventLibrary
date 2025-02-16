import 'dotenv/config';
import { AppDataSource } from '@config/database';
import { seedBooks } from '@seeders/book.seeder';

AppDataSource.initialize()
  .then(async () => {
    try {
      await seedBooks();
      console.log('Seeding completed successfully');
    } catch (error) {
      console.error('Error during seeding:', error);
    } finally {
      await AppDataSource.destroy();
    }
  })
  .catch((error) => {
    console.error('Error during Data Source initialization:', error);
  }); 