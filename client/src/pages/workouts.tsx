import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Dumbbell, Clock, Flame } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { mockWorkouts, addMockWorkout, type Workout } from "@/lib/mockData";
import { z } from "zod";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const workoutFormSchema = z.object({
  name: z.string().min(1, "Workout name is required"),
  duration: z.number().min(1, "Duration must be positive"),
  caloriesBurned: z.number().min(0, "Calories burned cannot be negative"),
  exercises: z.string().min(1, "Please describe the exercises"),
});

type WorkoutFormData = z.infer<typeof workoutFormSchema>;

export default function Workouts() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [workouts, setWorkouts] = useState<Workout[]>(mockWorkouts);

  const form = useForm<WorkoutFormData>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: {
      name: "",
      duration: 0,
      caloriesBurned: 0,
      exercises: "",
    },
  });

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const onSubmit = (data: WorkoutFormData) => {
    try {
      const newWorkout = addMockWorkout({
        ...data,
        date: new Date().toISOString().split('T')[0],
      });

      setWorkouts([...workouts, newWorkout]);
      setIsDialogOpen(false);
      form.reset();

      toast({
        title: "Workout Added",
        description: `${data.name} has been logged successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add workout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const todaysWorkouts = workouts.filter(workout => 
    workout.date === new Date().toISOString().split('T')[0]
  );

  const totalDuration = todaysWorkouts.reduce((sum, workout) => sum + workout.duration, 0);
  const totalCaloriesBurned = todaysWorkouts.reduce((sum, workout) => sum + workout.caloriesBurned, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Workouts</h1>
            <p className="text-gray-600">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-600 hover:bg-orange-700" data-testid="button-add-workout">
                <Plus className="w-4 h-4 mr-2" />
                Log Workout
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Log New Workout</DialogTitle>
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
                          <Input {...field} placeholder="e.g., Morning Run" data-testid="input-workout-name" />
                        </FormControl>
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
                          <FormLabel>Duration (minutes)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number" 
                              onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                              data-testid="input-duration"
                            />
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
                            <Input 
                              {...field} 
                              type="number" 
                              onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                              data-testid="input-calories-burned"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="exercises"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exercises</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Describe the exercises you performed..."
                            className="min-h-[100px]"
                            data-testid="input-exercises"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" data-testid="button-save-workout">
                    Log Workout
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Today's Workouts</p>
                  <p className="text-2xl font-bold" data-testid="text-workout-count">{todaysWorkouts.length}</p>
                </div>
                <Dumbbell className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Duration</p>
                  <p className="text-2xl font-bold" data-testid="text-total-duration">{totalDuration} min</p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Calories Burned</p>
                  <p className="text-2xl font-bold" data-testid="text-calories-burned">{totalCaloriesBurned}</p>
                </div>
                <Flame className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workout History */}
        <Card>
          <CardHeader>
            <CardTitle>Workout History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workouts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No workouts logged yet. Start by adding your first workout!</p>
              ) : (
                workouts.map((workout) => (
                  <div key={workout.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg" data-testid={`workout-${workout.id}`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Dumbbell className="w-4 h-4 text-orange-600" />
                        <h3 className="font-semibold">{workout.name}</h3>
                        <span className="text-sm text-gray-500">
                          {format(new Date(workout.date), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{workout.exercises}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {workout.duration} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          {workout.caloriesBurned} cal
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}