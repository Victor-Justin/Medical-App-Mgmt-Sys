import request from "supertest";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import {
  ComplaintsTable,
  UsersTable,
  DoctorsTable,
  AppointmentsTable,
} from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";

let userId: number;
let doctorId: number;
let appointmentId: number;
let complaintId: number;

const testUser = {
  fName: "ComplaintTestUser",
  lName: "Patient",
  email: "complainttestuser@example.com",
  password: "Password123!",
  contactNo: "254710000001",
  role: "patient" as const,
};

const testDoctor = {
  fName: "TestComplaintDoc",
  lName: "Doctor",
  email: "complainttestdoctor@example.com",
  specialization: "General",
  contactNo: "254720000001",
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

const testComplaint = {
  subject: "Appointment Scheduling Issue",
  description: "I had trouble scheduling my appointment and need assistance.",
  status: "In Progress" as const,
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

  if (complaintId) {
    await db.delete(ComplaintsTable).where(eq(ComplaintsTable.compId, complaintId));
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

describe("Complaint API Integration Tests", () => {

  it("Should create a complaint with proper timestamps", async () => {
    const res = await request(app)
      .post("/complaints")
      .send({
        ...testComplaint,
        userId,
        apId: appointmentId,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty("compId");
    expect(res.body[0]).toHaveProperty("userId", userId);
    expect(res.body[0]).toHaveProperty("apId", appointmentId);
    expect(res.body[0]).toHaveProperty("subject", testComplaint.subject);
    expect(res.body[0]).toHaveProperty("description", testComplaint.description);
    expect(res.body[0]).toHaveProperty("status", "In Progress");
    expect(res.body[0]).toHaveProperty("createdOn");
    expect(res.body[0]).toHaveProperty("updatedOn");
    
   
    expect(new Date(res.body[0].createdOn)).toBeInstanceOf(Date);
    expect(new Date(res.body[0].updatedOn)).toBeInstanceOf(Date);
    
    complaintId = res.body[0].compId;
  });

  it("Should get all complaints", async () => {
    const res = await request(app).get("/complaints");

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    
    const complaint = res.body.find((c: any) => c.compId === complaintId);
    expect(complaint).toBeDefined();
    expect(complaint).toHaveProperty("subject", testComplaint.subject);
    expect(complaint).toHaveProperty("description", testComplaint.description);
  });

it("Should get complaint by id with joined data", async () => {
  const res = await request(app).get(`/complaints/${complaintId}`);

  expect(res.statusCode).toBe(200);

 
  expect(res.body).toHaveProperty("complaints");
  expect(res.body.complaints).toHaveProperty("compId", complaintId);
  expect(res.body.complaints).toHaveProperty("userId", userId);
  expect(res.body.complaints).toHaveProperty("apId", appointmentId);
  expect(res.body.complaints).toHaveProperty("subject", testComplaint.subject);

  
  expect(res.body).toHaveProperty("users");
  expect(res.body.users).toHaveProperty("userId", userId);
  expect(res.body.users).toHaveProperty("fName", testUser.fName);
  expect(res.body.users).toHaveProperty("email", testUser.email);

  
  expect(res.body).toHaveProperty("appointments");
  expect(res.body.appointments).toHaveProperty("apId", appointmentId);
  expect(res.body.appointments).toHaveProperty("apDate", testAppointment.apDate);
});


  it("Should update a complaint with preserved createdOn timestamp", async () => {
 
    const originalRes = await request(app).get(`/complaints/${complaintId}`);
    const originalCreatedOn = originalRes.body.complaints.createdOn;


    const updateData = {
      subject: "Updated Appointment Scheduling Issue",
      description: "Updated description with more details about the scheduling problem.",
      status: "Resolved" as const,
    };

    const res = await request(app)
      .patch(`/complaints/${complaintId}`)
      .send(updateData);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty("compId", complaintId);
    expect(res.body[0]).toHaveProperty("subject", updateData.subject);
    expect(res.body[0]).toHaveProperty("description", updateData.description);
    expect(res.body[0]).toHaveProperty("status", "Resolved");
    
    expect(res.body[0]).toHaveProperty("createdOn", originalCreatedOn);
    expect(res.body[0]).toHaveProperty("updatedOn");
    expect(new Date(res.body[0].updatedOn)).toBeInstanceOf(Date);
    
  
    expect(res.body[0].updatedOn).not.toBe(originalCreatedOn);
  });

  it("Should update complaint status only", async () => {
    const res = await request(app)
      .patch(`/complaints/${complaintId}`)
      .send({
        status: "Closed",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty("compId", complaintId);
    expect(res.body[0]).toHaveProperty("status", "Closed");
  });

  it("Should delete a complaint", async () => {
    const res = await request(app).delete(`/complaints/${complaintId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty("compId", complaintId);

    
    const deletedComplaint = await db.query.ComplaintsTable.findFirst({
      where: eq(ComplaintsTable.compId, complaintId),
    });
    expect(deletedComplaint).toBeUndefined();

    complaintId = 0; 
  });

  // NEGATIVE TEST CASES

  it("Should return 404 for non-existent complaint", async () => {
    const res = await request(app).get("/complaints/999999");
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "Complaint not found");
  });

  it("Should return 404 when updating non-existent complaint", async () => {
    const res = await request(app)
      .patch("/complaints/999999")
      .send({
        subject: "Updated Subject",
      });
    
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "Complaint not found");
  });

  it("Should handle invalid complaint ID format", async () => {
    const res = await request(app).get("/complaints/invalid-id");
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  it("Should handle missing required fields when creating complaint", async () => {
    const res = await request(app)
      .post("/complaints")
      .send({
        userId,
        apId: appointmentId,
      
      });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  it("Should handle invalid userId reference", async () => {
    const res = await request(app)
      .post("/complaints")
      .send({
        ...testComplaint,
        userId: 999999,
        apId: appointmentId,
      });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  it("Should handle invalid apId reference", async () => {
    const res = await request(app)
      .post("/complaints")
      .send({
        ...testComplaint,
        userId,
        apId: 999999,
      });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  it("Should handle invalid status value", async () => {

    const createRes = await request(app)
      .post("/complaints")
      .send({
        ...testComplaint,
        userId,
        apId: appointmentId,
      });

    const tempComplaintId = createRes.body[0].compId;

    const res = await request(app)
      .patch(`/complaints/${tempComplaintId}`)
      .send({
        status: "Invalid Status", 
      });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);

   
    await db.delete(ComplaintsTable).where(eq(ComplaintsTable.compId, tempComplaintId));
  });

  it("Should handle empty request body for update", async () => {
  
    const createRes = await request(app)
      .post("/complaints")
      .send({
        ...testComplaint,
        userId,
        apId: appointmentId,
      });

    const tempComplaintId = createRes.body[0].compId;

    const res = await request(app)
      .patch(`/complaints/${tempComplaintId}`)
      .send({});

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty("compId", tempComplaintId);

    await db.delete(ComplaintsTable).where(eq(ComplaintsTable.compId, tempComplaintId));
  });

});