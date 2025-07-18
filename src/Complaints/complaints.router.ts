import { Express } from "express";
import {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
} from "./complaints.controller";

const complaintRoutes = (app: Express) => {
  app.route("/complaints").post(async (req, res, next) => {
    try {
      await createComplaint(req, res);
    } catch (err) {
      next(err);
    }
  });

  app.route("/complaints").get(async (req, res, next) => {
    try {
      await getAllComplaints(req, res);
    } catch (err) {
      next(err);
    }
  });

  app.route("/complaints/:id").get(async (req, res, next) => {
    try {
      await getComplaintById(req, res);
    } catch (err) {
      next(err);
    }
  });

  app.route("/complaints/:id").patch(async (req, res, next) => {
    try {
      await updateComplaint(req, res);
    } catch (err) {
      next(err);
    }
  });

  app.route("/complaints/:id").delete(async (req, res, next) => {
    try {
      await deleteComplaint(req, res);
    } catch (err) {
      next(err);
    }
  });
};

export default complaintRoutes;
