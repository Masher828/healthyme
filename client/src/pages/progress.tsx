import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, TrendingDown, Target, Calendar } from "lucide-react";
import { WeightChart } from "@/components/weight-chart";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { mockWeightEntries, addMockWeightEntry, type WeightEntry } from "@/lib/mockData";
import { z } from "zod";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const weightFormSchema = z.object({
  weight: z.string().min(1, "Weight is required"),
  date: z.string().min(1, "Date is required"),
});

type WeightFormData = z.infer<typeof weightFormSchema>;

export default function Progress() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>(mockWeightEntries);

  const form = useForm<WeightFormData>({
    resolver: zodResolver(weightFormSchema),
    defaultValues: {
      weight: "",
      date: new Date().toISOString().split('T')[0],
    },
  });

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const onSubmit = (data: WeightFormData) => {
    try {
      const newEntry = addMockWeightEntry(data.weight, data.date);
      setWeightEntries([...weightEntries, newEntry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      setIsDialogOpen(false);
      form.reset({
        weight: "",
        date: new Date().toISOString().split('T')[0],
      });

      toast({
        title: "Weight Entry Added",
        description: `Weight of ${data.weight} kg recorded for ${format(new Date(data.date), 'MMM d, yyyy')}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add weight entry. Please try again.",
        variant: "destructive",
      });
    }
  };

  const currentWeight = user?.currentWeight || (weightEntries[weightEntries.length - 1]?.weight ? parseFloat(weightEntries[weightEntries.length - 1].weight) : 0);
  const goalWeight = user?.goalWeight || 68;
  const startWeight = weightEntries.length > 0 ? parseFloat(weightEntries[0].weight) : currentWeight;
  const weightLost = startWeight - currentWeight;
  const remainingWeight = Math.max(0, currentWeight - goalWeight);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 pb-24">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Progress</h1>
            <p className="text-gray-600">Track your health journey</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700" data-testid="button-add-weight">
                <Plus className="w-4 h-4 mr-2" />
                Log Weight
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Log Weight Entry</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 75.5" data-testid="input-weight" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" data-testid="input-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" data-testid="button-save-weight">
                    Log Weight
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Current Weight</p>
                  <p className="text-2xl font-bold" data-testid="text-current-weight">{currentWeight} kg</p>
                </div>
                <TrendingDown className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Goal Weight</p>
                  <p className="text-2xl font-bold" data-testid="text-goal-weight">{goalWeight} kg</p>
                </div>
                <Target className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Weight Lost</p>
                  <p className="text-2xl font-bold text-green-600" data-testid="text-weight-lost">
                    {weightLost > 0 ? '-' : ''}{Math.abs(weightLost).toFixed(1)} kg
                  </p>
                </div>
                <TrendingDown className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Remaining</p>
                  <p className="text-2xl font-bold text-orange-600" data-testid="text-remaining-weight">
                    {remainingWeight.toFixed(1)} kg
                  </p>
                </div>
                <Target className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weight Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weight Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <WeightChart data={weightEntries} />
          </CardContent>
        </Card>

        {/* Recent Weight Entries */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Weight Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weightEntries.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No weight entries yet. Start tracking your progress!</p>
              ) : (
                weightEntries
                  .slice(-10)
                  .reverse()
                  .map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg" data-testid={`weight-entry-${entry.id}`}>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{format(new Date(entry.date), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-lg">{entry.weight} kg</span>
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