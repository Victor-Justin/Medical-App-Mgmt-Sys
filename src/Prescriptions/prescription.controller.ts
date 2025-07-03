import { Request, Response } from "express";
import * as PrescriptionService from "./prescription.service";


export const createPrescription = async (req: Request, res: Response) => {
  const now = new Date();

  const prescriptionData = {
    ...req.body,
    createdOn: now,
    updatedOn: now,
  };

  const newPrescription = await PrescriptionService.createPrescription(prescriptionData);
  res.status(201).json(newPrescription);
};


export const getAllPrescriptions = async (req: Request, res: Response) => {
  const prescriptions = await PrescriptionService.getAllPrescriptions();
  res.json(prescriptions);
};


export const getPrescriptionById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const prescription = await PrescriptionService.getPrescriptionById(Number(id));

  if (!prescription) {
    return res.status(404).json({ message: "Prescription not found" });
  }

  res.json(prescription);
};


export const updatePrescription = async (req: Request, res: Response) => {
  const { id } = req.params;

  const existingPrescription = await PrescriptionService.getPrescriptionById(Number(id));
  if (!existingPrescription) {
    return res.status(404).json({ message: "Prescription not found" });
  }

  const prescriptionData = {
    ...req.body,
    createdOn: existingPrescription.createdOn,
    updatedOn: new Date(),
  };

  const updatedPrescription = await PrescriptionService.updatePrescription(Number(id), prescriptionData);
  res.json(updatedPrescription);
};


export const deletePrescription = async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedPrescription = await PrescriptionService.deletePrescription(Number(id));
  res.json(deletedPrescription);
};
