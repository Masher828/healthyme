import { useAuth } from "@/hooks/useAuth";
import { Heart, Bell } from "lucide-react";

export default function Header() {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning!";
    if (hour < 17) return "Good afternoon!";
    return "Good evening!";
  };

  const getUserName = () => {
    if (user?.firstName) return user.firstName;
    if (user?.email) return user.email.split('@')[0];
    return "User";
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900" data-testid="greeting">{getGreeting()}</h1>
              <p className="text-sm text-gray-600" data-testid="user-name">{getUserName()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative" data-testid="notification-button">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            {user?.profileImageUrl ? (
              <img 
                src={user.profileImageUrl} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover" 
                data-testid="header-profile-image"
              />
            ) : (
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-sm text-primary font-bold">
                  {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
