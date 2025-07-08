import { Request, Response } from 'express';
import * as PaymentController from '../../../src/Payments/payments.controller';
import * as PaymentService from '../../../src/Payments/payments.service';

jest.mock('../../../src/Payments/payments.service');

describe('Payment Controller', () => {
  const mockRes = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getAllPayments should return all payments', async () => {
    const mockPayments = [{ id: 1 }, { id: 2 }];
    (PaymentService.getAllPayments as jest.Mock).mockResolvedValue(mockPayments);

    const res = mockRes();
    await PaymentController.getAllPayments({} as Request, res);

    expect(PaymentService.getAllPayments).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockPayments);
  });

  test('getPaymentById should return payment when found', async () => {
    const mockPayment = { id: 1 };
    (PaymentService.getPaymentById as jest.Mock).mockResolvedValue(mockPayment);

    const req = { params: { id: '1' } } as unknown as Request;
    const res = mockRes();
    await PaymentController.getPaymentById(req, res);

    expect(PaymentService.getPaymentById).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(mockPayment);
  });

  test('getPaymentById should return 404 when not found', async () => {
    (PaymentService.getPaymentById as jest.Mock).mockResolvedValue(null);

    const req = { params: { id: '999' } } as unknown as Request;
    const res = mockRes();
    await PaymentController.getPaymentById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Payment not found' });
  });

  test('createPayment should create and return new payment', async () => {
    const mockNewPayment = { id: 3 };
    (PaymentService.createPayment as jest.Mock).mockResolvedValue(mockNewPayment);

    const req = { body: { amount: 500, apId: 1 } } as Request;
    const res = mockRes();
    await PaymentController.createPayment(req, res);

    expect(PaymentService.createPayment).toHaveBeenCalledWith(expect.objectContaining(req.body));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockNewPayment);
  });

  test('updatePayment should update and return payment', async () => {
    const existingPayment = { id: 1, createdOn: new Date() };
    (PaymentService.getPaymentById as jest.Mock).mockResolvedValue(existingPayment);

    const updatedPayment = { id: 1, amount: 1000 };
    (PaymentService.updatePayment as jest.Mock).mockResolvedValue(updatedPayment);

    const req = { params: { id: '1' }, body: { amount: 1000 } } as unknown as Request;
    const res = mockRes();
    await PaymentController.updatePayment(req, res);

    expect(PaymentService.updatePayment).toHaveBeenCalledWith(
      1,
      expect.objectContaining(req.body)
    );
    expect(res.json).toHaveBeenCalledWith(updatedPayment);
  });

  test('updatePayment should return 404 when payment not found', async () => {
    (PaymentService.getPaymentById as jest.Mock).mockResolvedValue(null);

    const req = { params: { id: '999' }, body: {} } as unknown as Request;
    const res = mockRes();
    await PaymentController.updatePayment(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Payment not found' });
  });

  test('deletePayment should delete and return result', async () => {
    const mockDeleted = { id: 1, deleted: true };
    (PaymentService.deletePayment as jest.Mock).mockResolvedValue(mockDeleted);

    const req = { params: { id: '1' } } as unknown as Request;
    const res = mockRes();
    await PaymentController.deletePayment(req, res);

    expect(PaymentService.deletePayment).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(mockDeleted);
  });
});
