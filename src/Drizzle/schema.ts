import {
  pgTable,
  serial,
  text,
  decimal,
  timestamp,
  numeric,
  date,
  pgEnum,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";



// User roles
export const RoleEnum = pgEnum("role", ["admin", "doctor", "patient"]);

// Appointment status
export const ApStatusEnum = pgEnum("ap_status", ["cancelled", "pending", "confirmed"]);

// Payment status
export const PayStatusEnum = pgEnum("pay_status", ["paid", "unpaid"]);

// Complaint status
export const ComplaintStatusEnum = pgEnum("complaint_status", ["In Progress", "Resolved", "Closed"]);


// TABLES

// Users Table
export const UsersTable = pgTable("users", {
  userId: serial("user_id").primaryKey(),
  fName: varchar("f_name", { length: 50 }).notNull(),
  lName: varchar("l_name", { length: 50 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  contactNo: numeric("contact_no").notNull(),
  role: RoleEnum("role").notNull().default("patient"),
  createdOn: timestamp("created_on").notNull(),
  updatedOn: timestamp("updated_on").notNull(),
  isVerified: boolean("is_verified").default(false),
  verificationCode: varchar("verification_code", { length: 10 })
});

// Doctors Table
export const DoctorsTable = pgTable("doctors", {
  docId: serial("doc_id").primaryKey(),
  fName: varchar("f_name", { length: 50 }).notNull(),
  lName: varchar("l_name", { length: 50 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  specialization: text("specialization").notNull(), 
  contactNo: numeric("contact_no").notNull(),
  availableDays:text("available_day").notNull(), 
  createdOn: timestamp("created_on").notNull(),
  updatedOn: timestamp("updated_on").notNull(),
});

// Appointments Table
export const AppointmentsTable = pgTable("appointments", {
  apId: serial("ap_id").primaryKey(),
  userId: serial("user_id").notNull().references(() => UsersTable.userId, { onDelete: "cascade" }),
  docId: serial("doc_id").notNull().references(() => DoctorsTable.docId, { onDelete: "cascade" }),
  apDate: date("ap_date").notNull(),
  timeSlot: timestamp("time_slot").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  apStatus: ApStatusEnum("ap_status").notNull(),
  createdOn: timestamp("created_on").notNull(),
  updatedOn: timestamp("updated_on").notNull(),
});

// Payments Table
export const PaymentsTable = pgTable("payments", {
  payId: serial("pay_id").primaryKey(),
  transId: serial("trans_id").notNull(),
  apId: serial("ap_id").notNull().references(() => AppointmentsTable.apId, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  payStatus: PayStatusEnum("pay_status").notNull(),
  payDate: date("pay_date").notNull(),
  createdOn: timestamp("created_on").notNull(),
  updatedOn: timestamp("updated_on").notNull(),
});

// Prescriptions Table
export const PrescriptionsTable = pgTable("prescriptions", {
  prescId: serial("presc_id").primaryKey(),
  apId: serial("ap_id").notNull().references(() => AppointmentsTable.apId, { onDelete: "cascade" }),
  docId: serial("doc_id").notNull().references(() => DoctorsTable.docId, { onDelete: "cascade" }),
  userId: serial("user_id").notNull().references(() => UsersTable.userId, { onDelete: "cascade" }),
  notes: text("notes").notNull(),
  createdOn: timestamp("created_on").notNull(),
  updatedOn: timestamp("updated_on").notNull(),
});

// Complaints Table
export const ComplaintsTable = pgTable("complaints", {
  compId: serial("comp_id").primaryKey(),
  userId: serial("user_id").notNull().references(() => UsersTable.userId, { onDelete: "cascade" }),
  apId: serial("ap_id").notNull().references(() => AppointmentsTable.apId, { onDelete: "cascade" }),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  status: ComplaintStatusEnum("complaint_status").notNull(),
  createdOn: timestamp("created_on").notNull(),
  updatedOn: timestamp("updated_on").notNull(),
});



// RELATIONSHIP DEFINITIONS


// Users - one user can have many appointments, complaints, and prescriptions
export const UserRelations = relations(UsersTable, ({ many }) => ({
  appointments: many(AppointmentsTable),
  complaints: many(ComplaintsTable),
  prescriptions: many(PrescriptionsTable),
}));

// Doctors - one doctor can have many appointments and prescriptions
export const DoctorRelations = relations(DoctorsTable, ({ many }) => ({
  appointments: many(AppointmentsTable),
  prescriptions: many(PrescriptionsTable),
}));

// Appointments - one appointment belongs to one user, one doctor, can have many prescriptions, and one payment
export const AppointmentRelations = relations(AppointmentsTable, ({ one, many }) => ({
  user: one(UsersTable, {
    fields: [AppointmentsTable.userId],
    references: [UsersTable.userId],
  }),
  doctor: one(DoctorsTable, {
    fields: [AppointmentsTable.docId],
    references: [DoctorsTable.docId],
  }),
  prescriptions: many(PrescriptionsTable),
  payments: many(PaymentsTable),
  complaints: many(ComplaintsTable),
}));

// Prescriptions - one prescription belongs to one appointment, one doctor, and one user
export const PrescriptionRelations = relations(PrescriptionsTable, ({ one }) => ({
  appointment: one(AppointmentsTable, {
    fields: [PrescriptionsTable.apId],
    references: [AppointmentsTable.apId],
  }),
  doctor: one(DoctorsTable, {
    fields: [PrescriptionsTable.docId],
    references: [DoctorsTable.docId],
  }),
  user: one(UsersTable, {
    fields: [PrescriptionsTable.userId],
    references: [UsersTable.userId],
  }),
}));

// Payments - one payment belongs to one appointment
export const PaymentRelations = relations(PaymentsTable, ({ one }) => ({
  appointment: one(AppointmentsTable, {
    fields: [PaymentsTable.apId],
    references: [AppointmentsTable.apId],
  }),
}));

// Complaints - one complaint belongs to one user and one appointment
export const ComplaintRelations = relations(ComplaintsTable, ({ one }) => ({
  user: one(UsersTable, {
    fields: [ComplaintsTable.userId],
    references: [UsersTable.userId],
  }),
  appointment: one(AppointmentsTable, {
    fields: [ComplaintsTable.apId],
    references: [AppointmentsTable.apId],
  }),
}));



// INFERRED TYPES


export type TIUser = typeof UsersTable.$inferInsert;
export type TSUser = typeof UsersTable.$inferSelect;

export type TIDoctor = typeof DoctorsTable.$inferInsert;
export type TSDoctor = typeof DoctorsTable.$inferSelect;

export type TIAppointment = typeof AppointmentsTable.$inferInsert;
export type TSAppointment = typeof AppointmentsTable.$inferSelect;

export type TIPayment = typeof PaymentsTable.$inferInsert;
export type TSPayment = typeof PaymentsTable.$inferSelect;

export type TIPrescription = typeof PrescriptionsTable.$inferInsert;
export type TSPrescription = typeof PrescriptionsTable.$inferSelect;

export type TIComplaint = typeof ComplaintsTable.$inferInsert;
export type TSComplaint = typeof ComplaintsTable.$inferSelect;
