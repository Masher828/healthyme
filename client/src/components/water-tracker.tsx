import { Button } from "@/components/ui/button";
import { Droplets, Minus, Plus } from "lucide-react";

interface WaterTrackerProps {
  currentGlasses: number;
  targetGlasses: number;
  onUpdate: (glasses: number) => void;
}

export function WaterTracker({ currentGlasses, targetGlasses, onUpdate }: WaterTrackerProps) {
  const handleIncrement = () => {
    if (currentGlasses < targetGlasses) {
      onUpdate(currentGlasses + 1);
    }
  };

  const handleDecrement = () => {
    if (currentGlasses > 0) {
      onUpdate(currentGlasses - 1);
    }
  };

  const progress = (currentGlasses / targetGlasses) * 100;

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{currentGlasses} glasses</span>
            <span>{targetGlasses} goal</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-cyan-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Water glasses visualization */}
      <div className="flex justify-center space-x-2 my-6">
        {Array.from({ length: targetGlasses }, (_, index) => (
          <div
            key={index}
            className={`w-8 h-10 rounded-b-lg border-2 ${
              index < currentGlasses
                ? 'border-cyan-500 bg-cyan-100'
                : 'border-gray-300 bg-gray-50'
            } flex items-end justify-center pb-1`}
            data-testid={`water-glass-${index}`}
          >
            {index < currentGlasses && (
              <Droplets className="w-4 h-4 text-cyan-500" />
            )}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDecrement}
          disabled={currentGlasses === 0}
          data-testid="button-water-decrement"
        >
          <Minus className="w-4 h-4" />
        </Button>
        
        <span className="text-lg font-semibold min-w-[3rem] text-center" data-testid="text-current-glasses">
          {currentGlasses}/{targetGlasses}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleIncrement}
          disabled={currentGlasses >= targetGlasses}
          data-testid="button-water-increment"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Encouragement message */}
      {currentGlasses === targetGlasses && (
        <div className="text-center text-green-600 font-medium animate-pulse">
          🎉 Great job! You've reached your daily water goal!
        </div>
      )}
    </div>
  );
}