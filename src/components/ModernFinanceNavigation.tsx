
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
      {/* Navigation mobile - Ultra responsive */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 lg:hidden">
        <div className="flex items-center justify-around h-14 xxs:h-12 px-1 xxs:px-2 xs:px-4">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`flex flex-col items-center justify-center w-10 h-10 xxs:w-8 xxs:h-8 xs:w-12 xs:h-12 rounded-lg xxs:rounded-md xs:rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-[var(--accent-primary)] text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4 xxs:h-3 xxs:w-3 xs:h-5 xs:w-5" />
                <span className="text-[8px] xxs:text-[7px] xs:text-xs mt-0.5 xxs:mt-0 xs:mt-1 font-medium leading-none">
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* Bouton "+" avec Drawer - Ultra responsive */}
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <button className="flex flex-col items-center justify-center w-10 h-10 xxs:w-8 xxs:h-8 xs:w-12 xs:h-12 rounded-lg xxs:rounded-md xs:rounded-xl transition-all duration-200 bg-[var(--accent-primary)] text-white shadow-lg hover:opacity-90">
                <Plus className="h-4 w-4 xxs:h-3 xxs:w-3 xs:h-5 xs:w-5" />
                <span className="text-[8px] xxs:text-[7px] xs:text-xs mt-0.5 xxs:mt-0 xs:mt-1 font-medium leading-none">
                  Plus
                </span>
              </button>
            </DrawerTrigger>
            
            <DrawerContent className="bg-white">
              <DrawerHeader className="pb-2 xxs:pb-1">
                <DrawerTitle className="text-lg xxs:text-base xs:text-xl font-bold text-[var(--text-primary)]">
                  Sections supplémentaires
                </DrawerTitle>
                <DrawerDescription className="text-xs xxs:text-[10px] xs:text-sm text-[var(--text-secondary)]">
                  Accédez à toutes les fonctionnalités de l'application
                </DrawerDescription>
              </DrawerHeader>
              
              <div className="px-2 xxs:px-1 xs:px-4 py-1 xxs:py-0.5 xs:py-2 space-y-1 xxs:space-y-0.5 xs:space-y-2 max-h-80 xxs:max-h-64 xs:max-h-96 overflow-y-auto">
                {secondaryNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.id)}
                      className={`w-full flex items-center gap-2 xxs:gap-1 xs:gap-3 px-2 xxs:px-1 xs:px-4 py-2 xxs:py-1.5 xs:py-3 rounded-lg xxs:rounded-md xs:rounded-xl text-left transition-all duration-200 ${
                        isActive 
                          ? 'bg-[var(--accent-primary)] text-white' 
                          : 'hover:bg-gray-100 text-[var(--text-primary)]'
                      }`}
                    >
                      <Icon className="h-4 w-4 xxs:h-3 xxs:w-3 xs:h-5 xs:w-5 flex-shrink-0" />
                      <span className="flex-1 font-medium text-sm xxs:text-xs xs:text-base break-words">{item.label}</span>
                      {item.badge && (
                        <Badge variant="outline" className="bg-red-500 text-white text-[10px] xxs:text-[8px] xs:text-xs px-1 xxs:px-0.5 xs:px-2">
                          {item.badge}
                        </Badge>
                      )}
                    </button>
                  );
                })}
                
                {/* Séparateur */}
                <div className="border-t border-gray-200 my-2 xxs:my-1 xs:my-4" />
                
                {/* Bouton de déconnexion */}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 xxs:gap-1 xs:gap-3 px-2 xxs:px-1 xs:px-4 py-2 xxs:py-1.5 xs:py-3 rounded-lg xxs:rounded-md xs:rounded-xl text-left transition-all duration-200 hover:bg-red-50 text-red-600"
                >
                  <Settings className="h-4 w-4 xxs:h-3 xxs:w-3 xs:h-5 xs:w-5" />
                  <span className="font-medium text-sm xxs:text-xs xs:text-base">Déconnexion</span>
                </button>
              </div>
              
              <DrawerFooter className="pt-2 xxs:pt-1">
                <DrawerClose asChild>
                  <ModernButton variant="outline" className="w-full text-sm xxs:text-xs xs:text-base py-2 xxs:py-1.5 xs:py-2.5">
                    Fermer
                  </ModernButton>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </nav>

      {/* Navigation desktop - barre latérale responsive */}
      <div className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 xl:w-72 lg:bg-white lg:border-r lg:border-gray-200 lg:flex-col">
        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="p-4 xl:p-6">
            <div className="flex items-center space-x-2 xl:space-x-3">
              <div className="w-6 h-6 xl:w-8 xl:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Heart className="h-3 w-3 xl:h-5 xl:w-5 text-white" />
              </div>
              <span className="text-lg xl:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent break-words">
                Compagnon Spirituel
              </span>
            </div>
          </div>
          
          <nav className="flex-1 px-2 xl:px-4 space-y-1 xl:space-y-2">
            {[...mainNavItems, ...secondaryNavItems].map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full flex items-center gap-2 xl:gap-3 px-2 xl:px-4 py-2 xl:py-3 rounded-lg xl:rounded-xl text-left transition-all duration-200 ${
                    isActive 
                      ? 'bg-[var(--accent-primary)] text-white shadow-sm' 
                      : 'hover:bg-gray-100 text-[var(--text-primary)]'
                  }`}
                >
                  <Icon className="h-4 w-4 xl:h-5 xl:w-5" />
                  <span className="font-medium text-sm xl:text-base break-words">{item.label}</span>
                  {item.badge && (
                    <Badge variant="outline" className="bg-red-500 text-white text-xs ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>
          
          <div className="p-2 xl:p-4 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 xl:gap-3 px-2 xl:px-4 py-2 xl:py-3 rounded-lg xl:rounded-xl text-left transition-all duration-200 hover:bg-red-50 text-red-600"
            >
              <Settings className="h-4 w-4 xl:h-5 xl:w-5" />
              <span className="font-medium text-sm xl:text-base">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModernFinanceNavigation;
