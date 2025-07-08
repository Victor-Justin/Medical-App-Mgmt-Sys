import * as appointmentService from '../../../src/Appointments/appointments.service';
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

describe('Appointment Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get all appointments', () => {
    appointmentService.getAllAppointments();
    expect(db.select).toHaveBeenCalled();
  });

  it('should get appointment by ID', async () => {
    await appointmentService.getAppointmentById(1);
    expect(db.select).toHaveBeenCalled();
  });

  it('should create a new appointment', () => {
    const valuesMock = jest.fn(() => ({ returning: jest.fn() }));
    (db.insert as jest.Mock).mockReturnValue({ values: valuesMock });

    const data = {
      userId: 1,
      docId: 2,
      apDate: '2025-07-01',
      timeSlot: new Date(),
      amount: 5000,
      apStatus: 'pending',
      createdOn: new Date(),
      updatedOn: new Date(),
    };

    appointmentService.createAppointment(data);

    expect(db.insert).toHaveBeenCalled();
    expect(valuesMock).toHaveBeenCalledWith(data);
  });

  it('should update an appointment', () => {
    const setMock = jest.fn(() => ({ where: jest.fn(() => ({ returning: jest.fn() })) }));
    (db.update as jest.Mock).mockReturnValue({ set: setMock });

    const data = {
      apStatus: 'completed',
    };

    appointmentService.updateAppointment(1, data);

    expect(db.update).toHaveBeenCalled();
    expect(setMock).toHaveBeenCalledWith(data);
  });

  it('should delete an appointment', () => {
    const whereMock = jest.fn(() => ({ returning: jest.fn() }));
    (db.delete as jest.Mock).mockReturnValue({ where: whereMock });

    appointmentService.deleteAppointment(1);

    expect(db.delete).toHaveBeenCalled();
    expect(whereMock).toHaveBeenCalled();
  });
});
