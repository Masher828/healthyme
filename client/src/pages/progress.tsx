import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import ProgressChart from "@/components/progress-chart";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function ProgressPage() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

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

  const { data: weightEntries = [] } = useQuery({
    queryKey: ['/api/weight'],
    enabled: isAuthenticated,
  });

  const { data: bodyMeasurement } = useQuery({
    queryKey: ['/api/measurements/latest'],
    enabled: isAuthenticated,
  });

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const currentWeight = user?.currentWeight || (weightEntries[0]?.weight ? parseFloat(weightEntries[0].weight) : 0);
  const goalWeight = user?.goalWeight ? parseFloat(user.goalWeight) : 65;
  const weightLost = weightEntries.length > 1 ? 
    parseFloat(weightEntries[weightEntries.length - 1].weight) - parseFloat(weightEntries[0].weight) : 0;
  
  const progressPercentage = goalWeight ? Math.max(0, Math.min(100, ((currentWeight - goalWeight) / (currentWeight - goalWeight + Math.abs(weightLost))) * 100)) : 0;
  const remainingWeight = Math.max(0, currentWeight - goalWeight);

  return (
    <div className="pb-20">
      <Header />
      
      <main className="p-4 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Progress Tracking</h2>

        {/* Progress Overview */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Journey</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary" data-testid="weight-lost">{Math.abs(weightLost).toFixed(1)}</p>
                <p className="text-sm text-gray-600">KG {weightLost < 0 ? 'Lost' : 'Gained'}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-healthify-blue" data-testid="journey-weeks">12</p>
                <p className="text-sm text-gray-600">Weeks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <ProgressChart weightEntries={weightEntries} />

        {/* Body Measurements */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Measurements</h3>
              <Button variant="ghost" className="text-primary text-sm font-medium" data-testid="add-measurement-button">
                + Add
              </Button>
            </div>
            <div className="space-y-4">
              {bodyMeasurement ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Waist</span>
                    <span className="font-medium" data-testid="waist-measurement">{bodyMeasurement.waist} cm</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Chest</span>
                    <span className="font-medium" data-testid="chest-measurement">{bodyMeasurement.chest} cm</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Hips</span>
                    <span className="font-medium" data-testid="hips-measurement">{bodyMeasurement.hips} cm</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Arms</span>
                    <span className="font-medium" data-testid="arms-measurement">{bodyMeasurement.arms} cm</span>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No measurements recorded yet</p>
                  <Button variant="ghost" className="mt-2 text-primary font-medium" data-testid="add-first-measurement">
                    Add your first measurement
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Goals */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Goals</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Target Weight</span>
                  <span className="font-medium" data-testid="target-weight">{goalWeight} kg</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-sm text-gray-600 mt-1" data-testid="remaining-weight">
                  {remainingWeight.toFixed(1)} kg to go
                </p>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Daily Steps</span>
                  <span className="font-medium" data-testid="daily-steps">8,547 / 10,000</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
