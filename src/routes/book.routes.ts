import { Router } from 'express';
import { BookController } from '@controllers/book.controller';
import { validateRequest } from '@middleware/validate.request';
import { createBookSchema } from '@validators/book.validator';

const router = Router();
const bookController = new BookController();

router.get('/', bookController.getAllBooks.bind(bookController));
router.get('/:id', bookController.getBook.bind(bookController));
router.post('/', validateRequest(createBookSchema), bookController.createBook.bind(bookController));
router.patch('/:id/availability', bookController.updateBookAvailability.bind(bookController));

export const bookRouter = router; 