import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { ComplaintsTable, AppointmentsTable, UsersTable } from "../Drizzle/schema";


export const createComplaint = (data: any) =>
  db.insert(ComplaintsTable).values(data).returning();

export const getAllComplaints = () => db.select().from(ComplaintsTable);


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
