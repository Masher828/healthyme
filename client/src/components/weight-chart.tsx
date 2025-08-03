import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

export default function WeightChart() {
  const { data: weightEntries = [] } = useQuery<any[]>({
    queryKey: ['/api/weight'],
  });

  // Get last 7 entries for the chart
  const chartData = weightEntries.slice(0, 7).reverse();
  const currentWeight = weightEntries[0]?.weight ? parseFloat(weightEntries[0].weight) : 0;

  const getDayLabel = (date: string, index: number) => {
    const dateObj = new Date(date);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dateObj.getDay()];
  };

  const getBarHeight = (weight: number, maxWeight: number) => {
    if (maxWeight === 0) return 20;
    return Math.max(20, (weight / maxWeight) * 80);
  };

  const maxWeight = Math.max(...chartData.map((entry: any) => parseFloat(entry.weight || 0)));

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Weight Progress</h3>
          <span className="text-sm text-gray-500">Last 7 days</span>
        </div>
        {chartData.length > 0 ? (
          <>
            <div className="flex items-end justify-between h-32 mb-4">
              {chartData.map((entry: any, index: number) => {
                const weight = parseFloat(entry.weight || 0);
                const height = getBarHeight(weight, maxWeight);
                const isLatest = index === chartData.length - 1;
                
                return (
                  <div key={entry.id || index} className="flex flex-col items-center">
                    <div 
                      className={`w-6 rounded-t chart-bar mb-2 ${isLatest ? 'bg-primary' : 'bg-primary/70'}`}
                      style={{ height: `${height}px` }}
                      data-testid={`weight-bar-${index}`}
                    ></div>
                    <span className="text-xs text-gray-500">
                      {getDayLabel(entry.date, index)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900" data-testid="current-weight-display">
                {currentWeight.toFixed(1)} kg
              </p>
              <p className="text-sm text-gray-600">Current weight</p>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No weight data available</p>
            <p className="text-sm mt-1">Start tracking your weight to see progress</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
