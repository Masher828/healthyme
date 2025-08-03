// Mock data for client-only HealthifyMe demo

export interface WeightEntry {
  id: string;
  userId: string;
  weight: string;
  date: string;
  createdAt: Date;
}

export interface Meal {
  id: string;
  userId: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
  createdAt: Date;
}

export interface Workout {
  id: string;
  userId: string;
  name: string;
  duration: number;
  caloriesBurned: number;
  exercises: string;
  date: string;
  createdAt: Date;
}

export interface WaterIntake {
  userId: string;
  date: string;
  glasses: number;
}

export interface BodyMeasurement {
  id: string;
  userId: string;
  type: 'chest' | 'waist' | 'hips' | 'biceps' | 'thighs';
  value: string;
  date: string;
  createdAt: Date;
}

// Mock weight entries for progress chart
export const mockWeightEntries: WeightEntry[] = [
  { id: '1', userId: '1', weight: '78', date: '2024-01-01', createdAt: new Date('2024-01-01') },
  { id: '2', userId: '1', weight: '77.5', date: '2024-01-08', createdAt: new Date('2024-01-08') },
  { id: '3', userId: '1', weight: '77', date: '2024-01-15', createdAt: new Date('2024-01-15') },
  { id: '4', userId: '1', weight: '76.5', date: '2024-01-22', createdAt: new Date('2024-01-22') },
  { id: '5', userId: '1', weight: '76', date: '2024-01-29', createdAt: new Date('2024-01-29') },
  { id: '6', userId: '1', weight: '75.5', date: '2024-02-05', createdAt: new Date('2024-02-05') },
  { id: '7', userId: '1', weight: '75', date: '2024-02-12', createdAt: new Date('2024-02-12') },
];

// Mock meals for today
export const mockMeals: Meal[] = [
  {
    id: '1',
    userId: '1',
    name: 'Oatmeal with Berries',
    calories: 250,
    protein: 8,
    carbs: 45,
    fat: 4,
    mealType: 'breakfast',
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date(),
  },
  {
    id: '2',
    userId: '1',
    name: 'Greek Yogurt',
    calories: 120,
    protein: 15,
    carbs: 8,
    fat: 2,
    mealType: 'breakfast',
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date(),
  },
  {
    id: '3',
    userId: '1',
    name: 'Grilled Chicken Salad',
    calories: 350,
    protein: 35,
    carbs: 20,
    fat: 12,
    mealType: 'lunch',
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date(),
  },
  {
    id: '4',
    userId: '1',
    name: 'Apple with Peanut Butter',
    calories: 180,
    protein: 6,
    carbs: 20,
    fat: 8,
    mealType: 'snack',
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date(),
  },
];

// Mock workouts
export const mockWorkouts: Workout[] = [
  {
    id: '1',
    userId: '1',
    name: 'Morning Run',
    duration: 30,
    caloriesBurned: 300,
    exercises: 'Running, Warm-up stretches',
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date(),
  },
  {
    id: '2',
    userId: '1',
    name: 'Upper Body Strength',
    duration: 45,
    caloriesBurned: 250,
    exercises: 'Push-ups, Pull-ups, Bench press, Bicep curls',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
    createdAt: new Date(Date.now() - 86400000),
  },
];

// Mock water intake
export const mockWaterIntake: WaterIntake = {
  userId: '1',
  date: new Date().toISOString().split('T')[0],
  glasses: 6,
};

// Mock body measurements
export const mockBodyMeasurements: BodyMeasurement[] = [
  { id: '1', userId: '1', type: 'chest', value: '96', date: '2024-02-01', createdAt: new Date('2024-02-01') },
  { id: '2', userId: '1', type: 'waist', value: '82', date: '2024-02-01', createdAt: new Date('2024-02-01') },
  { id: '3', userId: '1', type: 'hips', value: '95', date: '2024-02-01', createdAt: new Date('2024-02-01') },
  { id: '4', userId: '1', type: 'biceps', value: '35', date: '2024-02-01', createdAt: new Date('2024-02-01') },
  { id: '5', userId: '1', type: 'thighs', value: '58', date: '2024-02-01', createdAt: new Date('2024-02-01') },
];

// Helper functions for mock data manipulation
export const addMockMeal = (meal: Omit<Meal, 'id' | 'userId' | 'createdAt'>) => {
  const newMeal: Meal = {
    ...meal,
    id: Math.random().toString(36).substring(7),
    userId: '1',
    createdAt: new Date(),
  };
  mockMeals.push(newMeal);
  return newMeal;
};

export const addMockWorkout = (workout: Omit<Workout, 'id' | 'userId' | 'createdAt'>) => {
  const newWorkout: Workout = {
    ...workout,
    id: Math.random().toString(36).substring(7),
    userId: '1',
    createdAt: new Date(),
  };
  mockWorkouts.push(newWorkout);
  return newWorkout;
};

export const addMockWeightEntry = (weight: string, date: string) => {
  const newEntry: WeightEntry = {
    id: Math.random().toString(36).substring(7),
    userId: '1',
    weight,
    date,
    createdAt: new Date(),
  };
  mockWeightEntries.push(newEntry);
  return newEntry;
};

export const updateMockWaterIntake = (glasses: number) => {
  mockWaterIntake.glasses = glasses;
  return mockWaterIntake;
};