import { Card, CardContent } from "@/components/ui/card";

interface NutritionSummaryProps {
  meals: any[];
}

export default function NutritionSummary({ meals }: NutritionSummaryProps) {
  const totals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      carbs: acc.carbs + (parseFloat(meal.carbs) || 0),
      fat: acc.fat + (parseFloat(meal.fat) || 0),
      protein: acc.protein + (parseFloat(meal.protein) || 0),
    }),
    { calories: 0, carbs: 0, fat: 0, protein: 0 }
  );

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Nutrition</h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary" data-testid="total-calories">{totals.calories}</p>
            <p className="text-sm text-gray-600">Calories</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-healthify-blue" data-testid="total-carbs">{totals.carbs.toFixed(0)}g</p>
            <p className="text-sm text-gray-600">Carbs</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-healthify-red" data-testid="total-fat">{totals.fat.toFixed(0)}g</p>
            <p className="text-sm text-gray-600">Fat</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-healthify-yellow" data-testid="total-protein">{totals.protein.toFixed(0)}g</p>
            <p className="text-sm text-gray-600">Protein</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
