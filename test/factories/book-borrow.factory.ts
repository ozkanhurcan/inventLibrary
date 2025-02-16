import { BookBorrow } from '@entities/BookBorrow.entity';
import { AppDataSource } from '@config/database';
import { User } from '@entities/User.entity';
import { Book, BookAvailability } from '@entities/Book.entity';
import { EntityManager } from 'typeorm';

interface CreateBookBorrowParams {
  user: User;
  book: Book;
  borrowDate?: Date;
  returnDate?: Date;
  score?: number;
  transactionalEntityManager?: EntityManager;
}

export const createBookBorrow = async ({
  user,
  book,
  borrowDate = new Date(),
  returnDate = (new Date()) || null,
  score = 5,
  transactionalEntityManager
}: CreateBookBorrowParams): Promise<BookBorrow> => {
  const manager = transactionalEntityManager || AppDataSource.manager;
  
  const bookBorrow = new BookBorrow();
  bookBorrow.user = user;
  bookBorrow.book = book;
  bookBorrow.borrowDate = borrowDate;
  bookBorrow.returnDate = returnDate;
  bookBorrow.score = score;

  const bookRepository = AppDataSource.getRepository(BookBorrow);
  const savedBorrow = await bookRepository.save(bookBorrow);

  if (!returnDate) {
    book.availability = BookAvailability.BORROWED;
    await manager.save(book);
  }
  return savedBorrow;
};

export const createBookBorrows = async (borrows: BookBorrow[]): Promise<BookBorrow[]> => {
  return Promise.all(borrows.map(borrow => createBookBorrow(borrow)));
}; 