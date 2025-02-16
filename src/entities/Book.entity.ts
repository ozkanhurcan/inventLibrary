import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BookBorrow } from '@entities/BookBorrow.entity';
import { BaseEntity } from '@entities/Base.entity';

export enum BookAvailability {
  AVAILABLE = 'AVAILABLE',
  BORROWED = 'BORROWED'
}

@Entity('books')
export class Book extends BaseEntity {
  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: BookAvailability,
    default: BookAvailability.AVAILABLE
  })
  availability: BookAvailability;

  @OneToMany(() => BookBorrow, (bookBorrow) => bookBorrow.book)
  bookBorrows: BookBorrow[];
}