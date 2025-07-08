import { Request, Response } from 'express';
import * as PrescriptionController from '../../../src/Prescriptions/prescription.controller';
import * as PrescriptionService from '../../../src/Prescriptions/prescription.service';

jest.mock('../../../src/Prescriptions/prescription.service');

describe('Prescription Controller', () => {
  const mockRes = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getAllPrescriptions should return all prescriptions', async () => {
    const mockPrescriptions = [{ id: 1 }, { id: 2 }];
    (PrescriptionService.getAllPrescriptions as jest.Mock).mockResolvedValue(mockPrescriptions);

    const res = mockRes();
    await PrescriptionController.getAllPrescriptions({} as Request, res);

    expect(PrescriptionService.getAllPrescriptions).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockPrescriptions);
  });

  test('getPrescriptionById should return prescription when found', async () => {
    const mockPrescription = { id: 1 };
    (PrescriptionService.getPrescriptionById as jest.Mock).mockResolvedValue(mockPrescription);

    const req = { params: { id: '1' } } as unknown as Request;
    const res = mockRes();
    await PrescriptionController.getPrescriptionById(req, res);

    expect(PrescriptionService.getPrescriptionById).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(mockPrescription);
  });

  test('getPrescriptionById should return 404 when not found', async () => {
    (PrescriptionService.getPrescriptionById as jest.Mock).mockResolvedValue(null);

    const req = { params: { id: '999' } } as unknown as Request;
    const res = mockRes();
    await PrescriptionController.getPrescriptionById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Prescription not found' });
  });

  test('createPrescription should create and return new prescription', async () => {
    const mockNewPrescription = { id: 3 };
    (PrescriptionService.createPrescription as jest.Mock).mockResolvedValue(mockNewPrescription);

    const req = { body: { apId: 1, notes: 'Take daily' } } as Request;
    const res = mockRes();
    await PrescriptionController.createPrescription(req, res);

    expect(PrescriptionService.createPrescription).toHaveBeenCalledWith(expect.objectContaining(req.body));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockNewPrescription);
  });

  test('updatePrescription should update and return prescription', async () => {
    const existingPrescription = { id: 1, createdOn: new Date() };
    (PrescriptionService.getPrescriptionById as jest.Mock).mockResolvedValue(existingPrescription);

    const updatedPrescription = { id: 1, notes: 'Updated note' };
    (PrescriptionService.updatePrescription as jest.Mock).mockResolvedValue(updatedPrescription);

    const req = { params: { id: '1' }, body: { notes: 'Updated note' } } as unknown as Request;
    const res = mockRes();
    await PrescriptionController.updatePrescription(req, res);

    expect(PrescriptionService.updatePrescription).toHaveBeenCalledWith(
      1,
      expect.objectContaining(req.body)
    );
    expect(res.json).toHaveBeenCalledWith(updatedPrescription);
  });

  test('updatePrescription should return 404 when not found', async () => {
    (PrescriptionService.getPrescriptionById as jest.Mock).mockResolvedValue(null);

    const req = { params: { id: '999' }, body: {} } as unknown as Request;
    const res = mockRes();
    await PrescriptionController.updatePrescription(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Prescription not found' });
  });

  test('deletePrescription should delete and return result', async () => {
    const mockDeleted = { id: 1, deleted: true };
    (PrescriptionService.deletePrescription as jest.Mock).mockResolvedValue(mockDeleted);

    const req = { params: { id: '1' } } as unknown as Request;
    const res = mockRes();
    await PrescriptionController.deletePrescription(req, res);

    expect(PrescriptionService.deletePrescription).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(mockDeleted);
  });
});
