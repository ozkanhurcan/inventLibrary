import { Book } from '@entities/Book.entity';
import { AppDataSource } from '@config/database';
import { BookAvailability } from '@entities/Book.entity';
import { EntityManager } from 'typeorm';

export const createBook = async (data: Partial<Book> = {}, transactionalEntityManager?: EntityManager): Promise<Book> => {
  const bookRepository = transactionalEntityManager ? transactionalEntityManager.getRepository(Book) : AppDataSource.getRepository(Book);
  
  const book = bookRepository.create({
    name: `Test Book ${Date.now()}`,
    availability: BookAvailability.AVAILABLE,
    ...data
  });

  return await bookRepository.save(book);
}; 