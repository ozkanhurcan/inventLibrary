import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '@entities/User.entity';
import { Book } from '@entities/Book.entity';
import { BaseEntity } from '@entities/Base.entity';

@Entity('book_borrows')
export class BookBorrow extends BaseEntity {

  @ManyToOne(() => User, (user) => user.bookBorrows)
  user: User;

  @ManyToOne(() => Book, (book) => book.bookBorrows)
  book: Book;

  @CreateDateColumn()
  borrowDate: Date;

  @Column({ nullable: true })
  returnDate: Date;

  @Column({ nullable: true })
  score: number;
} 