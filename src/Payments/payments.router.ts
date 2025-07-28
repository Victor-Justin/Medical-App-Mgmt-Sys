import { Express } from "express";
import {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  getPaymentsByUserId
} from "./payments.controller";

const paymentRoutes = (app: Express) => {
  app.route("/payments").post(async (req, res, next) => {
    try {
      await createPayment(req, res);
    } catch (err) {
      next(err);
    }
  });

  app.route("/payments").get(async (req, res, next) => {
    try {
      await getAllPayments(req, res);
    } catch (err) {
      next(err);
    }
  });

  app.route("/payments/:id").get(async (req, res, next) => {
    try {
      await getPaymentById(req, res);
    } catch (err) {
      next(err);
    }
  });

  app.route("/payments/:id").patch(async (req, res, next) => {
    try {
      await updatePayment(req, res);
    } catch (err) {
      next(err);
    }
  });

  app.route("/payments/:id").delete(async (req, res, next) => {
    try {
      await deletePayment(req, res);
    } catch (err) {
      next(err);
    }
  });


app.route("/payments/user/:userId").get(async (req, res, next) => {
  try {
    await getPaymentsByUserId(req, res);
  } catch (err) {
    next(err);
  }
});
};

export default paymentRoutes;
