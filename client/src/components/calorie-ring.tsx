interface CalorieRingProps {
  consumed: number;
  burned: number;
  goal: number;
}

export function CalorieRing({ consumed, burned, goal }: CalorieRingProps) {
  const netCalories = consumed - burned;
  const remainingCalories = Math.max(0, goal - netCalories);
  const progress = Math.min(100, (consumed / goal) * 100);
  
  // Calculate stroke-dasharray for the progress circle
  const circumference = 2 * Math.PI * 90; // radius of 90
  const strokeDasharray = `${(progress / 100) * circumference} ${circumference}`;

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-48 h-48">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="#e5e7eb"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="#22c55e"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="transition-all duration-300 ease-in-out"
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold text-gray-900" data-testid="text-net-calories">
            {netCalories}
          </div>
          <div className="text-sm text-gray-500">net calories</div>
          <div className="text-sm font-medium text-green-600 mt-1">
            {remainingCalories} left
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="flex space-x-8 text-center">
        <div>
          <div className="text-lg font-semibold text-blue-600" data-testid="text-consumed-calories">
            {consumed}
          </div>
          <div className="text-xs text-gray-500">consumed</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-orange-600" data-testid="text-burned-calories">
            {burned}
          </div>
          <div className="text-xs text-gray-500">burned</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-gray-600" data-testid="text-goal-calories">
            {goal}
          </div>
          <div className="text-xs text-gray-500">goal</div>
        </div>
      </div>
    </div>
  );
}