import { Router } from 'express';
import { UserController } from '@controllers/user.controller';
import { validateRequest } from '@middleware/validate.request';
import { createUserSchema } from '@validators/user.validator';
import { returnBookSchema } from '@validators/book.validator';

const router = Router();
const userController = new UserController();

router.get('/', userController.getAllUsers.bind(userController));
router.get('/:id', userController.getUser.bind(userController));
router.post('/', validateRequest(createUserSchema), userController.createUser.bind(userController));
router.post('/:userId/borrow/:bookId', userController.borrowBook.bind(userController));
router.post(
  '/:userId/return/:bookId',
  validateRequest(returnBookSchema),
  userController.returnBook.bind(userController)
);

export const userRouter = router; 