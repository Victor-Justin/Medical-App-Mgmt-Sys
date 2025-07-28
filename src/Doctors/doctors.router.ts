import { Express } from "express";
import {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  getDoctorByUserId
} from "./doctors.controller";

const doctorRoutes = (app: Express) => {
  // Create a doctor
  app.route("/doctors").post(async (req, res, next) => {
    try {
      await createDoctor(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get all doctors
  app.route("/doctors").get(async (req, res, next) => {
    try {
      await getAllDoctors(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get doctor by ID
  app.route("/doctors/:id").get(async (req, res, next) => {
    try {
      await getDoctorById(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Update doctor by ID
  app.route("/doctors/:id").patch(async (req, res, next) => {
    try {
      await updateDoctor(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Delete doctor by ID
  app.route("/doctors/:id").delete(async (req, res, next) => {
    try {
      await deleteDoctor(req, res);
    } catch (error) {
      next(error);
    }
  });
  
  app.route("/doctors/user/:userId").get(async (req, res, next) => {
    try {
      await getDoctorByUserId(req, res);
    } catch (error) {
      next(error);
    }
  });
};


export default doctorRoutes;
