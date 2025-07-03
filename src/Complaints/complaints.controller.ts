import { Request, Response } from "express";
import * as ComplaintService from "./complaints.service";


export const createComplaint = async (req: Request, res: Response) => {
  const now = new Date();

  const complaintData = {
    ...req.body,
    createdOn: now,
    updatedOn: now,
  };

  const newComplaint = await ComplaintService.createComplaint(complaintData);
  res.status(201).json(newComplaint);
};


export const getAllComplaints = async (req: Request, res: Response) => {
  const complaints = await ComplaintService.getAllComplaints();
  res.json(complaints);
};


export const getComplaintById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const complaint = await ComplaintService.getComplaintById(Number(id));

  if (!complaint) {
    return res.status(404).json({ message: "Complaint not found" });
  }

  res.json(complaint);
};


export const updateComplaint = async (req: Request, res: Response) => {
  const { id } = req.params;

  const existingComplaint = await ComplaintService.getComplaintById(Number(id));
  if (!existingComplaint) {
    return res.status(404).json({ message: "Complaint not found" });
  }

  const complaintData = {
    ...req.body,
    createdOn: existingComplaint.createdOn,
    updatedOn: new Date(),
  };

  const updatedComplaint = await ComplaintService.updateComplaint(Number(id), complaintData);
  res.json(updatedComplaint);
};


export const deleteComplaint = async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedComplaint = await ComplaintService.deleteComplaint(Number(id));
  res.json(deletedComplaint);
};
