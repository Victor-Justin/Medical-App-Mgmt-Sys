import { Request, Response } from "express";
import * as DoctorService from "./doctors.service";

// Create a new doctor with timestamps
export const createDoctor = async (req: Request, res: Response) => {
  const now = new Date();

  const doctorData = {
    ...req.body,
    createdOn: now,
    updatedOn: now,
  };

  const newDoctor = await DoctorService.createDoctor(doctorData);
  res.status(201).json(newDoctor);
};

// Get all doctors
export const getAllDoctors = async (req: Request, res: Response) => {
  const doctors = await DoctorService.getAllDoctors();
  res.json(doctors);
};

// Get doctor by ID with related appointments & prescriptions
export const getDoctorById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const doctor = await DoctorService.getDoctorById(Number(id));
  res.json(doctor);
};

// Update doctor by ID, updating updatedOn timestamp
export const updateDoctor = async (req: Request, res: Response) => {
  const { id } = req.params;

  const doctorData = {
    ...req.body,
    updatedOn: new Date(),
  };

  const updatedDoctor = await DoctorService.updateDoctor(Number(id), doctorData);
  res.json(updatedDoctor);
};

// Delete doctor by ID
export const deleteDoctor = async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedDoctor = await DoctorService.deleteDoctor(Number(id));
  res.json(deletedDoctor);
};
