import db from "../Drizzle/db";
import { and, eq, count, sql } from "drizzle-orm/sql";
import {
  UsersTable,
  AppointmentsTable,
  PaymentsTable,
  PrescriptionsTable,
  ComplaintsTable,
} from "../Drizzle/schema";

// Total users grouped by role
export const getUserBreakdownByRole = async () => {
  const result = await db
    .select({
      role: UsersTable.role,
      total: count(UsersTable.userId).as("total"),
    })
    .from(UsersTable)
    .groupBy(UsersTable.role);

  return result;
};

// Appointments count by status
export const getAppointmentsCountByStatus = async () => {
  const result = await db
    .select({
      status: AppointmentsTable.apStatus,
      total: count(AppointmentsTable.apId).as("total"),
    })
    .from(AppointmentsTable)
    .groupBy(AppointmentsTable.apStatus);

  return result;
};

// Total prescriptions
export const getTotalPrescriptions = async () => {
  const result = await db
    .select({ total: count().as("total") })
    .from(PrescriptionsTable);

  return result[0];
};

// Total complaints
export const getTotalComplaints = async () => {
  const result = await db
    .select({ total: count().as("total") })
    .from(ComplaintsTable);

  return result[0];
};

// Total payments
export const getTotalPayments = async () => {
  const result = await db
    .select({ total: count().as("total") })
    .from(PaymentsTable);

  return result[0];
};

// Get all analytics for a specific user
export const getUserAnalytics = async (userId: number) => {
  const [appointments, prescriptions, complaints, payments] = await Promise.all([
    db
      .select({ total: count().as("total") })
      .from(AppointmentsTable)
      .where(eq(AppointmentsTable.userId, userId)),

    db
      .select({ total: count().as("total") })
      .from(PrescriptionsTable)
      .where(eq(PrescriptionsTable.userId, userId)),

    db
      .select({ total: count().as("total") })
      .from(ComplaintsTable)
      .where(eq(ComplaintsTable.userId, userId)),

    db
      .select({ total: count().as("total") })
      .from(PaymentsTable)
      .leftJoin(AppointmentsTable, eq(PaymentsTable.apId, AppointmentsTable.apId))
      .where(eq(AppointmentsTable.userId, userId)),
  ]);

  return {
    appointments: appointments[0]?.total || 0,
    prescriptions: prescriptions[0]?.total || 0,
    complaints: complaints[0]?.total || 0,
    payments: payments[0]?.total || 0,
  };
};

// Get all analytics for a specific doctor
export const getDoctorAnalytics = async (docId: number) => {
  const [appointments, prescriptions, complaints, payments] = await Promise.all([
    db
      .select({ total: count().as("total") })
      .from(AppointmentsTable)
      .where(eq(AppointmentsTable.docId, docId)),

    db
      .select({ total: count().as("total") })
      .from(PrescriptionsTable)
      .where(eq(PrescriptionsTable.docId, docId)),

    db
      .select({ total: count().as("total") })
      .from(ComplaintsTable)
      .leftJoin(AppointmentsTable, eq(ComplaintsTable.apId, AppointmentsTable.apId))
      .where(eq(AppointmentsTable.docId, docId)),

    db
      .select({ total: count().as("total") })
      .from(PaymentsTable)
      .leftJoin(AppointmentsTable, eq(PaymentsTable.apId, AppointmentsTable.apId))
      .where(eq(AppointmentsTable.docId, docId)),
  ]);

  return {
    appointments: appointments[0]?.total || 0,
    prescriptions: prescriptions[0]?.total || 0,
    complaints: complaints[0]?.total || 0,
    payments: payments[0]?.total || 0,
  };
};
