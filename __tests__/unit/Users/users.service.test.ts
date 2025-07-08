import * as UserService from '../../../src/Users/user.service';
import db from '../../../src/Drizzle/db';

jest.mock('../../../src/Drizzle/db', () => {
  const queryChain: any = {
    where: jest.fn(() => queryChain),
    leftJoin: jest.fn(() => queryChain),
    set: jest.fn(() => queryChain),
    returning: jest.fn(() => [{}]),
    delete: jest.fn(() => queryChain),
  };

  return {
    __esModule: true,
    default: {
      select: jest.fn(() => ({ from: jest.fn(() => queryChain) })),
      insert: jest.fn(() => ({ values: jest.fn(() => ({ returning: jest.fn(() => [{}]) })) })),
      update: jest.fn(() => ({
        set: jest.fn(() => ({ where: jest.fn(() => ({ returning: jest.fn(() => [{}]) })) })),
      })),
      delete: jest.fn(() => ({ where: jest.fn(() => ({ returning: jest.fn(() => [{}]) })) })),
      query: {
        UsersTable: {
          findFirst: jest.fn(),
        },
        DoctorsTable: {
          findFirst: jest.fn(),
        },
      },
    },
  };
});

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get all users', () => {
    UserService.getAllUsers();
    expect(db.select).toHaveBeenCalled();
  });

  it('should get user by ID and joined tables', async () => {
    await UserService.getUserById(1);
    expect(db.select).toHaveBeenCalled();
  });

  it('should create a user', () => {
    UserService.createUser({ fName: 'John' });
    expect(db.insert).toHaveBeenCalled();
  });

  it('should update a user without promoting if not a doctor', async () => {
    (db.update as jest.Mock).mockReturnValue({
      set: jest.fn(() => ({
        where: jest.fn(() => ({
          returning: jest.fn(() => [{ userId: 1, role: 'patient' }]),
        })),
      })),
    });

    const result = await UserService.updateUser(1, { role: 'patient' });

    expect(db.update).toHaveBeenCalled();
    expect(result).toEqual({ userId: 1, role: 'patient' });
  });

  it('should update a user and promote to doctor if role is doctor', async () => {
    (db.update as jest.Mock).mockReturnValue({
      set: jest.fn(() => ({
        where: jest.fn(() => ({
          returning: jest.fn(() => [{ userId: 1, role: 'doctor' }]),
        })),
      })),
    });

    const promoteSpy = jest.spyOn(UserService, 'promoteUserToDoctor').mockResolvedValue({
      fName: 'John',
      lName: 'Doe',
      email: 'doctor@example.com',
      contactNo: '123456789',
      createdOn: new Date(),
      updatedOn: new Date(),
      docId: 1,
      specialization: 'General',
      availableDays: 'Mon-Fri',
    });

    const result = await UserService.updateUser(1, { role: 'doctor' });

    expect(db.update).toHaveBeenCalled();
    expect(promoteSpy).toHaveBeenCalledWith(1);
    expect(result).toEqual({ userId: 1, role: 'doctor' });
  });

  it('should delete a user and their doctor record if role is doctor', async () => {
    (db.query.UsersTable.findFirst as jest.Mock)
      .mockResolvedValueOnce({
        userId: 1,
        role: 'doctor',
        email: 'doctor@example.com',
      });

    const result = await UserService.deleteUser(1);

    expect(db.delete).toHaveBeenCalled();
    expect(result).toEqual({});
  });

  it('should throw error if user to delete is not found', async () => {
    (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValue(null);

    await expect(UserService.deleteUser(1)).rejects.toThrow('User not found');
  });

});
