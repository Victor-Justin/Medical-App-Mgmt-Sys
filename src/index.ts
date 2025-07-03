import express from "express";
import userRoutes from "./Users/user.router";       
import doctorRoutes from "./Doctors/doctors.router";
import appointmentRoutes from "./Appointments/appointment.router";   
import cors from "cors";
import paymentRoutes from "./Payments/payments.router";

const initializeApp = () => {
  const app = express();

  app.use(express.json());

  app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );

  //routes
  userRoutes(app);
  doctorRoutes(app);
  appointmentRoutes(app);
  paymentRoutes(app);

  return app;
};

const app = initializeApp();
export default app;
