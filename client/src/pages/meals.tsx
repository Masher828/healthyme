import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Utensils, TrendingUp } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { mockMeals, addMockMeal, type Meal } from "@/lib/mockData";
import { z } from "zod";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

// Zod schema for meal form validation
const mealFormSchema = z.object({
  name: z.string().min(1, "Meal name is required"),
  calories: z.number().min(1, "Calories must be positive"),
  protein: z.number().min(0, "Protein cannot be negative"),
  carbs: z.number().min(0, "Carbs cannot be negative"),
  fat: z.number().min(0, "Fat cannot be negative"),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
});

type MealFormData = z.infer<typeof mealFormSchema>;

export default function Meals() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [meals, setMeals] = useState<Meal[]>(mockMeals);

  const form = useForm<MealFormData>({
    resolver: zodResolver(mealFormSchema),
    defaultValues: {
      name: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      mealType: "breakfast",
    },
  });

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // This will be handled by the router
  }

  const onSubmit = (data: MealFormData) => {
    try {
      const newMeal = addMockMeal({
        ...data,
        date: new Date().toISOString().split('T')[0],
      });
      
      setMeals([...meals, newMeal]);
      setIsDialogOpen(false);
      form.reset();
      
      toast({
        title: "Meal Added",
        description: `${data.name} has been added to your meals.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add meal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const todaysMeals = meals.filter(meal => 
    meal.date === new Date().toISOString().split('T')[0]
  );

  const mealsByType = {
    breakfast: todaysMeals.filter(meal => meal.mealType === 'breakfast'),
    lunch: todaysMeals.filter(meal => meal.mealType === 'lunch'),
    dinner: todaysMeals.filter(meal => meal.mealType === 'dinner'),
    snack: todaysMeals.filter(meal => meal.mealType === 'snack'),
  };

  const totalCalories = todaysMeals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = todaysMeals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = todaysMeals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = todaysMeals.reduce((sum, meal) => sum + meal.fat, 0);

  const calorieGoal = user?.calorieGoal || 2000;
  const remainingCalories = calorieGoal - totalCalories;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meals</h1>
            <p className="text-gray-600">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700" data-testid="button-add-meal">
                <Plus className="w-4 h-4 mr-2" />
                Add Meal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Meal</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meal Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Grilled Chicken Salad" data-testid="input-meal-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="mealType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meal Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-meal-type">
                              <SelectValue placeholder="Select meal type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="breakfast">Breakfast</SelectItem>
                            <SelectItem value="lunch">Lunch</SelectItem>
                            <SelectItem value="dinner">Dinner</SelectItem>
                            <SelectItem value="snack">Snack</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="calories"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Calories</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number" 
                              onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                              data-testid="input-calories"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="protein"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Protein (g)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number" 
                              onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                              data-testid="input-protein"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="carbs"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Carbs (g)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number" 
                              onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                              data-testid="input-carbs"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="fat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fat (g)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number" 
                              onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                              data-testid="input-fat"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" data-testid="button-save-meal">
                    Add Meal
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Calorie Summary */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600" data-testid="text-total-calories">{totalCalories}</div>
                <div className="text-sm text-gray-600">Calories Consumed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600" data-testid="text-remaining-calories">{remainingCalories}</div>
                <div className="text-sm text-gray-600">Calories Remaining</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600" data-testid="text-total-protein">{totalProtein}g</div>
                <div className="text-sm text-gray-600">Protein</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600" data-testid="text-macros">{totalCarbs}g / {totalFat}g</div>
                <div className="text-sm text-gray-600">Carbs / Fat</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meal Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(mealsByType).map(([mealType, meals]) => (
            <Card key={mealType}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 capitalize">
                  <Utensils className="w-5 h-5" />
                  {mealType}
                  <span className="text-sm font-normal text-gray-500">
                    ({meals.reduce((sum, meal) => sum + meal.calories, 0)} cal)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {meals.length === 0 ? (
                    <p className="text-gray-500 text-sm">No meals logged yet</p>
                  ) : (
                    meals.map((meal) => (
                      <div key={meal.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg" data-testid={`meal-${meal.id}`}>
                        <div>
                          <h4 className="font-medium">{meal.name}</h4>
                          <p className="text-sm text-gray-600">
                            {meal.protein}g protein • {meal.carbs}g carbs • {meal.fat}g fat
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{meal.calories}</div>
                          <div className="text-xs text-gray-500">calories</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}