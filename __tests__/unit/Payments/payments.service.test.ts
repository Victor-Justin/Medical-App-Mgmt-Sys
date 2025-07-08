import * as paymentService from '../../../src/Payments/payments.service';
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

describe('Payment Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get all payments', () => {
    paymentService.getAllPayments();
    expect(db.select).toHaveBeenCalled();
  });

  it('should get payment by ID', async () => {
    await paymentService.getPaymentById(1);
    expect(db.select).toHaveBeenCalled();
  });

  it('should create a payment', () => {
    const valuesMock = jest.fn(() => ({ returning: jest.fn() }));
    (db.insert as jest.Mock).mockReturnValue({ values: valuesMock });

    const data = {
      apId: 1,
      amount: 500,
    };

    paymentService.createPayment(data);

    expect(db.insert).toHaveBeenCalled();
    expect(valuesMock).toHaveBeenCalledWith(data);
  });

  it('should update a payment', () => {
    const setMock = jest.fn(() => ({ where: jest.fn(() => ({ returning: jest.fn() })) }));
    (db.update as jest.Mock).mockReturnValue({ set: setMock });

    const data = {
      amount: 1000,
    };

    paymentService.updatePayment(1, data);

    expect(db.update).toHaveBeenCalled();
    expect(setMock).toHaveBeenCalledWith(data);
  });

  it('should delete a payment', () => {
    const whereMock = jest.fn(() => ({ returning: jest.fn() }));
    (db.delete as jest.Mock).mockReturnValue({ where: whereMock });

    paymentService.deletePayment(1);

    expect(db.delete).toHaveBeenCalled();
    expect(whereMock).toHaveBeenCalled();
  });
});
