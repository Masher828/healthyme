import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import WorkoutCard from "@/components/workout-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertWorkoutSchema } from "@shared/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Clock, Flame, Footprints } from "lucide-react";

export default function Workouts() {
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

  const { data: workouts = [] } = useQuery<any[]>({
    queryKey: ['/api/workouts'],
    enabled: isAuthenticated,
  });

  const form = useForm({
    resolver: zodResolver(insertWorkoutSchema),
    defaultValues: {
      name: "",
      type: "",
      duration: 0,
      caloriesBurned: 0,
      date: today,
    },
  });

  const addWorkoutMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/workouts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workouts'] });
      toast({
        title: "Success",
        description: "Workout added successfully!",
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
        description: "Failed to add workout. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    addWorkoutMutation.mutate(data);
  };

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const todaysWorkouts = workouts.filter((workout: any) => workout.date === today);
  const totalMinutes = todaysWorkouts.reduce((total: number, workout: any) => total + workout.duration, 0);
  const totalCalories = todaysWorkouts.reduce((total: number, workout: any) => total + workout.caloriesBurned, 0);

  return (
    <div className="pb-20">
      <Header />
      
      <main className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Workouts</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="healthify-primary text-white font-medium" data-testid="start-workout-button">
                + Start Workout
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Workout</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workout Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter workout name" {...field} data-testid="workout-name-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="workout-type-select">
                              <SelectValue placeholder="Select workout type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cardio">Cardio</SelectItem>
                            <SelectItem value="strength">Strength</SelectItem>
                            <SelectItem value="yoga">Yoga</SelectItem>
                            <SelectItem value="dance">Dance</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration (min)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} data-testid="duration-input" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="caloriesBurned"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Calories Burned</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} data-testid="calories-burned-input" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full healthify-primary text-white"
                    disabled={addWorkoutMutation.isPending}
                    data-testid="submit-workout-button"
                  >
                    {addWorkoutMutation.isPending ? "Adding..." : "Log Workout"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Today's Activity */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Activity</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary" data-testid="total-minutes">{totalMinutes}</p>
                <p className="text-sm text-gray-600">Minutes</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-healthify-blue" data-testid="total-calories">{totalCalories}</p>
                <p className="text-sm text-gray-600">Calories</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-healthify-red">8,547</p>
                <p className="text-sm text-gray-600">Steps</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Workouts */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Workouts</h3>
            <div className="space-y-4">
              {workouts.length > 0 ? (
                workouts.slice(0, 5).map((workout: any) => (
                  <div key={workout.id} className="flex items-center space-x-4" data-testid={`workout-${workout.id}`}>
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{workout.name}</h4>
                      <p className="text-sm text-gray-600">{workout.duration} min • {workout.caloriesBurned} cal burned</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {workout.date === today ? 'Today' : new Date(workout.date).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No workouts logged yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Workout Categories */}
        <div className="grid grid-cols-2 gap-4">
          <WorkoutCard 
            title="Cardio"
            description="Burn calories fast"
            icon="cardio"
            onStart={() => {
              form.setValue('type', 'cardio');
              setDialogOpen(true);
            }}
          />
          <WorkoutCard 
            title="Strength"
            description="Build muscle"
            icon="strength"
            onStart={() => {
              form.setValue('type', 'strength');
              setDialogOpen(true);
            }}
          />
          <WorkoutCard 
            title="Yoga"
            description="Flexibility & peace"
            icon="yoga"
            onStart={() => {
              form.setValue('type', 'yoga');
              setDialogOpen(true);
            }}
          />
          <WorkoutCard 
            title="Dance"
            description="Fun & energetic"
            icon="dance"
            onStart={() => {
              form.setValue('type', 'dance');
              setDialogOpen(true);
            }}
          />
        </div>
      </main>
    </div>
  );
}
