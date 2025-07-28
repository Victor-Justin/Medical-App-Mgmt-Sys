import { Request, Response } from "express";
import * as AppointmentService from "./appointments.service";
import * as PaymentService from "../Payments/payments.service";  


export const createAppointment = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const { startTime, apDate } = req.body;
    const startDateTime = new Date(`${apDate}T${startTime}`);
    const endDateTime = new Date(startDateTime.getTime() + 30 * 60000);

    const appointmentData = {
      ...req.body,
      startTime: startDateTime.toTimeString().slice(0, 8),
      endTime: endDateTime.toTimeString().slice(0, 8),
      createdOn: now,
      updatedOn: now,
    };

    const newAppointment = await AppointmentService.createAppointment(appointmentData);
    const appointment = newAppointment[0];

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
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Appointment creation failed" });
  }
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


export const getAppointmentsByUserId = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);

  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  const appointments = await AppointmentService.getAppointmentsByUserId(userId);
  res.status(200).json(appointments);
};

export const getAppointmentsByDoctorId = async (req: Request, res: Response) => {
  const docId = Number(req.params.docId);

  if (isNaN(docId)) {
    return res.status(400).json({ message: "Invalid doctor ID" });
  }

  const appointments = await AppointmentService.getAppointmentsByDoctorId(docId);
  res.status(200).json(appointments);
};

export const cancelAppointment = async (req: Request, res: Response) => {
  const { id } = req.params;

  const existingAppointment = await AppointmentService.getAppointmentById(Number(id));
  if (!existingAppointment) {
    return res.status(404).json({ message: "Appointment not found" });
  }

  const updatedAppointment = await AppointmentService.updateAppointment(Number(id), {
    apStatus: "cancelled",
    updatedOn: new Date(),
  });

  res.status(200).json({
    message: "Appointment cancelled successfully",
    appointment: updatedAppointment,
  });
};


export const confirmAppointment = async (req: Request, res: Response) => {
  const { id } = req.params;

  const existingAppointment = await AppointmentService.getAppointmentById(Number(id));
  if (!existingAppointment) {
    return res.status(404).json({ message: "Appointment not found" });
  }

  const updatedAppointment = await AppointmentService.updateAppointment(Number(id), {
    apStatus: "confirmed",
    updatedOn: new Date(),
  });

  res.status(200).json({
    message: "Appointment confirmed successfully",
    appointment: updatedAppointment,
  });
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
