import { Express } from "express";
import {
  getUserRoleBreakdown,
  getAppointmentsStats,
  getTotalPrescriptions,
  getTotalComplaints,
  getTotalPayments,
  getUserAnalytics,
  getDoctorAnalytics,
} from "./analytics.controller";

const analyticsRoutes = (app: Express) => {
  app.get("/analytics/users/roles", getUserRoleBreakdown);
  app.get("/analytics/appointments/status", getAppointmentsStats);
  app.get("/analytics/prescriptions", getTotalPrescriptions);
  app.get("/analytics/complaints", getTotalComplaints);
  app.get("/analytics/payments", getTotalPayments);
  app.get("/analytics/user/:userId", getUserAnalytics);
  app.get("/analytics/doctor/:docId", getDoctorAnalytics);
};

export default analyticsRoutes;
