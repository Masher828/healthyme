import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CalorieRing } from "@/components/calorie-ring";
import { WaterTracker } from "@/components/water-tracker";
import { Plus, TrendingUp, Utensils, Dumbbell, Droplets } from "lucide-react";
import { mealsApi, workoutsApi, waterApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const today = new Date().toISOString().split('T')[0];

  // Fetch today's data from the server
  const { data: todaysMeals = [], isLoading: mealsLoading } = useQuery({
    queryKey: ['meals', today],
    queryFn: () => mealsApi.getMeals(today),
    enabled: isAuthenticated,
  });

  const { data: todaysWorkouts = [], isLoading: workoutsLoading } = useQuery({
    queryKey: ['workouts', today],
    queryFn: () => workoutsApi.getWorkouts(today),
    enabled: isAuthenticated,
  });

  const { data: waterIntake, isLoading: waterLoading, refetch: refetchWater } = useQuery({
    queryKey: ['water-intake', today],
    queryFn: () => waterApi.getWaterIntake(today),
    enabled: isAuthenticated,
  });

  if (isLoading || mealsLoading || workoutsLoading || waterLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // This will be handled by the router
  }

  const totalCalories = todaysMeals.reduce((sum, meal) => sum + meal.calories, 0);
  const caloriesBurned = todaysWorkouts.reduce((sum, workout) => sum + workout.caloriesBurned, 0);
  const calorieGoal = user?.calorieGoal || 2000;
  const netCalories = totalCalories - caloriesBurned;
  const remainingCalories = Math.max(0, calorieGoal - netCalories);

  const calorieProgress = Math.min(100, (totalCalories / calorieGoal) * 100);
  const waterGlasses = waterIntake?.glasses || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 pb-24">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-gray-600">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
        </div>

        {/* Calorie Ring Section */}
        <div className="flex justify-center">
          <CalorieRing 
            consumed={totalCalories}
            burned={caloriesBurned}
            goal={calorieGoal}
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Calories Left</p>
                  <p className="text-2xl font-bold text-green-600" data-testid="text-calories-remaining">
                    {remainingCalories}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Meals Logged</p>
                  <p className="text-2xl font-bold text-blue-600" data-testid="text-meals-count">
                    {todaysMeals.length}
                  </p>
                </div>
                <Utensils className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Workouts</p>
                  <p className="text-2xl font-bold text-orange-600" data-testid="text-workouts-count">
                    {todaysWorkouts.length}
                  </p>
                </div>
                <Dumbbell className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Water Intake</p>
                  <p className="text-2xl font-bold text-cyan-600" data-testid="text-water-glasses">
                    {waterGlasses}/8
                  </p>
                </div>
                <Droplets className="w-8 h-8 text-cyan-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Water Tracker */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="w-5 h-5" />
              Water Intake
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WaterTracker 
              currentGlasses={waterGlasses}
              targetGlasses={8}
              onUpdate={setWaterGlasses}
            />
          </CardContent>
        </Card>

        {/* Daily Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Meals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Utensils className="w-5 h-5" />
                  Today's Meals
                </span>
                <Button size="sm" variant="outline" data-testid="button-view-meals">
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaysMeals.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No meals logged yet today</p>
                ) : (
                  todaysMeals.slice(0, 3).map((meal) => (
                    <div key={meal.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg" data-testid={`meal-preview-${meal.id}`}>
                      <div>
                        <h4 className="font-medium">{meal.name}</h4>
                        <p className="text-sm text-gray-600 capitalize">{meal.mealType}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{meal.calories} cal</div>
                      </div>
                    </div>
                  ))
                )}
                {todaysMeals.length > 3 && (
                  <p className="text-sm text-gray-500 text-center">
                    +{todaysMeals.length - 3} more meals
                  </p>  
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Workouts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Dumbbell className="w-5 h-5" />
                  Today's Workouts
                </span>
                <Button size="sm" variant="outline" data-testid="button-view-workouts">
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaysWorkouts.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No workouts logged yet today</p>
                ) : (
                  todaysWorkouts.map((workout) => (
                    <div key={workout.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg" data-testid={`workout-preview-${workout.id}`}>
                      <div>
                        <h4 className="font-medium">{workout.name}</h4>
                        <p className="text-sm text-gray-600">{workout.duration} minutes</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{workout.caloriesBurned} cal</div>
                        <div className="text-xs text-gray-500">burned</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Macronutrient Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Nutrition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Protein */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Protein</span>
                  <span className="text-sm font-medium" data-testid="text-protein-progress">
                    {todaysMeals.reduce((sum, meal) => sum + meal.protein, 0)}g / 150g
                  </span>
                </div>
                <Progress value={(todaysMeals.reduce((sum, meal) => sum + meal.protein, 0) / 150) * 100} className="h-2" />
              </div>

              {/* Carbs */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Carbs</span>
                  <span className="text-sm font-medium" data-testid="text-carbs-progress">
                    {todaysMeals.reduce((sum, meal) => sum + meal.carbs, 0)}g / 250g
                  </span>
                </div>
                <Progress value={(todaysMeals.reduce((sum, meal) => sum + meal.carbs, 0) / 250) * 100} className="h-2" />
              </div>

              {/* Fat */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Fat</span>
                  <span className="text-sm font-medium" data-testid="text-fat-progress">
                    {todaysMeals.reduce((sum, meal) => sum + meal.fat, 0)}g / 65g
                  </span>
                </div>
                <Progress value={(todaysMeals.reduce((sum, meal) => sum + meal.fat, 0) / 65) * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}