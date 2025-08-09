// API client for connecting to localhost:8080 server
const API_BASE_URL = 'http://localhost:8080';

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
  
  return response.json();
}

// Auth API calls
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    
  logout: () =>
    apiRequest('/api/auth/logout', {
      method: 'POST',
    }),
    
  getUser: () =>
    apiRequest('/api/auth/user'),
};

// Meals API calls
export const mealsApi = {
  getMeals: (date?: string) => {
    const params = date ? `?date=${date}` : '';
    return apiRequest(`/api/meals${params}`);
  },
  
  addMeal: (meal: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    date: string;
  }) =>
    apiRequest('/api/meals', {
      method: 'POST',
      body: JSON.stringify(meal),
    }),
    
  deleteMeal: (id: string) =>
    apiRequest(`/api/meals/${id}`, {
      method: 'DELETE',
    }),
};

// Workouts API calls
export const workoutsApi = {
  getWorkouts: (date?: string) => {
    const params = date ? `?date=${date}` : '';
    return apiRequest(`/api/workouts${params}`);
  },
  
  addWorkout: (workout: {
    name: string;
    duration: number;
    caloriesBurned: number;
    exercises: string;
    date: string;
  }) =>
    apiRequest('/api/workouts', {
      method: 'POST',
      body: JSON.stringify(workout),
    }),
    
  deleteWorkout: (id: string) =>
    apiRequest(`/api/workouts/${id}`, {
      method: 'DELETE',
    }),
};

// Weight/Progress API calls
export const progressApi = {
  getWeightEntries: () =>
    apiRequest('/api/weight-entries'),
    
  addWeightEntry: (entry: { weight: string; date: string }) =>
    apiRequest('/api/weight-entries', {
      method: 'POST',
      body: JSON.stringify(entry),
    }),
    
  deleteWeightEntry: (id: string) =>
    apiRequest(`/api/weight-entries/${id}`, {
      method: 'DELETE',
    }),
};

// Water intake API calls
export const waterApi = {
  getWaterIntake: (date?: string) => {
    const params = date ? `?date=${date}` : '';
    return apiRequest(`/api/water-intake${params}`);
  },
  
  updateWaterIntake: (glasses: number, date?: string) =>
    apiRequest('/api/water-intake', {
      method: 'POST',
      body: JSON.stringify({
        glasses,
        date: date || new Date().toISOString().split('T')[0],
      }),
    }),
};

// User profile API calls
export const userApi = {
  updateProfile: (profile: {
    firstName?: string;
    lastName?: string;
    currentWeight?: number;
    goalWeight?: number;
    height?: number;
    age?: number;
    activityLevel?: string;
    calorieGoal?: number;
  }) =>
    apiRequest('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    }),
};