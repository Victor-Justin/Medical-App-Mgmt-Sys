import { Request, Response } from "express";
import * as AppointmentService from "./appointments.service";
import * as PaymentService from "../Payments/payments.service";  


export const createAppointment = async (req: Request, res: Response) => {
  const now = new Date();

  const appointmentData = {
    ...req.body,
    createdOn: now,
    updatedOn: now,
  };

  const newAppointment = await AppointmentService.createAppointment(appointmentData);
  const appointment = newAppointment[0];

  // Auto-create payment for this appointment
  const paymentData = {
    transId: Math.floor(100000 + Math.random() * 999999), 
    apId: appointment.apId,
    amount: appointment.amount, 
    payStatus: "unpaid",
    payDate: appointment.apDate,
    createdOn: now,
    updatedOn: now,
  };

  await PaymentService.createPayment(paymentData);

  res.status(201).json(appointment);
};



export const getAllAppointments = async (req: Request, res: Response) => {
  const appointments = await AppointmentService.getAllAppointments();
  res.json(appointments);
};


export const getAppointmentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const appointment = await AppointmentService.getAppointmentById(Number(id));

  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found" });
  }

  res.json(appointment);
};


export const updateAppointment = async (req: Request, res: Response) => {
  const { id } = req.params;


  const existingAppointment = await AppointmentService.getAppointmentById(Number(id));
  if (!existingAppointment) {
    return res.status(404).json({ message: "Appointment not found" });
  }

  const appointmentData = {
    ...req.body,
    createdOn: existingAppointment.createdOn, 
    updatedOn: new Date(),                    
  };

  const updatedAppointment = await AppointmentService.updateAppointment(Number(id), appointmentData);
  res.json(updatedAppointment);
};


export const deleteAppointment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedAppointment = await AppointmentService.deleteAppointment(Number(id));
  res.json(deletedAppointment);
};
