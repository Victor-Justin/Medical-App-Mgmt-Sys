import express from "express";
import userRoutes from "./Users/user.router";       
import doctorRoutes from "./Doctors/doctors.router";
import appointmentRoutes from "./Appointments/appointments.router";   
import cors from "cors";
import paymentRoutes from "./Payments/payments.router";
import prescriptionRoutes from "./Prescriptions/prescription.router";
import complaintRoutes from "./Complaints/complaints.router";
import user from "./Auth/auth.router";
import analyticsRoutes from "./Analytics/analytics.router";

const initializeApp = () => {
  const app = express();

  app.use(express.json());

  app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );

  //routes
  user(app);
  userRoutes(app);
  doctorRoutes(app);
  appointmentRoutes(app);
  paymentRoutes(app);
  prescriptionRoutes(app);
  complaintRoutes(app);
  analyticsRoutes(app);

  return app;
};

const app = initializeApp();
export default app;
