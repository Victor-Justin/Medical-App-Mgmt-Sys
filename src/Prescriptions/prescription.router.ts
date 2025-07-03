import { Express } from "express";
import {
  createPrescription,
  getAllPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
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
};

export default prescriptionRoutes;
