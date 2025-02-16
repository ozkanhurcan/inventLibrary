import { Request, Response } from 'express';
import { BookController } from './book.controller';
import { BookService } from '@services/book.service';
import { AppError } from '@middleware/error.handler';

jest.mock('@services/book.service');

describe('BookController', () => {
    let bookController: BookController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockBookService: jest.Mocked<BookService>;

    beforeEach(() => {
        mockBookService = {
            getAllBooks: jest.fn(),
            getBook: jest.fn(),
            createBook: jest.fn(),
            updateBookAvailability: jest.fn()
        } as any;

        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };

        BookService.prototype = mockBookService;
        bookController = new BookController();
    });

    describe('getAllBooks', () => {
        it('should return all books', async () => {
            const mockBooks = [
                { id: 1, name: 'Book 1' },
                { id: 2, name: 'Book 2' }
            ];
            mockBookService.getAllBooks.mockResolvedValue(mockBooks);

            await bookController.getAllBooks(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockBooks);
        });

        it('should handle errors', async () => {
            mockBookService.getAllBooks.mockRejectedValue(new Error('Database error'));

            await bookController.getAllBooks(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Error fetching books'
            });
        });
    });

    describe('getBook', () => {
        it('should return a specific book', async () => {
            const mockBook = { 
                id: 1, 
                name: 'Test Book',
                score: '4.50'
            };
            mockRequest.params = { id: '1' };
            mockBookService.getBook.mockResolvedValue(mockBook);

            await bookController.getBook(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockBook);
        });

        it('should handle not found error', async () => {
            mockRequest.params = { id: "-1" };
            mockBookService.getBook.mockRejectedValue(new AppError(404, 'Book not found'));

            await bookController.getBook(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Book not found'
            });
        });
    });

    describe('createBook', () => {
        it('should create a new book', async () => {
            const bookData = { name: 'New Book' };
            mockRequest.body = bookData;

            await bookController.createBook(mockRequest as Request, mockResponse as Response);

            expect(mockBookService.createBook).toHaveBeenCalledWith(bookData);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalled();
        });

        it('should handle creation errors', async () => {
            mockRequest.body = { name: 'New Book' };
            mockBookService.createBook.mockRejectedValue(new Error('Creation failed'));

            await bookController.createBook(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Error creating book'
            });
        });
    });
}); 