
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, FileText, Users, Heart, Plus, LogOut, User, X, Sparkles, Settings, Circle } from 'lucide-react';
import { ModernButton } from './ui/modern-button';
import { useAuth } from '@/hooks/useAuth';
import { useCommunityNotifications } from '@/hooks/useCommunityContent';

const Navigation = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { unreadCount } = useCommunityNotifications();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Navigation principale (toujours visible)
  const mainNavItems = [
    { to: '/', icon: Home, label: 'Accueil' },
    { to: '/journal', icon: FileText, label: 'Journal' },
    { to: '/testimony', icon: Heart, label: 'Témoignages' },
    { to: '/community', icon: Users, label: 'Communauté' }
  ];

  // Navigation secondaire (dans le menu "+")
  const secondaryNavItems = [
    { to: '/discover', icon: Sparkles, label: 'Découvrir', badge: unreadCount > 0 ? unreadCount : null },
    { to: '/settings', icon: Settings, label: 'Paramètres' },
    { to: '/challenges', icon: Circle, label: 'Défis' },
    { to: '/prayer-circles', icon: Circle, label: 'Cercle de prière' },
    { to: '/reading-plans', icon: Circle, label: 'Plans de lecture' }
  ];

  const toggleMoreMenu = () => {
    setShowMoreMenu(!showMoreMenu);
  };

  const closeMoreMenu = () => {
    setShowMoreMenu(false);
  };

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

          {/* Navigation principale */}
          <div className="hidden md:flex items-center space-x-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      isActive
                        ? 'bg-purple-100 text-purple-700 shadow-sm'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
            
            {/* Bouton "+" pour les autres sections */}
            <div className="relative">
              <ModernButton
                onClick={toggleMoreMenu}
                variant="outline"
                size="sm"
                className={`flex items-center gap-2 transition-all duration-200 ${
                  showMoreMenu ? 'bg-purple-100 text-purple-700' : ''
                }`}
              >
                {showMoreMenu ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                <span className="hidden sm:inline">Plus</span>
              </ModernButton>

              {/* Menu contextuel */}
              {showMoreMenu && (
                <>
                  {/* Overlay pour fermer le menu */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={closeMoreMenu}
                  />
                  
                  {/* Menu déroulant */}
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-2">
                    {secondaryNavItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={closeMoreMenu}
                          className={({ isActive }) =>
                            `relative flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                              isActive
                                ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-500'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-purple-600'
                            }`
                          }
                        >
                          <Icon className="h-4 w-4" />
                          <span className="flex-1">{item.label}</span>
                          {item.badge && (
                            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                              {item.badge}
                            </span>
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
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

        {/* Navigation mobile - barre unique avec menu hamburger */}
        <div className="md:hidden pb-3">
          <div className="flex items-center justify-between">
            <div className="flex space-x-1 overflow-x-auto flex-1">
              {mainNavItems.slice(0, 3).map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-purple-100 text-purple-700 shadow-sm'
                          : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
            
            {/* Bouton "+" mobile */}
            <div className="relative ml-2">
              <ModernButton
                onClick={toggleMoreMenu}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                {showMoreMenu ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </ModernButton>

              {/* Menu mobile */}
              {showMoreMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={closeMoreMenu}
                  />
                  
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-2">
                    {/* Élément restant de la navigation principale */}
                    {mainNavItems.slice(3).map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={closeMoreMenu}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                              isActive
                                ? 'bg-purple-50 text-purple-700'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`
                          }
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </NavLink>
                      );
                    })}
                    
                    {/* Séparateur */}
                    <div className="border-t border-gray-200 my-2" />
                    
                    {/* Navigation secondaire */}
                    {secondaryNavItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={closeMoreMenu}
                          className={({ isActive }) =>
                            `relative flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                              isActive
                                ? 'bg-purple-50 text-purple-700'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`
                          }
                        >
                          <Icon className="h-4 w-4" />
                          <span className="flex-1">{item.label}</span>
                          {item.badge && (
                            <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1rem] h-4 flex items-center justify-center">
                              {item.badge}
                            </span>
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
