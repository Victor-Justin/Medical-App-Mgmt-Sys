import request from "supertest";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import {
  PrescriptionsTable,
  UsersTable,
  DoctorsTable,
  AppointmentsTable,
} from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";

let userId: number;
let doctorId: number;
let appointmentId: number;
let prescriptionId: number;

const testUser = {
  fName: "PrescriptionTestUser",
  lName: "Patient",
  email: "prescriptiontestuser@example.com",
  password: "Password123!",
  contactNo: "254710000003",
  role: "patient" as const,
};

const testDoctor = {
  fName: "PrescriptionDoc",
  lName: "Doctor",
  email: "prescriptiondoctor@example.com",
  specialization: "General",
  contactNo: "254720000003",
  availableDays: "Monday,Tuesday",
  createdOn: new Date(),
  updatedOn: new Date(),
};

const testAppointment = {
  apDate: "2025-07-12",
  startTime: "11:00:00",
  endTime: "11:30:00",
  amount: "2500.00",
};

const testPrescription = {
  notes: "Take 2 tablets daily after meals",
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
  if (prescriptionId) {
    await db.delete(PrescriptionsTable).where(eq(PrescriptionsTable.prescId, prescriptionId));
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

describe("Prescription API Integration Tests", () => {
  it("Should create a prescription with timestamps", async () => {
    const res = await request(app)
      .post("/prescriptions")
      .send({
        ...testPrescription,
        userId,
        docId: doctorId,
        apId: appointmentId,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty("prescId");
    expect(res.body[0]).toHaveProperty("notes", testPrescription.notes);
    expect(res.body[0]).toHaveProperty("userId", userId);
    expect(res.body[0]).toHaveProperty("docId", doctorId);
    expect(res.body[0]).toHaveProperty("apId", appointmentId);
    expect(res.body[0]).toHaveProperty("createdOn");
    expect(res.body[0]).toHaveProperty("updatedOn");

    prescriptionId = res.body[0].prescId;
  });

  it("Should get all prescriptions", async () => {
    const res = await request(app).get("/prescriptions");
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    const presc = res.body.find((p: any) => p.prescriptions.prescId === prescriptionId);
    expect(presc).toBeDefined();
    expect(presc.prescriptions.notes).toBe(testPrescription.notes);
  });

  it("Should get prescription by ID", async () => {
    const res = await request(app).get(`/prescriptions/${prescriptionId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("prescriptions");
    expect(res.body.prescriptions.prescId).toBe(prescriptionId);
  });

  it("Should update a prescription", async () => {
    const original = await request(app).get(`/prescriptions/${prescriptionId}`);
    const originalCreatedOn = original.body.prescriptions.createdOn;

    const updateRes = await request(app)
      .patch(`/prescriptions/${prescriptionId}`)
      .send({
        notes: "Updated: Take 1 tablet after meals",
      });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body[0].notes).toBe("Updated: Take 1 tablet after meals");
    expect(updateRes.body[0].createdOn).toBe(originalCreatedOn);
  });

  it("Should delete a prescription", async () => {
    const res = await request(app).delete(`/prescriptions/${prescriptionId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body[0].prescId).toBe(prescriptionId);

    const check = await db.query.PrescriptionsTable.findFirst({
      where: eq(PrescriptionsTable.prescId, prescriptionId),
    });
    expect(check).toBeUndefined();
    prescriptionId = 0;
  });

  it("Should return 404 for non-existent prescription", async () => {
    const res = await request(app).get("/prescriptions/999999");
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "Prescription not found");
  });
});

it("Should return 404 for non-existent prescription", async () => {
    const res = await request(app).get("/prescriptions/999999");
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "Prescription not found");
  });

  it("Should handle invalid prescription ID format", async () => {
    const res = await request(app).get("/prescriptions/invalid-id");
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  it("Should fail to create prescription with missing fields", async () => {
    const res = await request(app).post("/prescriptions").send({
      notes: "Missing references"
    });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  it("Should fail to create prescription with invalid userId", async () => {
    const res = await request(app).post("/prescriptions").send({
      notes: "Bad user ref",
      userId: 999999,
      docId: doctorId,
      apId: appointmentId,
    });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  it("Should fail to create prescription with invalid docId", async () => {
    const res = await request(app).post("/prescriptions").send({
      notes: "Bad doctor ref",
      userId: userId,
      docId: 999999,
      apId: appointmentId,
    });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  it("Should fail to create prescription with invalid apId", async () => {
    const res = await request(app).post("/prescriptions").send({
      notes: "Bad appointment ref",
      userId: userId,
      docId: doctorId,
      apId: 999999,
    });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  it("Should handle empty request body for update", async () => {
    const createRes = await request(app).post("/prescriptions").send({
      ...testPrescription,
      userId,
      docId: doctorId,
      apId: appointmentId,
    });

    const tempPrescriptionId = createRes.body[0].prescId;

    const res = await request(app)
      .patch(`/prescriptions/${tempPrescriptionId}`)
      .send({});

    expect(res.statusCode).toBe(200);
    expect(res.body[0]).toHaveProperty("prescId", tempPrescriptionId);

    await db.delete(PrescriptionsTable).where(eq(PrescriptionsTable.prescId, tempPrescriptionId));
  });

  it("Should return 404 when updating non-existent prescription", async () => {
    const res = await request(app)
      .patch("/prescriptions/999999")
      .send({
        notes: "Non-existent update",
      });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "Prescription not found");
  });
