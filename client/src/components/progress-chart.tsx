import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProgressChartProps {
  weightEntries: any[];
}

export default function ProgressChart({ weightEntries }: ProgressChartProps) {
  // Group weight entries by week for the chart
  const chartData = weightEntries.slice(0, 6).reverse();

  const getBarHeight = (weight: number, maxWeight: number) => {
    if (maxWeight === 0) return 60;
    return Math.max(40, (weight / maxWeight) * 160);
  };

  const maxWeight = Math.max(...chartData.map((entry: any) => parseFloat(entry.weight || 0)));

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Weight Trend</h3>
          <Select defaultValue="30">
            <SelectTrigger className="w-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="180">Last 6 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {chartData.length > 0 ? (
          <div className="h-48 flex items-end justify-between mb-4">
            {chartData.map((entry: any, index: number) => {
              const weight = parseFloat(entry.weight || 0);
              const height = getBarHeight(weight, maxWeight);
              
              return (
                <div key={entry.id || index} className="flex flex-col items-center">
                  <div 
                    className="w-4 bg-primary rounded-t chart-bar mb-2"
                    style={{ height: `${height}px` }}
                    data-testid={`progress-bar-${index}`}
                  ></div>
                  <span className="text-xs text-gray-500">
                    Week {index + 1}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p>No weight data available</p>
              <p className="text-sm mt-1">Start logging your weight to see trends</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
