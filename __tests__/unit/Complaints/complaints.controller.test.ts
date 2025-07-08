import { Request, Response } from 'express';
import * as ComplaintController from '../../../src/Complaints/complaints.controller';
import * as ComplaintService from '../../../src/Complaints/complaints.service';

jest.mock('../../../src/Complaints/complaints.service');

describe('Complaint Controller', () => {
  const mockRes = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createComplaint should create and return new complaint', async () => {
    const mockComplaint = { id: 1 };
    (ComplaintService.createComplaint as jest.Mock).mockResolvedValue(mockComplaint);

    const req = { body: { subject: 'Test', description: 'Test desc' } } as Request;
    const res = mockRes();

    await ComplaintController.createComplaint(req, res);

    expect(ComplaintService.createComplaint).toHaveBeenCalledWith(expect.objectContaining({
      subject: 'Test',
      description: 'Test desc'
    }));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockComplaint);
  });

  test('getAllComplaints should return all complaints', async () => {
    const mockComplaints = [{ id: 1 }, { id: 2 }];
    (ComplaintService.getAllComplaints as jest.Mock).mockResolvedValue(mockComplaints);

    const res = mockRes();
    await ComplaintController.getAllComplaints({} as Request, res);

    expect(ComplaintService.getAllComplaints).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockComplaints);
  });

  test('getComplaintById should return complaint if found', async () => {
    const mockComplaint = { id: 1 };
    (ComplaintService.getComplaintById as jest.Mock).mockResolvedValue(mockComplaint);

    const req = { params: { id: '1' } } as unknown as Request;
    const res = mockRes();

    await ComplaintController.getComplaintById(req, res);

    expect(ComplaintService.getComplaintById).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(mockComplaint);
  });

  test('getComplaintById should return 404 if not found', async () => {
    (ComplaintService.getComplaintById as jest.Mock).mockResolvedValue(null);

    const req = { params: { id: '999' } } as unknown as Request;
    const res = mockRes();

    await ComplaintController.getComplaintById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Complaint not found' });
  });

  test('updateComplaint should update and return complaint', async () => {
    const mockExistingComplaint = { id: 1, createdOn: new Date() };
    (ComplaintService.getComplaintById as jest.Mock).mockResolvedValue(mockExistingComplaint);
    const mockUpdatedComplaint = { id: 1, status: 'resolved' };
    (ComplaintService.updateComplaint as jest.Mock).mockResolvedValue(mockUpdatedComplaint);

    const req = { params: { id: '1' }, body: { status: 'resolved' } } as unknown as Request;
    const res = mockRes();

    await ComplaintController.updateComplaint(req, res);

    expect(ComplaintService.getComplaintById).toHaveBeenCalledWith(1);
    expect(ComplaintService.updateComplaint).toHaveBeenCalledWith(1, expect.objectContaining({
      status: 'resolved'
    }));
    expect(res.json).toHaveBeenCalledWith(mockUpdatedComplaint);
  });

  test('updateComplaint should return 404 if not found', async () => {
    (ComplaintService.getComplaintById as jest.Mock).mockResolvedValue(null);

    const req = { params: { id: '999' }, body: { status: 'resolved' } } as unknown as Request;
    const res = mockRes();

    await ComplaintController.updateComplaint(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Complaint not found' });
  });

  test('deleteComplaint should delete and return result', async () => {
    const mockDeleted = { id: 1, deleted: true };
    (ComplaintService.deleteComplaint as jest.Mock).mockResolvedValue(mockDeleted);

    const req = { params: { id: '1' } } as unknown as Request;
    const res = mockRes();

    await ComplaintController.deleteComplaint(req, res);

    expect(ComplaintService.deleteComplaint).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(mockDeleted);
  });
});
