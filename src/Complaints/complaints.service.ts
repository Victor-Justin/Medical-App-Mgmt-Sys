import { eq } from "drizzle-orm/sql";
import db from "../Drizzle/db";
import { ComplaintsTable, AppointmentsTable, UsersTable, DoctorsTable } from "../Drizzle/schema";


export const createComplaint = (data: any) =>
  db.insert(ComplaintsTable).values(data).returning();

export const getAllComplaints = async () => {
  const results = await db
    .select()
    .from(ComplaintsTable)
    .leftJoin(AppointmentsTable as any, eq(ComplaintsTable.apId, AppointmentsTable.apId))
    .leftJoin(UsersTable as any, eq(ComplaintsTable.userId, UsersTable.userId))
    .leftJoin(DoctorsTable, eq(AppointmentsTable.docId, DoctorsTable.docId));

  return results;
};


export const getComplaintById = async (id: number) => {
  const result = await db
    .select()
    .from(ComplaintsTable)
    .where(eq(ComplaintsTable.compId, id))
    .leftJoin(UsersTable as any, eq(ComplaintsTable.userId, UsersTable.userId))
    .leftJoin(AppointmentsTable as any, eq(ComplaintsTable.apId, AppointmentsTable.apId));

  return result[0];
};



export const updateComplaint = (id: number, data: any) =>
  db.update(ComplaintsTable).set(data).where(eq(ComplaintsTable.compId, id)).returning();


export const deleteComplaint = (id: number) =>
  db.delete(ComplaintsTable).where(eq(ComplaintsTable.compId, id)).returning();

export const getComplaintsByUserId = async (userId: number) => {
  const results = await db
    .select()
    .from(ComplaintsTable)
    .where(eq(ComplaintsTable.userId, userId))
    .leftJoin(AppointmentsTable as any, eq(ComplaintsTable.apId, AppointmentsTable.apId))
    .leftJoin(UsersTable as any, eq(ComplaintsTable.userId, UsersTable.userId))
    .leftJoin(DoctorsTable, eq(AppointmentsTable.docId, DoctorsTable.docId));

  return results;
};

export const getComplaintsByDoctorId = async (docId: number) => {
  const results = await db
    .select()
    .from(ComplaintsTable)
    .leftJoin(AppointmentsTable as any, eq(ComplaintsTable.apId, AppointmentsTable.apId))
    .leftJoin(UsersTable as any, eq(ComplaintsTable.userId, UsersTable.userId))
    .where(eq(AppointmentsTable.docId, docId));

  return results;
};

