import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Apple, Dumbbell, TrendingUp } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary/80">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center text-white mb-12">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">HealthifyMe</h1>
          <p className="text-xl opacity-90 max-w-md mx-auto">
            Your personal health companion for a better lifestyle
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Apple className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Nutrition</h3>
              <p className="text-gray-600">Track calories, macros, and build healthy eating habits</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Fitness Tracking</h3>
              <p className="text-gray-600">Log workouts and monitor your fitness progress</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Progress Insights</h3>
              <p className="text-gray-600">Visualize your health journey with detailed analytics</p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="border-0 shadow-xl max-w-md mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Ready to start your journey?</h2>
              <p className="text-gray-600 mb-6">
                Join thousands of users who have transformed their health with HealthifyMe
              </p>
              <Button 
                onClick={handleLogin}
                className="w-full healthify-primary text-white hover:healthify-primary-dark text-lg py-6"
                data-testid="login-button"
              >
                Get Started - Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
