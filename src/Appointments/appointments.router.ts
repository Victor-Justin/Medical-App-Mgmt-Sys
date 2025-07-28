import { Express } from "express";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByUserId,
  cancelAppointment,
  confirmAppointment,
  getAppointmentsByDoctorId,
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

    app.route("/appointments/user/:userId").get(async (req, res, next) => {
    try {
      await getAppointmentsByUserId(req, res);
    } catch (error) {
      next(error);
    }
  });

app.route("/appointments/doctor/:docId").get(async (req, res, next) => {
  try {
    await getAppointmentsByDoctorId(req, res);
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

    app.route("/appointments/:id/cancel").patch(async (req, res, next) => {
    try {
      await cancelAppointment(req, res);
    } catch (error) {
      next(error);
    }
  });

      app.route("/appointments/:id/confirm").patch(async (req, res, next) => {
    try {
      await confirmAppointment(req, res);
    } catch (error) {
      next(error);
    }
  });

  
};

export default appointmentRoutes;
