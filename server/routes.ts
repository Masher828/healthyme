import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertWeightEntrySchema,
  insertWaterIntakeSchema,
  insertMealSchema,
  insertWorkoutSchema,
  insertBodyMeasurementSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Weight tracking routes
  app.post('/api/weight', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertWeightEntrySchema.parse({ ...req.body, userId });
      const weightEntry = await storage.addWeightEntry(data);
      res.json(weightEntry);
    } catch (error) {
      console.error("Error adding weight entry:", error);
      res.status(400).json({ message: "Failed to add weight entry" });
    }
  });

  app.get('/api/weight', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const entries = await storage.getWeightEntries(userId, limit);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching weight entries:", error);
      res.status(500).json({ message: "Failed to fetch weight entries" });
    }
  });

  // Water intake routes
  app.get('/api/water/:date', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { date } = req.params;
      const intake = await storage.getWaterIntake(userId, date);
      res.json(intake || { glasses: 0 });
    } catch (error) {
      console.error("Error fetching water intake:", error);
      res.status(500).json({ message: "Failed to fetch water intake" });
    }
  });

  app.post('/api/water', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertWaterIntakeSchema.parse({ ...req.body, userId });
      const intake = await storage.updateWaterIntake(userId, data.date, data.glasses || 0);
      res.json(intake);
    } catch (error) {
      console.error("Error updating water intake:", error);
      res.status(400).json({ message: "Failed to update water intake" });
    }
  });

  // Meals routes
  app.post('/api/meals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertMealSchema.parse({ ...req.body, userId });
      const meal = await storage.addMeal(data);
      res.json(meal);
    } catch (error) {
      console.error("Error adding meal:", error);
      res.status(400).json({ message: "Failed to add meal" });
    }
  });

  app.get('/api/meals/:date', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { date } = req.params;
      const meals = await storage.getMeals(userId, date);
      res.json(meals);
    } catch (error) {
      console.error("Error fetching meals:", error);
      res.status(500).json({ message: "Failed to fetch meals" });
    }
  });

  app.delete('/api/meals/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      await storage.deleteMeal(id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting meal:", error);
      res.status(500).json({ message: "Failed to delete meal" });
    }
  });

  // Workouts routes
  app.post('/api/workouts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertWorkoutSchema.parse({ ...req.body, userId });
      const workout = await storage.addWorkout(data);
      res.json(workout);
    } catch (error) {
      console.error("Error adding workout:", error);
      res.status(400).json({ message: "Failed to add workout" });
    }
  });

  app.get('/api/workouts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const workouts = await storage.getWorkouts(userId, limit);
      res.json(workouts);
    } catch (error) {
      console.error("Error fetching workouts:", error);
      res.status(500).json({ message: "Failed to fetch workouts" });
    }
  });

  // Body measurements routes
  app.post('/api/measurements', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertBodyMeasurementSchema.parse({ ...req.body, userId });
      const measurement = await storage.addBodyMeasurement(data);
      res.json(measurement);
    } catch (error) {
      console.error("Error adding body measurement:", error);
      res.status(400).json({ message: "Failed to add body measurement" });
    }
  });

  app.get('/api/measurements/latest', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const measurement = await storage.getLatestBodyMeasurement(userId);
      res.json(measurement);
    } catch (error) {
      console.error("Error fetching body measurement:", error);
      res.status(500).json({ message: "Failed to fetch body measurement" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
