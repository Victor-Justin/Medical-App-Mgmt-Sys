import { eq , and} from "drizzle-orm/sql";
import db from "../Drizzle/db";
import { PrescriptionsTable, AppointmentsTable, DoctorsTable, UsersTable } from "../Drizzle/schema";


export const createPrescription = (data: any) =>
  db.insert(PrescriptionsTable).values(data).returning();


export const getAllPrescriptions = () =>
  db
    .select()
    .from(PrescriptionsTable)
    .leftJoin(AppointmentsTable as any, eq(PrescriptionsTable.apId, AppointmentsTable.apId))
    .leftJoin(DoctorsTable as any, eq(PrescriptionsTable.docId, DoctorsTable.docId))
    .leftJoin(UsersTable as any, eq(PrescriptionsTable.userId, UsersTable.userId));


export const getPrescriptionById = async (id: number) => {
  const result = await db
    .select()
    .from(PrescriptionsTable)
    .where(eq(PrescriptionsTable.prescId, id))
    .leftJoin(AppointmentsTable as any, eq(PrescriptionsTable.apId, AppointmentsTable.apId))
    .leftJoin(DoctorsTable as any, eq(PrescriptionsTable.docId, DoctorsTable.docId))
    .leftJoin(UsersTable as any, eq(PrescriptionsTable.userId, UsersTable.userId));

  return result[0];
};


export const updatePrescription = (id: number, data: any) =>
  db.update(PrescriptionsTable).set(data).where(eq(PrescriptionsTable.prescId, id)).returning();


export const deletePrescription = (id: number) =>
  db.delete(PrescriptionsTable).where(eq(PrescriptionsTable.prescId, id)).returning();

export const getPrescriptionsByUserId = async (userId: number) => {
  return db
    .select()
    .from(PrescriptionsTable)
    .where(eq(PrescriptionsTable.userId, userId))
    .leftJoin(DoctorsTable as any, eq(PrescriptionsTable.docId, DoctorsTable.docId));
};

// NEW: Get all prescriptions by doctor for a specific user
export const getPrescriptionsByDoctorAndUser = async (docId: number, userId: number) => {
  const result = await db
    .select()
    .from(PrescriptionsTable)
    .where(and(
      eq(PrescriptionsTable.docId, docId),
      eq(PrescriptionsTable.userId, userId)
    ))
    .leftJoin(AppointmentsTable as any, eq(PrescriptionsTable.apId, AppointmentsTable.apId))
    .leftJoin(DoctorsTable as any, eq(PrescriptionsTable.docId, DoctorsTable.docId))
    .leftJoin(UsersTable as any, eq(PrescriptionsTable.userId, UsersTable.userId))
    .orderBy(PrescriptionsTable.createdOn);
  return result;
};

// NEW: Get all prescriptions by a specific doctor
export const getPrescriptionsByDoctor = async (docId: number) => {
  const result = await db
    .select()
    .from(PrescriptionsTable)
    .where(eq(PrescriptionsTable.docId, docId))
    .leftJoin(AppointmentsTable as any, eq(PrescriptionsTable.apId, AppointmentsTable.apId))
    .leftJoin(DoctorsTable as any, eq(PrescriptionsTable.docId, DoctorsTable.docId))
    .leftJoin(UsersTable as any, eq(PrescriptionsTable.userId, UsersTable.userId))
    .orderBy(PrescriptionsTable.createdOn);
  return result;
};