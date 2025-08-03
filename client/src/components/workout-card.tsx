import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Dumbbell, Heart, Music } from "lucide-react";

interface WorkoutCardProps {
  title: string;
  description: string;
  icon: string;
  onStart: () => void;
}

export default function WorkoutCard({ title, description, icon, onStart }: WorkoutCardProps) {
  const getIcon = () => {
    switch (icon) {
      case 'cardio':
        return <Activity className="w-8 h-8 text-white" />;
      case 'strength':
        return <Dumbbell className="w-8 h-8 text-white" />;
      case 'yoga':
        return <Heart className="w-8 h-8 text-white" />;
      case 'dance':
        return <Music className="w-8 h-8 text-white" />;
      default:
        return <Activity className="w-8 h-8 text-white" />;
    }
  };

  const getGradient = () => {
    switch (icon) {
      case 'cardio':
        return 'from-red-400 to-red-600';
      case 'strength':
        return 'from-blue-400 to-blue-600';
      case 'yoga':
        return 'from-green-400 to-green-600';
      case 'dance':
        return 'from-purple-400 to-purple-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className={`w-full h-24 bg-gradient-to-br ${getGradient()} rounded-xl mb-3 flex items-center justify-center`}>
          {getIcon()}
        </div>
        <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        <Button 
          onClick={onStart}
          className="w-full healthify-primary text-white text-sm font-medium"
          data-testid={`start-${icon}-workout`}
        >
          Start
        </Button>
      </CardContent>
    </Card>
  );
}
