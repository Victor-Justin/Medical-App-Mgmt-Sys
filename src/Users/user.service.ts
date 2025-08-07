import { eq } from "drizzle-orm/sql";
import db from "../Drizzle/db";
import { UsersTable, DoctorsTable, AppointmentsTable, ComplaintsTable, PrescriptionsTable } from "../Drizzle/schema";

// Get all users 
export const getAllUsers = () =>
  db.select().from(UsersTable);

// Get user by ID and related tables
export const getUserById = async (id: number) => {
  const result = await db
    .select()
    .from(UsersTable)
    .where(eq(UsersTable.userId, id))
    .leftJoin(AppointmentsTable as any, eq(UsersTable.userId, AppointmentsTable.userId))
    .leftJoin(ComplaintsTable as any, eq(UsersTable.userId, ComplaintsTable.userId))
    .leftJoin(PrescriptionsTable as any, eq(UsersTable.userId, PrescriptionsTable.userId));
  return result[0]; // Return the first matched record (or undefined if none)
};


// Create new user
export const createUser = (data: any) =>
  db.insert(UsersTable).values(data).returning();

// Update user by ID
export const updateUser = async (id: number, data: any) => {
  const updatedUser = await db
    .update(UsersTable)
    .set(data)
    .where(eq(UsersTable.userId, id))
    .returning();

  if (updatedUser[0]?.role === "doctor") {
    await promoteUserToDoctor(id);
  }

  return updatedUser[0];
};

// Delete user by ID
export const deleteUser = async (id: number) => {
  const user = await db.query.UsersTable.findFirst({
    where: eq(UsersTable.userId, id),
  });

  if (!user) {
    throw new Error("User not found");
  }

  const deletedUser = await db
    .delete(UsersTable)
    .where(eq(UsersTable.userId, id))
    .returning();

  //Delete corresponding doctor record by email
  if (user.role === "doctor") {
    await db
      .delete(DoctorsTable)
      .where(
        eq(DoctorsTable.email, user.email),
      )
  }

  return deletedUser[0];
};


//Changing role to update to doctor
export const promoteUserToDoctor = async (userId: number) => { console.log(userId)
  const user = await db.query.UsersTable.findFirst({
    where: eq(UsersTable.userId, userId),
  });
console.log(user)

  if (!user) throw new Error("User not found");

  //Check if doctor exists
  const existingDoctor = await db.query.DoctorsTable.findFirst({
    where: eq(DoctorsTable.email, user.email),
  });

  if (existingDoctor) {
    return existingDoctor;
  }

  //Insert into DoctorsTable using user's info
  const now = new Date();
  const newDoctor = await db
    .insert(DoctorsTable)
    .values({
      userId: user.userId,
      fName: user.fName,
      lName: user.lName,
      email: user.email,
      contactNo: user.contactNo,
      specialization: "General", 
      availableDays: "Monday-Friday", 
      createdOn: now,
      updatedOn: now,
    })
    .returning();

  return newDoctor[0];
};

