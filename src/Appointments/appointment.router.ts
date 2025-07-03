import { Express } from "express";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from "./appointments.controller";

const appointmentRoutes = (app: Express) => {

  app.route("/appointments").post(async (req, res, next) => {
    try {
      await createAppointment(req, res);
    } catch (error) {
      next(error);
    }
  });


  app.route("/appointments").get(async (req, res, next) => {
    try {
      await getAllAppointments(req, res);
    } catch (error) {
      next(error);
    }
  });


  app.route("/appointments/:id").get(async (req, res, next) => {
    try {
      await getAppointmentById(req, res);
    } catch (error) {
      next(error);
    }
  });


  app.route("/appointments/:id").patch(async (req, res, next) => {
    try {
      await updateAppointment(req, res);
    } catch (error) {
      next(error);
    }
  });


  app.route("/appointments/:id").delete(async (req, res, next) => {
    try {
      await deleteAppointment(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default appointmentRoutes;
