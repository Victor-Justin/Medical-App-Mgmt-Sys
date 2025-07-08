import * as DoctorService from '../../../src/Doctors/doctors.service';
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
      query: {
        DoctorsTable: {
          findFirst: jest.fn(),
        },
        UsersTable: {
          findFirst: jest.fn(),
        },
      },
    },
  };
});

describe('Doctor Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should get all doctors', () => {
    DoctorService.getAllDoctors();
    expect(db.select).toHaveBeenCalled();
  });

  test('should get doctor by ID', () => {
    DoctorService.getDoctorById(1);
    expect(db.select).toHaveBeenCalled();
  });

  test('should create a new doctor', () => {
    const valuesMock = jest.fn(() => ({ returning: jest.fn() }));
    (db.insert as jest.Mock).mockReturnValue({ values: valuesMock });

    const data = { fName: 'John', lName: 'Doe' };
    DoctorService.createDoctor(data);

    expect(db.insert).toHaveBeenCalled();
    expect(valuesMock).toHaveBeenCalledWith(data);
  });

  test('should update a doctor by ID', () => {
    const setMock = jest.fn(() => ({ where: jest.fn(() => ({ returning: jest.fn() })) }));
    (db.update as jest.Mock).mockReturnValue({ set: setMock });

    const data = { specialization: 'Cardiology' };
    DoctorService.updateDoctor(1, data);

    expect(db.update).toHaveBeenCalled();
    expect(setMock).toHaveBeenCalledWith(data);
  });

  test('should delete a doctor and revert user role', async () => {

    const doctorMock = { docId: 1, email: 'doctor@example.com' };
    (db.query.DoctorsTable.findFirst as jest.Mock).mockResolvedValue(doctorMock);

 
    const returningMock = jest.fn().mockReturnValue([{ docId: 1 }]);
    (db.delete as jest.Mock).mockReturnValue({ where: jest.fn(() => ({ returning: returningMock })) });

  
    const userMock = { userId: 10, email: 'doctor@example.com' };
    (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValue(userMock);


    (db.update as jest.Mock).mockReturnValue({ set: jest.fn(() => ({ where: jest.fn() })) });

    const result = await DoctorService.deleteDoctor(1);

    expect(db.query.DoctorsTable.findFirst).toHaveBeenCalledWith({ where: expect.anything() });
    expect(db.delete).toHaveBeenCalled();
    expect(db.query.UsersTable.findFirst).toHaveBeenCalledWith({ where: expect.anything() });
    expect(db.update).toHaveBeenCalled();
    expect(result).toEqual({ docId: 1 });
  });

  test('should throw error if doctor not found on delete', async () => {
    (db.query.DoctorsTable.findFirst as jest.Mock).mockResolvedValue(null);

    await expect(DoctorService.deleteDoctor(999)).rejects.toThrow('Doctor not found');
  });
});
