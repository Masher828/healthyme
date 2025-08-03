import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Utensils, Trash2, Plus } from "lucide-react";

interface MealCategoryProps {
  title: string;
  meals: any[];
  onDeleteMeal: (mealId: string) => void;
  isDeleting: boolean;
}

export default function MealCategory({ title, meals, onDeleteMeal, isDeleting }: MealCategoryProps) {
  const totalCalories = meals.reduce((total, meal) => total + (meal.calories || 0), 0);

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <span className="text-sm text-gray-600" data-testid={`${title.toLowerCase()}-calories`}>
            {totalCalories > 0 ? `${totalCalories} cal` : 'Not logged'}
          </span>
        </div>
        
        {meals.length > 0 ? (
          <div className="space-y-3">
            {meals.map((meal: any) => (
              <div key={meal.id} className="flex items-center space-x-3" data-testid={`meal-item-${meal.id}`}>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Utensils className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{meal.name}</h4>
                  <p className="text-sm text-gray-600">1 serving • {meal.calories} cal</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteMeal(meal.id)}
                  disabled={isDeleting}
                  className="text-gray-400 hover:text-red-500"
                  data-testid={`delete-meal-${meal.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Plus className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">Add your {title.toLowerCase()}</p>
            <Button variant="ghost" className="mt-2 text-primary font-medium" data-testid={`add-${title.toLowerCase()}-button`}>
              Add Food
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
