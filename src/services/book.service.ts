import { IsNull, Repository } from 'typeorm';
import { AppDataSource } from '@config/database';
import { Book } from '@entities/Book.entity';
import { BookBorrow } from '@entities/BookBorrow.entity';
import { AppError } from '@middleware/error.handler';
import { BookAvailability } from '@entities/Book.entity';
import { ECDH } from 'crypto';

export class BookService {
  private bookRepository: Repository<Book>;
  private bookBorrowRepository: Repository<BookBorrow>;

  constructor() {
    this.bookRepository = AppDataSource.getRepository(Book);
    this.bookBorrowRepository = AppDataSource.getRepository(BookBorrow);
  }

  async getAllBooks(): Promise<{ id: number; name: string }[]> {
    const books = await this.bookRepository.find({
      select: ['id', 'name'],
      where: { 
        deleted_at: IsNull(),
        availability: BookAvailability.AVAILABLE 
      },
      order: { name: 'ASC' }
    });
    return books;
  }

  async getBook(id: number): Promise<any> {
    const book = await this.bookRepository.findOne({
      where: { id, deleted_at: IsNull() },
      relations: ['bookBorrows']
    });

    if (!book) {
      throw new AppError(404, 'Book not found');
    }
    const scores = book.bookBorrows
    .filter(borrow => borrow.score !== null)
    .map(borrow => borrow.score);
    
    const averageScore = scores.length > 0
    ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)
    : -1;
    return {
      id: book.id,
      name: book.name,
      score: averageScore
    };
  }

  async createBook(bookData: { name: string }): Promise<Book> {
    const book = this.bookRepository.create(bookData);
    return await this.bookRepository.save(book);
  }

  async updateBookAvailability(id: number, bookData: { availability: BookAvailability }): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new AppError(404, 'Book not found');
    }
    return await this.bookRepository.save({ ...book, ...bookData });
  }

  async findAll() {
    return await this.bookRepository.find({
      where: {
        deleted_at: IsNull()
      }
    });
  }

  async findOne(id: number) {
    return await this.bookRepository.findOne({
      where: { 
        id, 
        deleted_at: IsNull()
      }
    });
  }
} 