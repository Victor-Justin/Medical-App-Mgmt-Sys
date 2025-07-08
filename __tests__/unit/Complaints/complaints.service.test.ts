import * as ComplaintService from '../../../src/Complaints/complaints.service';
import db from '../../../src/Drizzle/db';

jest.mock('../../../src/Drizzle/db', () => {
  const queryChain: any = {
    leftJoin: jest.fn(() => queryChain),
    where: jest.fn(() => queryChain),
    returning: jest.fn(),
  };

  return {
    __esModule: true,
    default: {
      select: jest.fn(() => ({ from: jest.fn(() => queryChain) })),
      insert: jest.fn(() => ({ values: jest.fn(() => ({ returning: jest.fn() })) })),
      update: jest.fn(() => ({ set: jest.fn(() => ({ where: jest.fn(() => ({ returning: jest.fn() })) })) })),
      delete: jest.fn(() => ({ where: jest.fn(() => ({ returning: jest.fn() })) })),
    },
  };
});

describe('Complaint Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create a complaint', () => {
    const valuesMock = jest.fn(() => ({ returning: jest.fn() }));
    (db.insert as jest.Mock).mockReturnValue({ values: valuesMock });

    const data = { subject: 'Test', description: 'Issue' };
    ComplaintService.createComplaint(data);

    expect(db.insert).toHaveBeenCalled();
    expect(valuesMock).toHaveBeenCalledWith(data);
  });

  test('should get all complaints', () => {
    ComplaintService.getAllComplaints();

    expect(db.select).toHaveBeenCalled();
  });

  test('should get complaint by ID', async () => {
    const whereMock = jest.fn(() => ({
      leftJoin: jest.fn(() => ({
        leftJoin: jest.fn(() => ({
          where: jest.fn(() => [{ id: 1 }]),
        })),
      })),
    }));

    (db.select as jest.Mock).mockReturnValue({ from: jest.fn(() => ({ where: whereMock })) });

    await ComplaintService.getComplaintById(1);

    expect(db.select).toHaveBeenCalled();
  });

  test('should update a complaint', () => {
    const setMock = jest.fn(() => ({ where: jest.fn(() => ({ returning: jest.fn() })) }));
    (db.update as jest.Mock).mockReturnValue({ set: setMock });

    const data = { status: 'Resolved' };
    ComplaintService.updateComplaint(1, data);

    expect(db.update).toHaveBeenCalled();
    expect(setMock).toHaveBeenCalledWith(data);
  });

  test('should delete a complaint', () => {
    const whereMock = jest.fn(() => ({ returning: jest.fn() }));
    (db.delete as jest.Mock).mockReturnValue({ where: whereMock });

    ComplaintService.deleteComplaint(1);

    expect(db.delete).toHaveBeenCalled();
    expect(whereMock).toHaveBeenCalled();
  });
});
