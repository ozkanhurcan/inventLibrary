import { Request, Response } from 'express';
import { BookService } from '@services/book.service';

export class BookController {
  private bookService: BookService;

  constructor() {
    this.bookService = new BookService();
  }

  getAllBooks = async (req: Request, res: Response): Promise<void> => {
    try {
      const books = await this.bookService.getAllBooks();
      res.status(200).json(books);
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching books'
      });
    }
  };

  getBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const book = await this.bookService.getBook(Number(id));
      res.status(200).json(book);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        message: error.message || 'Error fetching book'
      });
    }
  };

  createBook = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.bookService.createBook(req.body);
      res.status(201).json();
    } catch (error) {
      res.status(500).json({
        message: 'Error creating book'
      });
    }
  };

  updateBookAvailability = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.bookService.updateBookAvailability(Number(id), req.body);
      res.status(204).send();
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        message: error.message || 'Error updating book availability'
      });
    }
  };
} 