import express from 'express';
import { userRouter } from '@routes/user.routes';
import { bookRouter } from '@routes/book.routes';
import { errorHandler } from '@middleware/error.handler';

const app = express();

app.use(express.json());

app.use('/users', userRouter);
app.use('/books', bookRouter);

app.use(errorHandler);

export default app; 