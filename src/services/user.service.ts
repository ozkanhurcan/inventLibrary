import { IsNull, Repository } from 'typeorm';
import { AppDataSource } from '@config/database';
import { User } from '@entities/User.entity';
import { Book } from '@entities/Book.entity';
import { BookBorrow } from '@entities/BookBorrow.entity';
import { AppError } from '@middleware/error.handler';
import { BookAvailability } from '@entities/Book.entity';

export class UserService {
  private userRepository: Repository<User>;
  private bookRepository: Repository<Book>;
  private bookBorrowRepository: Repository<BookBorrow>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.bookRepository = AppDataSource.getRepository(Book);
    this.bookBorrowRepository = AppDataSource.getRepository(BookBorrow);
  }

  async getAllUsers(): Promise<{ id: number; name: string }[]> {
    const users = await this.userRepository.find({
      select: ['id', 'name'],
      order: { name: 'ASC' },
      where: { deleted_at: IsNull() }
    });
    return users;
  }

  async getUser(id: number): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id, deleted_at: IsNull() },
      relations: ['bookBorrows', 'bookBorrows.book']
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const pastBooks = user.bookBorrows
      .filter(borrow => borrow.returnDate)
      .map(borrow => ({
        name: borrow.book.name,
        userScore: borrow.score
      }));

    const presentBooks = user.bookBorrows
      .filter(borrow => !borrow.returnDate)
      .map(borrow => ({
        name: borrow.book.name
      }));

    return {
      id: user.id,
      name: user.name,
      books: {
        past: pastBooks,
        present: presentBooks
      }
    };
  }

  async createUser(userData: { name: string }): Promise<User> {
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async borrowBook(userId: number, bookId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const book = await this.bookRepository.findOne({ where: { id: bookId } });
    if (!book) {
      throw new AppError(404, 'Book not found');
    }

    if (book.availability === BookAvailability.BORROWED) {
      throw new AppError(400, 'Book already borrowed');
    }

    await AppDataSource.transaction(async transactionalEntityManager => {
      book.availability = BookAvailability.BORROWED;
      await transactionalEntityManager.save(book);

      const bookBorrow = this.bookBorrowRepository.create({
        user,
        book,
        borrowDate: new Date()
      });
      await transactionalEntityManager.save(bookBorrow);
    });
  }

  async returnBook(userId: number, bookId: number, score: number): Promise<void> {
    const bookBorrow = await this.bookBorrowRepository.findOne({
      where: {
        user: { id: userId },
        book: { id: bookId },
        returnDate: IsNull()
      },
      relations: ['book']
    });

    if (!bookBorrow) {
      throw new AppError(404, 'Borrow not found');
    }

    await AppDataSource.transaction(async transactionalEntityManager => {
      const book = bookBorrow.book;
      book.availability = BookAvailability.AVAILABLE;
      await transactionalEntityManager.save(book);

      bookBorrow.returnDate = new Date();
      bookBorrow.score = score;
      await transactionalEntityManager.save(bookBorrow);
    });
  }
} 