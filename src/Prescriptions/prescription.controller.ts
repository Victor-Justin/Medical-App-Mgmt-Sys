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


export const getPrescriptionsByUserId = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);

  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  const prescriptions = await PrescriptionService.getPrescriptionsByUserId(userId);
  res.status(200).json(prescriptions);
};

export const getPrescriptionsByDoctorAndUser = async (req: Request, res: Response) => {
  try {
    const docId = parseInt(req.params.docId);
    const userId = parseInt(req.params.userId);

    if (isNaN(docId) || isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID or user ID"
      });
    }

    const prescriptions = await PrescriptionService.getPrescriptionsByDoctorAndUser(docId, userId);
    
    res.status(200).json({
      success: true,
      message: `Prescriptions for user ${userId} by doctor ${docId} retrieved successfully`,
      data: prescriptions,
      count: prescriptions.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve prescriptions",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// NEW: Get all prescriptions by a specific doctor
export const getPrescriptionsByDoctor = async (req: Request, res: Response) => {
  try {
    const docId = parseInt(req.params.docId);

    if (isNaN(docId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID"
      });
    }

    const prescriptions = await PrescriptionService.getPrescriptionsByDoctor(docId);
    
    res.status(200).json({
      success: true,
      message: `All prescriptions by doctor ${docId} retrieved successfully`,
      data: prescriptions,
      count: prescriptions.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve prescriptions",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};
