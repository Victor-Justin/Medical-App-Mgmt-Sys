import request from "supertest";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import { DoctorsTable } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";

let doctorId: number;

const testDoctor = {
  fName: "Dr. Victor",
  lName: "Justin",
  email: "dr.victor@testmail.com",
  specialization: "Cardiology",
  contactNo: "254700123456",
  availableDays: "Monday-Friday"
};

beforeAll(async () => {

});

afterAll(async () => {
  if (doctorId) {
    await db.delete(DoctorsTable).where(eq(DoctorsTable.docId, doctorId));
  }
  await db.$client.end();
});

describe("Doctor API Integration Tests", () => {
  it("Should create a doctor", async () => {
    const res = await request(app).post("/doctors").send(testDoctor);

    expect(res.statusCode).toBe(201);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body[0]).toHaveProperty("docId");
    expect(res.body[0]).toHaveProperty("fName", testDoctor.fName);
    expect(res.body[0]).toHaveProperty("lName", testDoctor.lName);
    expect(res.body[0]).toHaveProperty("email", testDoctor.email);
    expect(res.body[0]).toHaveProperty("specialization", testDoctor.specialization);
    expect(res.body[0]).toHaveProperty("createdOn");
    expect(res.body[0]).toHaveProperty("updatedOn");

    doctorId = res.body[0].docId;
  });

  it("Should get all doctors", async () => {
    const res = await request(app).get("/doctors");

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);

    const doctor = res.body.find((d: any) => d.docId === doctorId);
    expect(doctor).toBeDefined();
    expect(doctor).toHaveProperty("email", testDoctor.email);
  });

  it("Should get a doctor by ID", async () => {
    const res = await request(app).get(`/doctors/${doctorId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("docId", doctorId);
    expect(res.body).toHaveProperty("fName", testDoctor.fName);
    expect(res.body).toHaveProperty("lName", testDoctor.lName);
    expect(res.body).toHaveProperty("email", testDoctor.email);
    expect(res.body).toHaveProperty("specialization", testDoctor.specialization);
  });

  it("Should update a doctor", async () => {
    const updatedDoctor = {
      fName: "Dr. Victor Updated",
      specialization: "Neurology"
    };

    const res = await request(app)
      .patch(`/doctors/${doctorId}`)
      .send(updatedDoctor);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("docId", doctorId);
    expect(res.body).toHaveProperty("fName", updatedDoctor.fName);
    expect(res.body).toHaveProperty("specialization", updatedDoctor.specialization);
  });

  it("Should delete a doctor", async () => {
    const res = await request(app).delete(`/doctors/${doctorId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("docId", doctorId);

    const deletedDoctor = await db.query.DoctorsTable.findFirst({
      where: eq(DoctorsTable.docId, doctorId)
    });
    expect(deletedDoctor).toBeUndefined();

    doctorId = 0;
  });

  // NEGATIVE CASES

  it("Should return 404 for non-existent doctor", async () => {
    const res = await request(app).get("/doctors/99999");
    expect(res.statusCode).toBe(404);
  });

  it("Should handle invalid doctor ID format", async () => {
    const res = await request(app).get("/doctors/invalid-id");
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
});
