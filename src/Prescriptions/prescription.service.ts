import { eq } from "drizzle-orm";
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
