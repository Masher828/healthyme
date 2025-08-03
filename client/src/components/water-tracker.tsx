import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplets } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function WaterTracker() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const today = new Date().toISOString().split('T')[0];

  const { data: waterIntake } = useQuery<any>({
    queryKey: ['/api/water', today],
  });

  const updateWaterMutation = useMutation({
    mutationFn: async (glasses: number) => {
      await apiRequest("POST", "/api/water", { date: today, glasses });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/water', today] });
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
        description: "Failed to update water intake",
        variant: "destructive",
      });
    },
  });

  const currentGlasses = waterIntake?.glasses || 0;
  const targetGlasses = 8;

  const addGlass = () => {
    if (currentGlasses < targetGlasses) {
      updateWaterMutation.mutate(currentGlasses + 1);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Water Intake</h3>
          <span className="text-sm text-primary font-medium" data-testid="water-progress">
            {currentGlasses}/{targetGlasses} glasses
          </span>
        </div>
        <div className="flex space-x-2 mb-4">
          {Array.from({ length: targetGlasses }, (_, i) => (
            <div 
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                i < currentGlasses ? 'bg-healthify-blue' : 'bg-gray-200'
              }`}
              data-testid={`water-glass-${i}`}
            >
              <Droplets className={`w-4 h-4 ${i < currentGlasses ? 'text-white' : 'text-gray-400'}`} />
            </div>
          ))}
        </div>
        <Button 
          onClick={addGlass}
          disabled={currentGlasses >= targetGlasses || updateWaterMutation.isPending}
          className="w-full bg-blue-50 text-healthify-blue hover:bg-blue-100 font-medium"
          data-testid="add-water-button"
        >
          {currentGlasses >= targetGlasses ? "Goal Completed! 🎉" : "+ Add Glass"}
        </Button>
      </CardContent>
    </Card>
  );
}
