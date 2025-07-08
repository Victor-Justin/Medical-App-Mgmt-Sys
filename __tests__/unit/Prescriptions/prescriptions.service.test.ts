import * as PrescriptionService from '../../../src/Prescriptions/prescription.service';
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

describe('Prescription Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get all prescriptions', () => {
    PrescriptionService.getAllPrescriptions();

    expect(db.select).toHaveBeenCalled();
  });

  it('should get prescription by ID', async () => {
    await PrescriptionService.getPrescriptionById(1);

    expect(db.select).toHaveBeenCalled();
  });

  it('should create a prescription', () => {
    const valuesMock = jest.fn(() => ({ returning: jest.fn() }));
    (db.insert as jest.Mock).mockReturnValue({ values: valuesMock });

    const data = {
      apId: 1,
      docId: 1,
      userId: 1,
      notes: 'Test notes',
      createdOn: new Date(),
      updatedOn: new Date(),
    };

    PrescriptionService.createPrescription(data);

    expect(db.insert).toHaveBeenCalled();
    expect(valuesMock).toHaveBeenCalledWith(data);
  });

  it('should update a prescription', () => {
    const setMock = jest.fn(() => ({ where: jest.fn(() => ({ returning: jest.fn() })) }));
    (db.update as jest.Mock).mockReturnValue({ set: setMock });

    const data = {
      notes: 'Updated notes',
      updatedOn: new Date(),
    };

    PrescriptionService.updatePrescription(1, data);

    expect(db.update).toHaveBeenCalled();
    expect(setMock).toHaveBeenCalledWith(data);
  });

  it('should delete a prescription', () => {
    const whereMock = jest.fn(() => ({ returning: jest.fn() }));
    (db.delete as jest.Mock).mockReturnValue({ where: whereMock });

    PrescriptionService.deletePrescription(1);

    expect(db.delete).toHaveBeenCalled();
    expect(whereMock).toHaveBeenCalled();
  });
});
