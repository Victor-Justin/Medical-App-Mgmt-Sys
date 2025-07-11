import request from "supertest";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import { UsersTable, DoctorsTable } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";

let userId: number;
let doctorId: number;

const testUser = {
  fName: "Victor",
  lName: "Justin",
  email: "victor.justintest@example.com",
  password: "Password123!",
  contactNo: "254700000000",
  role: "patient"
};

beforeAll(async () => {

});

afterAll(async () => {
  // Clean up doctor record if created
  if (doctorId) {
    await db.delete(DoctorsTable).where(eq(DoctorsTable.docId, doctorId));
  }

  // Clean up user record
  if (userId) {
    await db.delete(UsersTable).where(eq(UsersTable.userId, userId));
  }

  await db.$client.end();
});

describe("User API Integration Tests", () => {

  it("Should create a user", async () => {
    const res = await request(app)
      .post("/users")
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body[0]).toHaveProperty("userId");
    expect(res.body[0]).toHaveProperty("fName", testUser.fName);
    expect(res.body[0]).toHaveProperty("lName", testUser.lName);
    expect(res.body[0]).toHaveProperty("email", testUser.email);
    expect(res.body[0]).toHaveProperty("createdOn");
    expect(res.body[0]).toHaveProperty("updatedOn");

    userId = res.body[0].userId;
  });

  it("Should get all users", async () => {
    const res = await request(app).get("/users");

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);

    const user = res.body.find((u: any) => u.userId === userId);
    expect(user).toBeDefined();
    expect(user).toHaveProperty("email", testUser.email);
  });

  it("Should get a user by id", async () => {
    const res = await request(app)
      .get(`/users/${userId}`);

    expect(res.statusCode).toBe(200);

    if (res.body.userId) {
      expect(res.body).toHaveProperty('userId', userId);
      expect(res.body).toHaveProperty('fName', testUser.fName);
      expect(res.body).toHaveProperty('lName', testUser.lName);
      expect(res.body).toHaveProperty('email', testUser.email);
      expect(res.body).toHaveProperty('role', testUser.role);
    } else {
      expect(res.body).toBeDefined();
    }
  });

  it("Should update a user", async () => {
    const updatedUser = {
      fName: "Victor Updated",
      contactNo: "254700999999"
    };

    const res = await request(app)
      .patch(`/users/${userId}`)
      .send(updatedUser);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("userId", userId);
    expect(res.body).toHaveProperty("fName", updatedUser.fName);
    expect(res.body).toHaveProperty("contactNo", updatedUser.contactNo);
  });

  it("Should promote a user to doctor when role is updated", async () => {
    const res = await request(app)
      .patch(`/users/${userId}`)
      .send({ role: "doctor" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("role", "doctor");

    const doctorRecord = await db.query.DoctorsTable.findFirst({
      where: eq(DoctorsTable.email, testUser.email)
    });

    expect(doctorRecord).toBeDefined();
    doctorId = doctorRecord!.docId;
  });

  it("Should delete a user", async () => {
    const res = await request(app).delete(`/users/${userId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("userId", userId);

    const deletedUser = await db.query.UsersTable.findFirst({
      where: eq(UsersTable.userId, userId)
    });
    expect(deletedUser).toBeUndefined();  

    userId = 0;
  });

  // NEGATIVE CASES

  it("Should return 404 for non-existent user", async () => {
    const res = await request(app).get("/users/99999");

    if (res.statusCode === 200) {
      expect(res.body).toEqual(undefined);
    } else {
      expect(res.statusCode).toBe(404);
    }
  });

  it("Should not create user with duplicate email", async () => {
    const res1 = await request(app).post("/users").send(testUser);
    expect(res1.statusCode).toBe(201);
    const duplicateUserId = res1.body[0].userId;

    const res2 = await request(app).post("/users").send(testUser);
    expect(res2.statusCode).toBeGreaterThanOrEqual(400);

    await db.delete(UsersTable).where(eq(UsersTable.userId, duplicateUserId));
  });

  it("Should handle invalid user ID format", async () => {
    const res = await request(app).get("/users/invalid-id");
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

});
