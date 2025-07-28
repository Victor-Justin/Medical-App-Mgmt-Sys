import { Request, Response } from "express";
import * as PaymentService from "./payments.service";


export const createPayment = async (req: Request, res: Response) => {
  const now = new Date();

  const paymentData = {
    ...req.body,
    createdOn: now,
    updatedOn: now,
  };

  const newPayment = await PaymentService.createPayment(paymentData);
  res.status(201).json(newPayment);
};


export const getAllPayments = async (req: Request, res: Response) => {
  const payments = await PaymentService.getAllPayments();
  res.json(payments);
};


export const getPaymentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const payment = await PaymentService.getPaymentById(Number(id));

  if (!payment) {
    return res.status(404).json({ message: "Payment not found" });
  }

  res.json(payment);
};


export const updatePayment = async (req: Request, res: Response) => {
  const { id } = req.params;

  const existingPayment = await PaymentService.getPaymentById(Number(id));
  if (!existingPayment) {
    return res.status(404).json({ message: "Payment not found" });
  }

  const paymentData = {
    ...req.body,
    createdOn: existingPayment.createdOn, 
    updatedOn: new Date(),                
  };

  const updatedPayment = await PaymentService.updatePayment(Number(id), paymentData);
  res.json(updatedPayment);
};


export const deletePayment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedPayment = await PaymentService.deletePayment(Number(id));
  res.json(deletedPayment);
};


export const getPaymentsByUserId = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);

  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  const payments = await PaymentService.getPaymentsByUserId(userId);

  if (!payments || payments.length === 0) {
    return res.status(404).json({ message: "No payments found for this user" });
  }

  res.json(payments);
};
