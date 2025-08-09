import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, Moon, Globe, Ruler, HelpCircle, Shield, FileText, LogOut, User, Mail, Calendar } from "lucide-react";

export default function Profile() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const currentWeight = user?.currentWeight || 0;
  const height = user?.height || 0;
  const bmi = height > 0 && currentWeight > 0 ? (currentWeight / ((height / 100) ** 2)).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

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
                  <User className="w-8 h-8 text-primary" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900" data-testid="user-name">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user?.email || 'User'}
                </h3>
                <p className="text-gray-600 flex items-center gap-1" data-testid="user-email">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Member since {new Date(user?.createdAt || '').toLocaleDateString()}
                </p>
              </div>
              <Button variant="outline" data-testid="edit-profile-button">
                Edit Profile
              </Button>
            </div>

            {/* Health Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600" data-testid="text-current-weight">
                  {currentWeight || '--'} kg
                </div>
                <div className="text-sm text-gray-600">Current Weight</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600" data-testid="text-height">
                  {height || '--'} cm
                </div>
                <div className="text-sm text-gray-600">Height</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600" data-testid="text-bmi">
                  {bmi || '--'}
                </div>
                <div className="text-sm text-gray-600">BMI</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Notifications */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Meal reminders</span>
                  <Switch defaultChecked data-testid="switch-meal-reminders" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Workout notifications</span>
                  <Switch defaultChecked data-testid="switch-workout-notifications" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Progress updates</span>
                  <Switch data-testid="switch-progress-updates" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Preferences
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Dark mode</span>
                  <Switch data-testid="switch-dark-mode" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Metric units</span>
                  <Switch defaultChecked data-testid="switch-metric-units" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Weekly reports</span>
                  <Switch defaultChecked data-testid="switch-weekly-reports" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="justify-start" data-testid="button-body-measurements">
                <Ruler className="w-4 h-4 mr-2" />
                Body Measurements
              </Button>
              <Button variant="outline" className="justify-start" data-testid="button-help-support">
                <HelpCircle className="w-4 h-4 mr-2" />
                Help & Support
              </Button>
              <Button variant="outline" className="justify-start" data-testid="button-privacy-settings">
                <Shield className="w-4 h-4 mr-2" />
                Privacy Settings
              </Button>
              <Button variant="outline" className="justify-start" data-testid="button-terms-conditions">
                <FileText className="w-4 h-4 mr-2" />
                Terms & Conditions
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Goals & Targets */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Goals & Targets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700">Daily Calorie Goal</label>
                <div className="mt-1">
                  <span className="text-2xl font-bold text-green-600" data-testid="text-calorie-goal">
                    {user?.calorieGoal || 2000}
                  </span>
                  <span className="text-gray-500 ml-1">calories</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Target Weight</label>
                <div className="mt-1">
                  <span className="text-2xl font-bold text-blue-600" data-testid="text-goal-weight">
                    {user?.goalWeight || 68}
                  </span>
                  <span className="text-gray-500 ml-1">kg</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <Button
              onClick={() => logout()}
              variant="destructive"
              className="w-full"
              data-testid="logout-button"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}