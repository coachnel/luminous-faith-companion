
import React, { useState } from 'react';
import { Home, FileText, Users, Heart, Plus, Settings, Sparkles, Circle } from 'lucide-react';
import { ModernButton } from './ui/modern-button';
import { useAuth } from '@/hooks/useAuth';
import { useCommunityNotifications } from '@/hooks/useCommunityContent';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Badge } from '@/components/ui/badge';

type AppSection = 'dashboard' | 'prayer' | 'notes' | 'challenges' | 'reading-plans' | 'discover' | 'prayer-circles' | 'settings' | 'community' | 'testimony';

interface ModernFinanceNavigationProps {
  activeSection: AppSection;
  setActiveSection: (section: AppSection) => void;
}

interface NavItem {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  badge?: number | null;
}

const ModernFinanceNavigation: React.FC<ModernFinanceNavigationProps> = ({ activeSection, setActiveSection }) => {
  const { signOut } = useAuth();
  const { unreadCount } = useCommunityNotifications();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const mainNavItems: NavItem[] = [
    { id: 'dashboard', icon: Home, label: 'Accueil' },
    { id: 'prayer', icon: Heart, label: 'Prière' },
    { id: 'notes', icon: FileText, label: 'Notes' },
    { id: 'community', icon: Users, label: 'Communauté' },
  ];

  const secondaryNavItems: NavItem[] = [
    { id: 'discover', icon: Sparkles, label: 'Découvrir', badge: unreadCount > 0 ? unreadCount : null },
    { id: 'testimony', icon: Heart, label: 'Témoignages' },
    { id: 'challenges', icon: Circle, label: 'Défis' },
    { id: 'prayer-circles', icon: Circle, label: 'Cercle de prière' },
    { id: 'reading-plans', icon: Circle, label: 'Plans de lecture' },
    { id: 'settings', icon: Settings, label: 'Paramètres' },
  ];

  const handleNavigation = (sectionId: string) => {
    setActiveSection(sectionId as AppSection);
    setIsDrawerOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 lg:hidden">
        <div className="flex items-center justify-around h-16 px-4">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-[var(--accent-primary)] text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </button>
            );
          })}

          {/* Bouton "+" avec Drawer */}
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <button className="flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 bg-[var(--accent-primary)] text-white shadow-lg hover:opacity-90">
                <Plus className="h-5 w-5" />
                <span className="text-xs mt-1 font-medium">Plus</span>
              </button>
            </DrawerTrigger>
            
            <DrawerContent className="bg-white">
              <DrawerHeader>
                <DrawerTitle className="text-xl font-bold text-[var(--text-primary)]">
                  Sections supplémentaires
                </DrawerTitle>
                <DrawerDescription className="text-[var(--text-secondary)]">
                  Accédez à toutes les fonctionnalités de l'application
                </DrawerDescription>
              </DrawerHeader>
              
              <div className="px-4 py-2 space-y-2 max-h-96 overflow-y-auto">
                {secondaryNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                        isActive 
                          ? 'bg-[var(--accent-primary)] text-white' 
                          : 'hover:bg-gray-100 text-[var(--text-primary)]'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="flex-1 font-medium">{item.label}</span>
                      {item.badge && (
                        <Badge variant="outline" className="bg-red-500 text-white text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </button>
                  );
                })}
                
                {/* Séparateur */}
                <div className="border-t border-gray-200 my-4" />
                
                {/* Bouton de déconnexion */}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 hover:bg-red-50 text-red-600"
                >
                  <Settings className="h-5 w-5" />
                  <span className="font-medium">Déconnexion</span>
                </button>
              </div>
              
              <DrawerFooter>
                <DrawerClose asChild>
                  <ModernButton variant="outline" className="w-full">
                    Fermer
                  </ModernButton>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </nav>

      {/* Navigation desktop - barre latérale simplifiée */}
      <div className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:bg-white lg:border-r lg:border-gray-200 lg:flex-col">
        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Compagnon Spirituel
              </span>
            </div>
          </div>
          
          <nav className="flex-1 px-4 space-y-2">
            {[...mainNavItems, ...secondaryNavItems].map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    isActive 
                      ? 'bg-[var(--accent-primary)] text-white shadow-sm' 
                      : 'hover:bg-gray-100 text-[var(--text-primary)]'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <Badge variant="outline" className="bg-red-500 text-white text-xs ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 hover:bg-red-50 text-red-600"
            >
              <Settings className="h-5 w-5" />
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModernFinanceNavigation;
