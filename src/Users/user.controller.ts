import { Request, Response } from "express";
import * as UserService from "./user.service";

// Create user 
export const createUser = async (req: Request, res: Response) => {
  const now = new Date();

  const userData = {
    ...req.body,
    createdOn: now,
    updatedOn: now,
  };

  const newUser = await UserService.createUser(userData);
  res.status(201).json(newUser);
};

// Fetch users 
export const getAllUsers = async (req: Request, res: Response) => {
  const users = await UserService.getAllUsers();
  res.json(users);
};

// Fetch user with related tables
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await UserService.getUserById(Number(id));
  res.json(user);
};

// Update user by ID
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const existingUser = await UserService.getUserById(Number(id));
  if (!existingUser) {
    return res.status(404).json({ message: "User not found" });
  }

  const userData = {
    ...req.body,
    createdOn: existingUser.createdOn, 
    updatedOn: new Date(),             
  };

  const updatedUser = await UserService.updateUser(Number(id), userData);
  res.json(updatedUser);
};

// Delete user by ID
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedUser = await UserService.deleteUser(Number(id));
  res.json(deletedUser);
};
