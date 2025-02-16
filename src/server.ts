import 'dotenv/config';
import validateEnv from '@config/env.config';
import 'reflect-metadata';
import { AppDataSource } from '@config/database';
import app from '@/app';

validateEnv();

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });
  })
  .catch((error) => {
    console.error('Error during Data Source initialization:', error);
  }); 