import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, Moon, Globe, Ruler, HelpCircle, Shield, FileText, LogOut } from "lucide-react";

export default function Profile() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const currentWeight = user?.currentWeight ? parseFloat(user.currentWeight) : 0;
  const height = user?.height || 0;
  const bmi = height > 0 && currentWeight > 0 ? (currentWeight / ((height / 100) ** 2)).toFixed(1) : 0;

  return (
    <div className="pb-20">
      <Header />
      
      <main className="p-4 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Profile</h2>

        {/* User Info */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full object-cover" 
                  data-testid="profile-image"
                />
              ) : (
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-primary font-bold">
                    {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900" data-testid="user-name">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user?.email || 'User'}
                </h3>
                <p className="text-gray-600" data-testid="user-email">{user?.email}</p>
                <p className="text-sm text-gray-500">Member since {new Date(user?.createdAt || '').toLocaleDateString()}</p>
              </div>
              <Button className="healthify-primary text-white font-medium" data-testid="edit-profile-button">
                Edit
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center border-t pt-4">
              <div>
                <p className="text-2xl font-bold text-primary" data-testid="current-weight">{currentWeight || '--'}</p>
                <p className="text-sm text-gray-600">Current Weight</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-healthify-blue" data-testid="height">{height || '--'}</p>
                <p className="text-sm text-gray-600">Height (cm)</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-healthify-yellow" data-testid="bmi">{bmi || '--'}</p>
                <p className="text-sm text-gray-600">BMI</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">Push Notifications</span>
                </div>
                <Switch defaultChecked data-testid="notifications-toggle" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Moon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">Dark Mode</span>
                </div>
                <Switch data-testid="dark-mode-toggle" />
              </div>
              
              <button className="flex items-center space-x-3 w-full text-left py-2" data-testid="language-button">
                <Globe className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">Language</span>
                <span className="ml-auto text-gray-500">English</span>
              </button>
              
              <button className="flex items-center space-x-3 w-full text-left py-2" data-testid="units-button">
                <Ruler className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">Units</span>
                <span className="ml-auto text-gray-500">Metric</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Health Goals */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Goals</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Goal Weight</span>
                <span className="font-medium" data-testid="goal-weight">
                  {user?.goalWeight ? `${user.goalWeight} kg` : 'Not set'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Daily Calorie Goal</span>
                <span className="font-medium" data-testid="calorie-goal">
                  {user?.dailyCalorieGoal ? `${user.dailyCalorieGoal} cal` : '1,800 cal'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Weekly Exercise Goal</span>
                <span className="font-medium" data-testid="exercise-goal">
                  {user?.weeklyExerciseGoal ? `${user.weeklyExerciseGoal} days` : '5 days'}
                </span>
              </div>
              <Button className="w-full healthify-primary text-white font-medium mt-4" data-testid="update-goals-button">
                Update Goals
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-3">
              <button className="flex items-center space-x-3 w-full text-left py-2" data-testid="help-support-button">
                <HelpCircle className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">Help & Support</span>
              </button>
              
              <button className="flex items-center space-x-3 w-full text-left py-2" data-testid="privacy-policy-button">
                <Shield className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">Privacy Policy</span>
              </button>
              
              <button className="flex items-center space-x-3 w-full text-left py-2" data-testid="terms-of-service-button">
                <FileText className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">Terms of Service</span>
              </button>
              
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full text-left py-2 text-red-600"
                data-testid="logout-button"
              >
                <LogOut className="w-5 h-5 text-red-600" />
                <span>Logout</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
