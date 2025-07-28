import { Request, Response } from "express";
import * as AnalyticsService from "./analytics.service";

export const getUserRoleBreakdown = async (req: Request, res: Response) => {
  const stats = await AnalyticsService.getUserBreakdownByRole();
  res.json(stats);
};

export const getAppointmentsStats = async (req: Request, res: Response) => {
  const stats = await AnalyticsService.getAppointmentsCountByStatus();
  res.json(stats);
};

export const getTotalPrescriptions = async (req: Request, res: Response) => {
  const result = await AnalyticsService.getTotalPrescriptions();
  res.json(result);
};

export const getTotalComplaints = async (req: Request, res: Response) => {
  const result = await AnalyticsService.getTotalComplaints();
  res.json(result);
};

export const getTotalPayments = async (req: Request, res: Response) => {
  const result = await AnalyticsService.getTotalPayments();
  res.json(result);
};

export const getUserAnalytics = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  if (isNaN(userId))  res.status(400).json({ message: "Invalid user ID" });

  const result = await AnalyticsService.getUserAnalytics(userId);
  res.json(result);
};

export const getDoctorAnalytics = async (req: Request, res: Response) => {
  const docId = Number(req.params.docId);
  if (isNaN(docId))  res.status(400).json({ message: "Invalid doctor ID" });

  const result = await AnalyticsService.getDoctorAnalytics(docId);
  res.json(result);
};

