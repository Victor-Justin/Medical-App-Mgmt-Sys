import request from "supertest";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import {
  PaymentsTable,
  AppointmentsTable,
  DoctorsTable,
  UsersTable,
} from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";

let userId: number;
let doctorId: number;
let appointmentId: number;
let paymentId: number;

const testUser = {
  fName: "PaymentTestUser",
  lName: "Patient",
  email: "paymenttestuser@example.com",
  password: "Password123!",
  contactNo: "254710000001",
  role: "patient" as const,
};

const testDoctor = {
  fName: "PaymentTestDoctor",
  lName: "Doctor",
  email: "paymenttestdoctor@example.com",
  specialization: "Cardiology",
  contactNo: "254720000001",
  availableDays: "Monday,Tuesday",
  createdOn: new Date(),
  updatedOn: new Date(),
};

const testAppointment = {
  apDate: "2025-07-12",
  startTime: "14:00:00",
  endTime: "14:30:00",
  amount: "3500.00",
};

const testPayment = {
  transId: 1111111,
  amount: "3500.00",
  payStatus: "paid" as const,
  payDate: "2025-07-12",
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

  const appointmentRes = await db.insert(AppointmentsTable).values({
    ...testAppointment,
    userId,
    docId: doctorId,
    createdOn: new Date(),
    updatedOn: new Date(),
  }).returning();
  appointmentId = appointmentRes[0].apId;
});

afterAll(async () => {
  if (paymentId) {
    await db.delete(PaymentsTable).where(eq(PaymentsTable.payId, paymentId));
  }

  if (appointmentId) {
    await db.delete(AppointmentsTable).where(eq(AppointmentsTable.apId, appointmentId));
  }

  if (doctorId) {
    await db.delete(DoctorsTable).where(eq(DoctorsTable.docId, doctorId));
  }

  if (userId) {
    await db.delete(UsersTable).where(eq(UsersTable.userId, userId));
  }

  await db.$client.end();
});

describe("Payment API Integration Tests", () => {
  it("Should create a payment with proper timestamps", async () => {
    const res = await request(app)
      .post("/payments")
      .send({
        ...testPayment,
        apId: appointmentId,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body[0]).toHaveProperty("payId");
    expect(res.body[0]).toHaveProperty("apId", appointmentId);
    expect(res.body[0]).toHaveProperty("amount", testPayment.amount);
    expect(res.body[0]).toHaveProperty("payStatus", "paid");
    expect(res.body[0]).toHaveProperty("payDate", testPayment.payDate);
    expect(res.body[0]).toHaveProperty("createdOn");
    expect(res.body[0]).toHaveProperty("updatedOn");

    paymentId = res.body[0].payId;
  });

  it("Should get all payments", async () => {
    const res = await request(app).get("/payments");

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);

    const payment = res.body.find((p: any) => p.payments.payId === paymentId);
    expect(payment).toBeDefined();
    expect(payment.payments).toHaveProperty("amount", testPayment.amount);
  });

  it("Should get payment by id with appointment joined", async () => {
    const res = await request(app).get(`/payments/${paymentId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("payments");
    expect(res.body.payments).toHaveProperty("payId", paymentId);
    expect(res.body.payments).toHaveProperty("apId", appointmentId);
    expect(res.body).toHaveProperty("appointments");
    expect(res.body.appointments).toHaveProperty("apId", appointmentId);
    expect(res.body.appointments).toHaveProperty("apDate", testAppointment.apDate);
  });

  it("Should update a payment and preserve createdOn", async () => {
    const originalRes = await request(app).get(`/payments/${paymentId}`);
    const originalCreatedOn = originalRes.body.payments.createdOn;

    const updateData = {
      amount: "4000.00",
      payStatus: "unpaid" as const,
      payDate: "2025-07-13",
    };

    const res = await request(app)
      .patch(`/payments/${paymentId}`)
      .send(updateData);

    expect(res.statusCode).toBe(200);
    expect(res.body[0]).toHaveProperty("payId", paymentId);
    expect(res.body[0]).toHaveProperty("amount", updateData.amount);
    expect(res.body[0]).toHaveProperty("payStatus", "unpaid");
    expect(res.body[0]).toHaveProperty("payDate", updateData.payDate);
    expect(res.body[0]).toHaveProperty("createdOn", originalCreatedOn);
    expect(res.body[0].updatedOn).not.toBe(originalCreatedOn);
  });

  it("Should delete a payment", async () => {
    const res = await request(app).delete(`/payments/${paymentId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body[0]).toHaveProperty("payId", paymentId);

    const deletedPayment = await db.query.PaymentsTable.findFirst({
      where: eq(PaymentsTable.payId, paymentId),
    });
    expect(deletedPayment).toBeUndefined();

    paymentId = 0;
  });

  // Negative test cases
  it("Should return 404 for non-existent payment", async () => {
    const res = await request(app).get("/payments/999999");
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "Payment not found");
  });

  it("Should return 404 when updating non-existent payment", async () => {
    const res = await request(app)
      .patch("/payments/999999")
      .send({
        amount: "5000.00",
      });
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "Payment not found");
  });

  it("Should handle invalid payment ID format", async () => {
    const res = await request(app).get("/payments/invalid-id");
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  it("Should handle missing required fields when creating payment", async () => {
    const res = await request(app).post("/payments").send({
      apId: appointmentId,
    });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  it("Should handle invalid apId reference", async () => {
    const res = await request(app).post("/payments").send({
      ...testPayment,
      apId: 999999,
    });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
});
