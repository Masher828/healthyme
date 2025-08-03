import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import NutritionSummary from "@/components/nutrition-summary";
import MealCategory from "@/components/meal-category";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMealSchema } from "@shared/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { z } from "zod";

const mealFormSchema = insertMealSchema.extend({
  protein: z.coerce.number().min(0),
  carbs: z.coerce.number().min(0),
  fat: z.coerce.number().min(0),
});

export default function Meals() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const today = new Date().toISOString().split('T')[0];

  const { data: meals = [] } = useQuery<any[]>({
    queryKey: ['/api/meals', today],
    enabled: isAuthenticated,
  });

  const form = useForm({
    resolver: zodResolver(mealFormSchema),
    defaultValues: {
      name: "",
      category: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      date: today,
    },
  });

  const addMealMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/meals", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/meals', today] });
      toast({
        title: "Success",
        description: "Meal added successfully!",
      });
      setDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to add meal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMealMutation = useMutation({
    mutationFn: async (mealId: string) => {
      await apiRequest("DELETE", `/api/meals/${mealId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/meals', today] });
      toast({
        title: "Success",
        description: "Meal deleted successfully!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to delete meal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    addMealMutation.mutate(data);
  };

  const handleDeleteMeal = (mealId: string) => {
    deleteMealMutation.mutate(mealId);
  };

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const mealsByCategory = {
    breakfast: meals.filter((meal: any) => meal.category === 'breakfast'),
    lunch: meals.filter((meal: any) => meal.category === 'lunch'),
    dinner: meals.filter((meal: any) => meal.category === 'dinner'),
    snack: meals.filter((meal: any) => meal.category === 'snack'),
  };

  return (
    <div className="pb-20">
      <Header />
      
      <main className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Food Diary</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="healthify-primary text-white font-medium" data-testid="add-food-button">
                + Add Food
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Food</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Food Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter food name" {...field} data-testid="food-name-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="category-select">
                              <SelectValue placeholder="Select category" />
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
                            <Input type="number" placeholder="0" {...field} data-testid="calories-input" />
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
                            <Input type="number" placeholder="0" {...field} data-testid="protein-input" />
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
                            <Input type="number" placeholder="0" {...field} data-testid="carbs-input" />
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
                            <Input type="number" placeholder="0" {...field} data-testid="fat-input" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full healthify-primary text-white"
                    disabled={addMealMutation.isPending}
                    data-testid="submit-meal-button"
                  >
                    {addMealMutation.isPending ? "Adding..." : "Add Meal"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <NutritionSummary meals={meals} />

        <div className="space-y-4">
          <MealCategory 
            title="Breakfast" 
            meals={mealsByCategory.breakfast} 
            onDeleteMeal={handleDeleteMeal}
            isDeleting={deleteMealMutation.isPending}
          />
          <MealCategory 
            title="Lunch" 
            meals={mealsByCategory.lunch} 
            onDeleteMeal={handleDeleteMeal}
            isDeleting={deleteMealMutation.isPending}
          />
          <MealCategory 
            title="Dinner" 
            meals={mealsByCategory.dinner} 
            onDeleteMeal={handleDeleteMeal}
            isDeleting={deleteMealMutation.isPending}
          />
          <MealCategory 
            title="Snacks" 
            meals={mealsByCategory.snack} 
            onDeleteMeal={handleDeleteMeal}
            isDeleting={deleteMealMutation.isPending}
          />
        </div>
      </main>
    </div>
  );
}
