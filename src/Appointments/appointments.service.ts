import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { AppointmentsTable, DoctorsTable, UsersTable, PrescriptionsTable, PaymentsTable, ComplaintsTable } from "../Drizzle/schema";


export const getAllAppointments = () =>
  db
    .select()
    .from(AppointmentsTable)
    .leftJoin(UsersTable as any, eq(AppointmentsTable.userId, UsersTable.userId))
    .leftJoin(DoctorsTable as any, eq(AppointmentsTable.docId, DoctorsTable.docId));


export const getAppointmentById = async (id: number) => {
  const result = await db
    .select()
    .from(AppointmentsTable)
    .where(eq(AppointmentsTable.apId, id))
    .leftJoin(UsersTable as any, eq(AppointmentsTable.userId, UsersTable.userId))
    .leftJoin(DoctorsTable as any, eq(AppointmentsTable.docId, DoctorsTable.docId))
    .leftJoin(PrescriptionsTable as any, eq(AppointmentsTable.apId, PrescriptionsTable.apId))
    .leftJoin(PaymentsTable as any, eq(AppointmentsTable.apId, PaymentsTable.apId))
    .leftJoin(ComplaintsTable as any, eq(AppointmentsTable.apId, ComplaintsTable.apId));

  return result[0];
};


export const createAppointment = (data: any) =>
  db.insert(AppointmentsTable).values(data).returning();


export const updateAppointment = (id: number, data: any) =>
  db.update(AppointmentsTable).set(data).where(eq(AppointmentsTable.apId, id)).returning();


export const deleteAppointment = (id: number) =>
  db.delete(AppointmentsTable).where(eq(AppointmentsTable.apId, id)).returning();
