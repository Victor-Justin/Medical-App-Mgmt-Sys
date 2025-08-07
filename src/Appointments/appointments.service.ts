import { eq, and } from "drizzle-orm/sql";
import db from "../Drizzle/db";
import { AppointmentsTable, DoctorsTable, UsersTable, PrescriptionsTable, PaymentsTable, ComplaintsTable } from "../Drizzle/schema";


export const getAllAppointments = () =>
  db
    .select()
    .from(AppointmentsTable)
    .leftJoin(UsersTable as any, eq(AppointmentsTable.userId, UsersTable.userId))
    .leftJoin(DoctorsTable as any, eq(AppointmentsTable.docId, DoctorsTable.docId))
    .leftJoin(PaymentsTable as any, eq(AppointmentsTable.apId, PaymentsTable.apId))
    .leftJoin(ComplaintsTable as any, eq(AppointmentsTable.apId, ComplaintsTable.apId))
    .leftJoin(PrescriptionsTable as any, eq(AppointmentsTable.apId, PrescriptionsTable.apId));


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

export const getAppointmentsByUserId = async (userId: number) => {
  const result = await db
    .select()
    .from(AppointmentsTable)
    .where(eq(AppointmentsTable.userId, userId))
    .leftJoin(DoctorsTable as any, eq(AppointmentsTable.docId, DoctorsTable.docId));

  return result
};

export const getAppointmentsByDoctorId = async (docId: number) => {
  const result = await db
    .select()
    .from(AppointmentsTable)
    .where(eq(AppointmentsTable.docId, docId))
    .leftJoin(UsersTable as any, eq(AppointmentsTable.userId, UsersTable.userId))
    .leftJoin(PrescriptionsTable as any, eq(AppointmentsTable.apId, PrescriptionsTable.apId));

  return result;
};



export const createAppointment = async (data: any) => {
  const { userId, docId, apDate, startTime } = data;

  // Check if patient is free
  const existingPatientAppt = await db
    .select()
    .from(AppointmentsTable)
    .where(
      and(
        eq(AppointmentsTable.userId, userId),
        eq(AppointmentsTable.apDate, apDate),
        eq(AppointmentsTable.startTime, startTime)
      )
    );

  if (existingPatientAppt.length > 0) {
    throw new Error("Patient already has an appointment at this time.");
  }

  // Check if doctor is free
  const existingDoctorAppt = await db
    .select()
    .from(AppointmentsTable)
    .where(
      and(
        eq(AppointmentsTable.docId, docId),
        eq(AppointmentsTable.apDate, apDate),
        eq(AppointmentsTable.startTime, startTime)
      )
    );

  if (existingDoctorAppt.length > 0) {
    throw new Error("Doctor already has an appointment at this time.");
  }

  // Proceed with booking
  return db.insert(AppointmentsTable).values(data).returning();
};


export const updateAppointment = (id: number, data: any) =>
  db.update(AppointmentsTable).set(data).where(eq(AppointmentsTable.apId, id)).returning();


export const deleteAppointment = (id: number) =>
  db.delete(AppointmentsTable).where(eq(AppointmentsTable.apId, id)).returning();

export const cancelAppointment = (id: number) =>
  db
    .update(AppointmentsTable)
    .set({ apStatus: "cancelled" })
    .where(eq(AppointmentsTable.apId, id))
    .returning();

  export const confirmAppointment = (id: number) =>
  db
    .update(AppointmentsTable)
    .set({ apStatus: "confirmed" })
    .where(eq(AppointmentsTable.apId, id))
    .returning();  
