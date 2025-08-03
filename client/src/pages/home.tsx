import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import WaterTracker from "@/components/water-tracker";
import WeightChart from "@/components/weight-chart";
import NutritionSummary from "@/components/nutrition-summary";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame, Utensils } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Home() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Get today's meals
  const today = new Date().toISOString().split('T')[0];
  
  const { data: meals = [] } = useQuery<any[]>({
    queryKey: ['/api/meals', today],
    enabled: isAuthenticated,
  });

  // Get recent workouts
  const { data: workouts = [] } = useQuery<any[]>({
    queryKey: ['/api/workouts'],
    enabled: isAuthenticated,
  });

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const todaysCalories = meals.reduce((total: number, meal: any) => total + (meal.calories || 0), 0);
  const caloriesBurned = workouts.length > 0 && workouts[0].date === today ? workouts[0].caloriesBurned : 0;
  const caloriesLeft = 1800 - todaysCalories; // Default goal of 1800

  const recentMeals = meals.slice(0, 3);

  return (
    <div className="pb-20">
      <Header />
      
      <main className="p-4 space-y-6">
        {/* Daily Overview Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Flame className="w-5 h-5 text-healthify-blue" />
                </div>
                <span className="text-sm text-gray-500">Today</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900" data-testid="calories-burned">{caloriesBurned}</h3>
              <p className="text-sm text-gray-600">Calories burned</p>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-healthify-blue h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm text-gray-500">Left</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900" data-testid="calories-left">{caloriesLeft}</h3>
              <p className="text-sm text-gray-600">Calories</p>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${Math.max(0, Math.min(100, (caloriesLeft / 1800) * 100))}%` }}></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <WaterTracker />

        {/* Recent Meals */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Today's Meals</h3>
              <Link href="/meals">
                <button className="text-primary text-sm font-medium" data-testid="view-all-meals">View All</button>
              </Link>
            </div>
            <div className="space-y-3">
              {recentMeals.length > 0 ? (
                recentMeals.map((meal: any) => (
                  <div key={meal.id} className="flex items-center space-x-3" data-testid={`meal-${meal.id}`}>
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Utensils className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{meal.name}</h4>
                      <p className="text-sm text-gray-600">{meal.category} • {meal.calories} cal</p>
                    </div>
                    <span className="text-sm font-medium text-primary">✓</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Utensils className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No meals logged yet today</p>
                  <Link href="/meals">
                    <button className="mt-2 text-primary font-medium" data-testid="add-first-meal">Add your first meal</button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <WeightChart />
      </main>
    </div>
  );
}
