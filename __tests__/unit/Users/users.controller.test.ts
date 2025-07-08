import { Request, Response } from 'express';
import * as UserController from '../../../src/Users/user.controller';
import * as UserService from '../../../src/Users/user.service';

jest.mock('../../../src/Users/user.service');

describe('User Controller', () => {
  const mockRes = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createUser should create and return new user', async () => {
    const mockUser = { userId: 1 };
    (UserService.createUser as jest.Mock).mockResolvedValue(mockUser);

    const req = { body: { name: 'John' } } as Request;
    const res = mockRes();
    await UserController.createUser(req, res);

    expect(UserService.createUser).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  test('getAllUsers should return all users', async () => {
    const mockUsers = [{ userId: 1 }, { userId: 2 }];
    (UserService.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

    const res = mockRes();
    await UserController.getAllUsers({} as Request, res);

    expect(UserService.getAllUsers).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });

  test('getUserById should return a user', async () => {
    const mockUser = { userId: 1 };
    (UserService.getUserById as jest.Mock).mockResolvedValue(mockUser);

    const req = { params: { id: '1' } } as unknown as Request;
    const res = mockRes();
    await UserController.getUserById(req, res);

    expect(UserService.getUserById).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  test('updateUser should update and return user', async () => {
    const mockExisting = { userId: 1, createdOn: new Date() };
    const mockUpdated = { userId: 1, name: 'Updated' };

    (UserService.getUserById as jest.Mock).mockResolvedValue(mockExisting);
    (UserService.updateUser as jest.Mock).mockResolvedValue(mockUpdated);

    const req = { params: { id: '1' }, body: { name: 'Updated' } } as unknown as Request;
    const res = mockRes();
    await UserController.updateUser(req, res);

    expect(UserService.getUserById).toHaveBeenCalledWith(1);
    expect(UserService.updateUser).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockUpdated);
  });

  test('updateUser should return 404 if user not found', async () => {
    (UserService.getUserById as jest.Mock).mockResolvedValue(null);

    const req = { params: { id: '999' }, body: {} } as unknown as Request;
    const res = mockRes();
    await UserController.updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  test('deleteUser should delete and return user', async () => {
    const mockDeleted = { userId: 1, deleted: true };
    (UserService.deleteUser as jest.Mock).mockResolvedValue(mockDeleted);

    const req = { params: { id: '1' } } as unknown as Request;
    const res = mockRes();
    await UserController.deleteUser(req, res);

    expect(UserService.deleteUser).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(mockDeleted);
  });
});
