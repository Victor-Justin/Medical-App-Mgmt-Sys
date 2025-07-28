import { Express } from "express";
import {
  createPrescription,
  getAllPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
  getPrescriptionsByUserId,
  getPrescriptionsByDoctor,
  getPrescriptionsByDoctorAndUser,
} from "./prescription.controller";

const prescriptionRoutes = (app: Express) => {
  app.route("/prescriptions").post(async (req, res, next) => {
    try {
      await createPrescription(req, res);
    } catch (err) {
      next(err);
    }
  });

  app.route("/prescriptions").get(async (req, res, next) => {
    try {
      await getAllPrescriptions(req, res);
    } catch (err) {
      next(err);
    }
  });

  app.route("/prescriptions/:id").get(async (req, res, next) => {
    try {
      await getPrescriptionById(req, res);
    } catch (err) {
      next(err);
    }
  });

  app.route("/prescriptions/:id").patch(async (req, res, next) => {
    try {
      await updatePrescription(req, res);
    } catch (err) {
      next(err);
    }
  });

  app.route("/prescriptions/:id").delete(async (req, res, next) => {
    try {
      await deletePrescription(req, res);
    } catch (err) {
      next(err);
    }
  });

    app.route("/prescriptions/user/:userId").get(async (req, res, next) => {
    try {
      await getPrescriptionsByUserId(req, res);
    } catch (err) {
      next(err);
    }
  });

  // NEW: Get all prescriptions by a specific doctor for a specific user
  app.route("/prescriptions/doctor/:docId/user/:userId").get(async (req, res, next) => {
    try {
      await getPrescriptionsByDoctorAndUser(req, res);
    } catch (err) {
      next(err);
    }
  });

  // NEW: Get all prescriptions by a specific doctor
  app.route("/prescriptions/doctor/:docId").get(async (req, res, next) => {
    try {
      await getPrescriptionsByDoctor(req, res);
    } catch (err) {
      next(err);
    }
  });

};

export default prescriptionRoutes;
