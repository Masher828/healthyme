import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { format, parseISO } from 'date-fns';

interface WeightEntry {
  id: string;
  weight: string;
  date: string;
}

interface WeightChartProps {
  data: WeightEntry[];
}

export function WeightChart({ data }: WeightChartProps) {
  // Transform data for the chart
  const chartData = data
    .map(entry => ({
      date: entry.date,
      weight: parseFloat(entry.weight),
      displayDate: format(parseISO(entry.date), 'MMM d'),
      fullDate: format(parseISO(entry.date), 'MMM d, yyyy')
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="text-lg mb-2">No weight data available</p>
          <p className="text-sm">Start logging your weight to see progress charts</p>
        </div>
      </div>
    );
  }

  // Calculate weight change
  const firstWeight = chartData[0]?.weight || 0;
  const lastWeight = chartData[chartData.length - 1]?.weight || 0;
  const weightChange = lastWeight - firstWeight;
  const changeColor = weightChange <= 0 ? '#22c55e' : '#ef4444';

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-sm text-gray-600">Weight change: </span>
          <span 
            className="font-semibold"
            style={{ color: changeColor }}
            data-testid="text-weight-change"
          >
            {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
          </span>
        </div>
        <div className="text-sm text-gray-600">
          {chartData.length} entries over {chartData.length > 1 ? 
            Math.ceil((new Date(chartData[chartData.length - 1].date).getTime() - new Date(chartData[0].date).getTime()) / (1000 * 60 * 60 * 24)) : 0} days
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="displayDate" 
              stroke="#6b7280"
              fontSize={12}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tick={{ fontSize: 12 }}
              domain={['dataMin - 2', 'dataMax + 2']}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                      <p className="font-medium">{data.fullDate}</p>
                      <p className="text-blue-600">
                        Weight: <span className="font-semibold">{data.weight} kg</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line 
              type="monotone" 
              dataKey="weight" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}