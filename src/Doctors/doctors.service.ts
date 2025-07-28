import { and, eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { UsersTable, DoctorsTable, AppointmentsTable, PrescriptionsTable } from "../Drizzle/schema";

// Get all doctors
export const getAllDoctors = () =>
  db.select().from(DoctorsTable);

// Get doctor by ID with appointments and prescriptions
export const getDoctorById = (id: number) =>
  db
    .select()
    .from(DoctorsTable)
    .where(eq(DoctorsTable.docId, id))
    .leftJoin(AppointmentsTable as any, eq(DoctorsTable.docId, AppointmentsTable.docId))
    .leftJoin(PrescriptionsTable as any, eq(DoctorsTable.docId, PrescriptionsTable.docId));

// Create a new doctor
export const createDoctor = (data: any) =>
  db.insert(DoctorsTable).values(data).returning();

// Update a doctor by ID
export const updateDoctor = (id: number, data: any) =>
  db.update(DoctorsTable).set(data).where(eq(DoctorsTable.docId, id)).returning();

// Get doctor by user ID
export const getDoctorByUserId = async (userId: number) => {
  return db.query.DoctorsTable.findFirst({
    where: eq(DoctorsTable.userId, userId),
  });
};


// Delete doctor by ID and change to patient
export const deleteDoctor = async (id: number) => {
  const doctor = await db.query.DoctorsTable.findFirst({
    where: eq(DoctorsTable.docId, id),
  });

  if (!doctor) {
    throw new Error("Doctor not found");
  }
  const deletedDoctor = await db
    .delete(DoctorsTable)
    .where(eq(DoctorsTable.docId, id))
    .returning();

  // Find user with matching email
  const user = await db.query.UsersTable.findFirst({
    where: 
      eq(UsersTable.email, doctor.email),
  });

  if (user) {
    await db
      .update(UsersTable)
      .set({ role: "patient", updatedOn: new Date() })
      .where(eq(UsersTable.userId, user.userId));
  }

  return deletedDoctor[0];
};

