
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, FileText, Users, Heart, Sparkles, LogOut, User } from 'lucide-react';
import { ModernButton } from './ui/modern-button';
import { useAuth } from '@/hooks/useAuth';
import { useCommunityNotifications } from '@/hooks/useCommunityContent';

const Navigation = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { unreadCount } = useCommunityNotifications();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const navItems = [
    { to: '/', icon: Home, label: 'Accueil' },
    { to: '/journal', icon: FileText, label: 'Journal' },
    { to: '/testimony', icon: Heart, label: 'Témoignages' },
    { to: '/discover', icon: Sparkles, label: 'Découvrir', badge: unreadCount > 0 ? unreadCount : null },
    { to: '/community', icon: Users, label: 'Communauté' }
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo et titre */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Compagnon Spirituel
            </span>
          </div>

          {/* Navigation centrale */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      isActive
                        ? 'bg-purple-100 text-purple-700 shadow-sm'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Menu utilisateur */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span className="max-w-32 truncate">{user?.email}</span>
            </div>
            <ModernButton
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </ModernButton>
          </div>
        </div>

        {/* Navigation mobile */}
        <div className="md:hidden pb-3">
          <div className="flex space-x-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `relative flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-purple-100 text-purple-700 shadow-sm'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1 py-0.5 min-w-[1rem] h-4 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
