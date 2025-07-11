import request from "supertest";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import {
  AppointmentsTable,
  UsersTable,
  DoctorsTable,
  PaymentsTable,
} from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";

let userId: number;
let doctorId: number;
let appointmentId: number;

const testUser = {
  fName: "AppointmentTestUser",
  lName: "Patient",
  email: "apptestuser@example.com",
  password: "Password123!",
  contactNo: "254710000000",
  role: "patient" as const,
};

const testDoctor = {
  fName: "TestDoc",
  lName: "Doctor",
  email: "apptestdoctor@example.com",
  specialization: "General",
  contactNo: "254720000000",
  availableDays: "Monday,Tuesday",
  createdOn: new Date(),
  updatedOn: new Date(),
};

const testAppointment = {
  apDate: "2025-07-12",
  startTime: "10:00:00",
  endTime: "10:30:00",
  amount: "2500.00",
};

beforeAll(async () => {
  
  const userRes = await db.insert(UsersTable).values({
    ...testUser,
    createdOn: new Date(),
    updatedOn: new Date(),
  }).returning();
  userId = userRes[0].userId;

 
  const doctorRes = await db.insert(DoctorsTable).values({
    ...testDoctor,
  }).returning();
  doctorId = doctorRes[0].docId;
});

afterAll(async () => {
  
  if (appointmentId) {
    await db.delete(AppointmentsTable).where(eq(AppointmentsTable.apId, appointmentId));
    await db.delete(PaymentsTable).where(eq(PaymentsTable.apId, appointmentId));
  }

 
  if (doctorId) {
    await db.delete(DoctorsTable).where(eq(DoctorsTable.docId, doctorId));
  }


  if (userId) {
    await db.delete(UsersTable).where(eq(UsersTable.userId, userId));
  }

  await db.$client.end();
});

describe("Appointment API Integration Tests", () => {

  it("Should create an appointment and auto-create payment", async () => {
    const res = await request(app)
      .post("/appointments")
      .send({
        ...testAppointment,
        userId,
        docId: doctorId,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("apId");
    expect(res.body).toHaveProperty("userId", userId);
    expect(res.body).toHaveProperty("docId", doctorId);
    expect(res.body).toHaveProperty("apDate", testAppointment.apDate);
    appointmentId = res.body.apId;

   
    const payment = await db.query.PaymentsTable.findFirst({
      where: eq(PaymentsTable.apId, appointmentId),
    });
    expect(payment).toBeDefined();
    expect(payment?.amount).toBe(testAppointment.amount);
    expect(payment?.payStatus).toBe("unpaid");
  });

  it("Should get all appointments", async () => {
    const res = await request(app).get("/appointments");

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    const appointment = res.body.find((a: any) => a.appointments.apId === appointmentId);
    expect(appointment).toBeDefined();
  });

  it("Should get appointment by id", async () => {
    const res = await request(app).get(`/appointments/${appointmentId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("appointments.apId", appointmentId);
    expect(res.body).toHaveProperty("appointments.userId", userId);
    expect(res.body).toHaveProperty("appointments.docId", doctorId);
  });

  it("Should update an appointment", async () => {
    const res = await request(app)
      .patch(`/appointments/${appointmentId}`)
      .send({
        apStatus: "confirmed",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body[0]).toHaveProperty("apId", appointmentId);
    expect(res.body[0]).toHaveProperty("apStatus", "confirmed");
  });

  it("Should delete an appointment", async () => {
    const res = await request(app).delete(`/appointments/${appointmentId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body[0]).toHaveProperty("apId", appointmentId);

   
    const deletedAp = await db.query.AppointmentsTable.findFirst({
      where: eq(AppointmentsTable.apId, appointmentId),
    });
    expect(deletedAp).toBeUndefined();

    appointmentId = 0;
  });

  // NEGATIVE CASES

  it("Should return 404 for non-existent appointment", async () => {
    const res = await request(app).get("/appointments/999999");
    expect(res.statusCode).toBe(404);
  });

  it("Should handle invalid appointment ID format", async () => {
    const res = await request(app).get("/appointments/invalid-id");
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

});

