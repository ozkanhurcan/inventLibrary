import { Request, Response } from 'express';
import { UserService } from '@services/user.service';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching users'
      });
    }
  };

  getUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this.userService.getUser(Number(id));
      res.status(200).json(user);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        message: error.message || 'Error fetching user'
      });
    }
  };

  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.userService.createUser(req.body);
      res.status(201).json();
    } catch (error) {
      res.status(500).json({
        message: 'Error creating user'
      });
    }
  };

  borrowBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, bookId } = req.params;
      await this.userService.borrowBook(Number(userId), Number(bookId));
      res.status(204).send();
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        message: error.message || 'Error borrowing book'
      });
    }
  };

  returnBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, bookId } = req.params;
      const { score } = req.body;
      await this.userService.returnBook(Number(userId), Number(bookId), score);
      res.status(204).send();
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        message: error.message || 'Error returning book'
      });
    }
  };
} 