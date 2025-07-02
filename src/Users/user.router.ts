import { Express } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "./user.controller";

const userRoutes = (app: Express) => {
  // Create a new user
  app.route("/users").post(async (req, res, next) => {
    try {
      await createUser(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get all users
  app.route("/users").get(async (req, res, next) => {
    try {
      await getAllUsers(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get user by ID
  app.route("/users/:id").get(async (req, res, next) => {
    try {
      await getUserById(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Update user by ID
  app.route("/users/:id").patch(async (req, res, next) => {
    try {
      await updateUser(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Delete user by ID
  app.route("/users/:id").delete(async (req, res, next) => {
    try {
      await deleteUser(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default userRoutes;
