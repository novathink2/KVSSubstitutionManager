import { User } from '@/types';
import { LogOut } from 'lucide-react';
import { setCurrentUser } from '@/lib/storage';

interface NavbarProps {
  user: User;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const handleLogout = () => {
    setCurrentUser(null);
    onLogout();
  };

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left - Logo and Title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center p-1">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/en/thumb/b/ba/KVS_SVG_logo.svg/2553px-KVS_SVG_logo.svg.png" 
                  alt="KVS Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-primary">KVS AI</h1>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">SUBSTITUTION MANAGER</p>
              </div>
            </div>
          </div>

          {/* Right - User Info and Logout */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-muted-foreground">Welcome,</p>
              <p className="text-sm font-semibold text-foreground">{user.name.toUpperCase()}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors"
            >
              <span className="hidden sm:inline">Sign Out</span>
              <LogOut className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center p-1">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvjveY4wScoGhaa-5390lmWmRyT8ZR4SnpYw&s" 
                alt="PM SHRI Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
