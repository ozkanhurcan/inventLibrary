import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert } from 'typeorm';
import { BookBorrow } from '@entities/BookBorrow.entity';
import { BaseEntity } from '@entities/Base.entity';

@Entity('users')
export class User extends BaseEntity {

  @Column()
  name: string;

  @OneToMany(() => BookBorrow, (bookBorrow) => bookBorrow.user)
  bookBorrows: BookBorrow[];
} 