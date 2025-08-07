import { eq } from "drizzle-orm/sql";
import db from "../Drizzle/db";
import { PaymentsTable, AppointmentsTable } from "../Drizzle/schema";


export const getAllPayments = () =>
  db
    .select()
    .from(PaymentsTable)
    .leftJoin(AppointmentsTable as any, eq(PaymentsTable.apId, AppointmentsTable.apId));


export const getPaymentById = async (id: number) => {
  const result = await db
    .select()
    .from(PaymentsTable)
    .where(eq(PaymentsTable.payId, id))
    .leftJoin(AppointmentsTable as any, eq(PaymentsTable.apId, AppointmentsTable.apId));

  return result[0];
};


export const createPayment = (data: any) =>
  db.insert(PaymentsTable).values(data).returning();


export const updatePayment = (id: number, data: any) =>
  db.update(PaymentsTable).set(data).where(eq(PaymentsTable.payId, id)).returning();


export const deletePayment = (id: number) =>
  db.delete(PaymentsTable).where(eq(PaymentsTable.payId, id)).returning();

export const getPaymentsByUserId = async (userId: number) => {
  return db
    .select()
    .from(PaymentsTable)
    .leftJoin(AppointmentsTable as any, eq(PaymentsTable.apId, AppointmentsTable.apId))
    .where(eq(AppointmentsTable.userId, userId));
};
