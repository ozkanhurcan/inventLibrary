import { Request, Response } from 'express';
import { UserController } from './user.controller';
import { UserService } from '@services/user.service';
import { AppError } from '@middleware/error.handler';

jest.mock('@services/user.service');

describe('UserController', () => {
    let userController: UserController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockUserService: jest.Mocked<UserService>;

    beforeEach(() => {
        mockUserService = {
            getAllUsers: jest.fn(),
            getUser: jest.fn(),
            createUser: jest.fn(),
            borrowBook: jest.fn(),
            returnBook: jest.fn()
        } as any;

        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };

        UserService.prototype = mockUserService;
        userController = new UserController();
    });

    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const mockUsers = [
                { id: 2, name: "Enes Faruk Meniz" },
                { id: 1, name: "Eray Aslan" },
                { id: 4, name: "Kadir Mutlu" },
                { id: 3, name: "Sefa Eren Şahin" }
            ];
            mockUserService.getAllUsers.mockResolvedValue(mockUsers);

            await userController.getAllUsers(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockUsers);
        });

        it('should handle errors', async () => {
            mockUserService.getAllUsers.mockRejectedValue(new Error('Database error'));

            await userController.getAllUsers(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Error fetching users'
            });
        });
    });

    describe('getUser', () => {
        it('should return user with empty book history', async () => {
            const mockUser = {
                id: 4,
                name: "Kadir Mutlu",
                books: {
                    past: [],
                    present: []
                }
            };
            mockRequest.params = { id: '4' };
            mockUserService.getUser.mockResolvedValue(mockUser);

            await userController.getUser(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
        });

        it('should return user with book history', async () => {
            const mockUser = {
                id: 2,
                name: "Enes Faruk Meniz",
                books: {
                    past: [
                        {
                            name: "I, Robot",
                            userScore: 5
                        },
                        {
                            name: "The Hitchhiker's Guide to the Galaxy",
                            userScore: 10
                        }
                    ],
                    present: [
                        {
                            name: "Brave New World"
                        }
                    ]
                }
            };
            mockRequest.params = { id: '2' };
            mockUserService.getUser.mockResolvedValue(mockUser);

            await userController.getUser(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
        });

        it('should handle not found error', async () => {
            mockRequest.params = { id: "-1" };
            mockUserService.getUser.mockRejectedValue(new AppError(404, 'User not found'));

            await userController.getUser(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'User not found'
            });
        });
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            const userData = { name: 'Esin Öner' };
            mockRequest.body = userData;

            await userController.createUser(mockRequest as Request, mockResponse as Response);

            expect(mockUserService.createUser).toHaveBeenCalledWith(userData);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalled();
        });

        it('should handle creation errors', async () => {
            mockRequest.body = { name: 'Esin Öner' };
            mockUserService.createUser.mockRejectedValue(new Error('Creation failed'));

            await userController.createUser(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Error creating user'
            });
        });
    });

    describe('borrowBook', () => {
        it('should borrow a book successfully', async () => {
            mockRequest.params = { userId: '2', bookId: '4' };

            await userController.borrowBook(mockRequest as Request, mockResponse as Response);

            expect(mockUserService.borrowBook).toHaveBeenCalledWith(2, 4);
            expect(mockResponse.status).toHaveBeenCalledWith(204);
            expect(mockResponse.send).toHaveBeenCalled();
        });

        it('should handle borrow errors', async () => {
            mockRequest.params = { userId: '2', bookId: '4' };
            mockUserService.borrowBook.mockRejectedValue(new AppError(400, 'Book already borrowed'));

            await userController.borrowBook(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Book already borrowed'
            });
        });
    });

    describe('returnBook', () => {
        it('should return a book with score', async () => {
            mockRequest.params = { userId: '2', bookId: '5' };
            mockRequest.body = { score: 9 };

            await userController.returnBook(mockRequest as Request, mockResponse as Response);

            expect(mockUserService.returnBook).toHaveBeenCalledWith(2, 5, 9);
            expect(mockResponse.status).toHaveBeenCalledWith(204);
            expect(mockResponse.send).toHaveBeenCalled();
        });

        it('should handle return errors', async () => {
            mockRequest.params = { userId: '2', bookId: '5' };
            mockRequest.body = { score: 9 };
            mockUserService.returnBook.mockRejectedValue(new AppError(404, 'Borrow record not found'));

            await userController.returnBook(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Borrow record not found'
            });
        });
    });
}); 