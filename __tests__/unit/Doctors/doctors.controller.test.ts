import { Request, Response } from 'express';
import * as DoctorController from '../../../src/Doctors/doctors.controller';
import * as DoctorService from '../../../src/Doctors/doctors.service';

jest.mock('../../../src/Doctors/doctors.service');

describe('Doctor Controller', () => {
  const mockRes = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createDoctor should create and return new doctor', async () => {
    const mockDoctor = { docId: 1 };
    (DoctorService.createDoctor as jest.Mock).mockResolvedValue(mockDoctor);

    const req = { body: { fName: 'John', lName: 'Doe' } } as Request;
    const res = mockRes();
    await DoctorController.createDoctor(req, res);

    expect(DoctorService.createDoctor).toHaveBeenCalledWith(expect.objectContaining(req.body));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockDoctor);
  });

  test('getAllDoctors should fetch and return doctors', async () => {
    const mockDoctors = [{ docId: 1 }, { docId: 2 }];
    (DoctorService.getAllDoctors as jest.Mock).mockResolvedValue(mockDoctors);

    const res = mockRes();
    await DoctorController.getAllDoctors({} as Request, res);

    expect(DoctorService.getAllDoctors).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockDoctors);
  });

  test('getDoctorById should fetch and return doctor by ID', async () => {
    const mockDoctor = { docId: 1 };
    (DoctorService.getDoctorById as jest.Mock).mockResolvedValue(mockDoctor);

    const req = { params: { id: '1' } } as unknown as Request;
    const res = mockRes();
    await DoctorController.getDoctorById(req, res);

    expect(DoctorService.getDoctorById).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(mockDoctor);
  });

  test('updateDoctor should update and return doctor', async () => {
    const mockUpdatedDoctor = { docId: 1, specialization: 'Cardiology' };
    (DoctorService.updateDoctor as jest.Mock).mockResolvedValue(mockUpdatedDoctor);

    const req = {
      params: { id: '1' },
      body: { specialization: 'Cardiology' },
    } as unknown as Request;
    const res = mockRes();
    await DoctorController.updateDoctor(req, res);

    expect(DoctorService.updateDoctor).toHaveBeenCalledWith(1, expect.objectContaining(req.body));
    expect(res.json).toHaveBeenCalledWith(mockUpdatedDoctor);
  });

  test('deleteDoctor should delete and return doctor', async () => {
    const mockDeletedDoctor = { docId: 1, deleted: true };
    (DoctorService.deleteDoctor as jest.Mock).mockResolvedValue(mockDeletedDoctor);

    const req = { params: { id: '1' } } as unknown as Request;
    const res = mockRes();
    await DoctorController.deleteDoctor(req, res);

    expect(DoctorService.deleteDoctor).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(mockDeletedDoctor);
  });
});
