import {
  users,
  weightEntries,
  waterIntake,
  meals,
  workouts,
  bodyMeasurements,
  type User,
  type UpsertUser,
  type InsertWeightEntry,
  type WeightEntry,
  type InsertWaterIntake,
  type WaterIntake,
  type InsertMeal,
  type Meal,
  type InsertWorkout,
  type Workout,
  type InsertBodyMeasurement,
  type BodyMeasurement,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Weight tracking
  addWeightEntry(entry: InsertWeightEntry): Promise<WeightEntry>;
  getWeightEntries(userId: string, limit?: number): Promise<WeightEntry[]>;
  
  // Water intake
  getWaterIntake(userId: string, date: string): Promise<WaterIntake | undefined>;
  updateWaterIntake(userId: string, date: string, glasses: number): Promise<WaterIntake>;
  
  // Meals
  addMeal(meal: InsertMeal): Promise<Meal>;
  getMeals(userId: string, date: string): Promise<Meal[]>;
  deleteMeal(id: string, userId: string): Promise<void>;
  
  // Workouts
  addWorkout(workout: InsertWorkout): Promise<Workout>;
  getWorkouts(userId: string, limit?: number): Promise<Workout[]>;
  
  // Body measurements
  addBodyMeasurement(measurement: InsertBodyMeasurement): Promise<BodyMeasurement>;
  getLatestBodyMeasurement(userId: string): Promise<BodyMeasurement | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async addWeightEntry(entry: InsertWeightEntry): Promise<WeightEntry> {
    const [weightEntry] = await db
      .insert(weightEntries)
      .values(entry)
      .returning();
    return weightEntry;
  }

  async getWeightEntries(userId: string, limit = 30): Promise<WeightEntry[]> {
    return await db
      .select()
      .from(weightEntries)
      .where(eq(weightEntries.userId, userId))
      .orderBy(desc(weightEntries.date))
      .limit(limit);
  }

  async getWaterIntake(userId: string, date: string): Promise<WaterIntake | undefined> {
    const [intake] = await db
      .select()
      .from(waterIntake)
      .where(and(eq(waterIntake.userId, userId), eq(waterIntake.date, date)));
    return intake;
  }

  async updateWaterIntake(userId: string, date: string, glasses: number): Promise<WaterIntake> {
    const [intake] = await db
      .insert(waterIntake)
      .values({ userId, date, glasses })
      .onConflictDoUpdate({
        target: [waterIntake.userId, waterIntake.date],
        set: {
          glasses,
          updatedAt: new Date(),
        },
      })
      .returning();
    return intake;
  }

  async addMeal(meal: InsertMeal): Promise<Meal> {
    const [mealEntry] = await db
      .insert(meals)
      .values(meal)
      .returning();
    return mealEntry;
  }

  async getMeals(userId: string, date: string): Promise<Meal[]> {
    return await db
      .select()
      .from(meals)
      .where(and(eq(meals.userId, userId), eq(meals.date, date)))
      .orderBy(meals.createdAt);
  }

  async deleteMeal(id: string, userId: string): Promise<void> {
    await db
      .delete(meals)
      .where(and(eq(meals.id, id), eq(meals.userId, userId)));
  }

  async addWorkout(workout: InsertWorkout): Promise<Workout> {
    const [workoutEntry] = await db
      .insert(workouts)
      .values(workout)
      .returning();
    return workoutEntry;
  }

  async getWorkouts(userId: string, limit = 10): Promise<Workout[]> {
    return await db
      .select()
      .from(workouts)
      .where(eq(workouts.userId, userId))
      .orderBy(desc(workouts.date))
      .limit(limit);
  }

  async addBodyMeasurement(measurement: InsertBodyMeasurement): Promise<BodyMeasurement> {
    const [measurementEntry] = await db
      .insert(bodyMeasurements)
      .values(measurement)
      .returning();
    return measurementEntry;
  }

  async getLatestBodyMeasurement(userId: string): Promise<BodyMeasurement | undefined> {
    const [measurement] = await db
      .select()
      .from(bodyMeasurements)
      .where(eq(bodyMeasurements.userId, userId))
      .orderBy(desc(bodyMeasurements.date))
      .limit(1);
    return measurement;
  }
}

export const storage = new DatabaseStorage();
