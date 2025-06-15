
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
    { id: 'notes', icon: FileText, label: 'Journal' },
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
      {/* Navigation mobile - Ultra responsive pour tous les écrans */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 safe-area-inset-bottom lg:hidden">
        <div className="flex items-center justify-around px-1 py-1 xxs:px-0.5 xxs:py-0.5 xs:px-2 xs:py-1.5 sm:px-4 sm:py-2">
          {/* Items principaux - responsive */}
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`flex flex-col items-center justify-center min-h-touch-sm xxs:min-h-[28px] xs:min-h-touch sm:min-h-[48px] w-full max-w-[60px] xxs:max-w-[45px] xs:max-w-[65px] sm:max-w-[80px] rounded-md xxs:rounded-sm xs:rounded-lg sm:rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-[var(--accent-primary)] text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-3 w-3 xxs:h-2.5 xxs:w-2.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="text-[7px] xxs:text-[6px] xs:text-[8px] sm:text-xs font-medium leading-tight mt-0.5 xxs:mt-0 xs:mt-1 text-center break-words">
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* Bouton Plus - Ultra responsive */}
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <button className="flex flex-col items-center justify-center min-h-touch-sm xxs:min-h-[28px] xs:min-h-touch sm:min-h-[48px] w-full max-w-[60px] xxs:max-w-[45px] xs:max-w-[65px] sm:max-w-[80px] rounded-md xxs:rounded-sm xs:rounded-lg sm:rounded-xl transition-all duration-200 bg-[var(--accent-primary)] text-white shadow-lg hover:opacity-90">
                <Plus className="h-3 w-3 xxs:h-2.5 xxs:w-2.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="text-[7px] xxs:text-[6px] xs:text-[8px] sm:text-xs font-medium leading-tight mt-0.5 xxs:mt-0 xs:mt-1 text-center">
                  Plus
                </span>
              </button>
            </DrawerTrigger>
            
            <DrawerContent className="bg-white">
              <DrawerHeader className="pb-1 xxs:pb-0.5 xs:pb-2 sm:pb-3">
                <DrawerTitle className="text-sm xxs:text-xs xs:text-base sm:text-lg font-bold text-[var(--text-primary)]">
                  Sections supplémentaires
                </DrawerTitle>
                <DrawerDescription className="text-[10px] xxs:text-[8px] xs:text-xs sm:text-sm text-[var(--text-secondary)]">
                  Accédez à toutes les fonctionnalités
                </DrawerDescription>
              </DrawerHeader>
              
              <div className="px-1 py-0.5 xxs:px-0.5 xxs:py-0.25 xs:px-2 xs:py-1 sm:px-4 sm:py-2 space-y-0.5 xxs:space-y-0.25 xs:space-y-1 sm:space-y-2 max-h-64 xxs:max-h-48 xs:max-h-80 sm:max-h-96 overflow-y-auto">
                {secondaryNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.id)}
                      className={`w-full flex items-center gap-1 xxs:gap-0.5 xs:gap-2 sm:gap-3 px-1.5 py-1 xxs:px-1 xxs:py-0.5 xs:px-2 xs:py-1.5 sm:px-4 sm:py-3 rounded-md xxs:rounded-sm xs:rounded-lg sm:rounded-xl text-left transition-all duration-200 ${
                        isActive 
                          ? 'bg-[var(--accent-primary)] text-white' 
                          : 'hover:bg-gray-100 text-[var(--text-primary)]'
                      }`}
                    >
                      <Icon className="h-3 w-3 xxs:h-2.5 xxs:w-2.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span className="flex-1 font-medium text-xs xxs:text-[10px] xs:text-sm sm:text-base break-words overflow-hidden">{item.label}</span>
                      {item.badge && (
                        <Badge variant="outline" className="bg-red-500 text-white text-[8px] xxs:text-[7px] xs:text-[10px] sm:text-xs px-0.5 xxs:px-0.25 xs:px-1 sm:px-2 py-0 leading-none">
                          {item.badge}
                        </Badge>
                      )}
                    </button>
                  );
                })}
                
                {/* Séparateur */}
                <div className="border-t border-gray-200 my-1 xxs:my-0.5 xs:my-2 sm:my-4" />
                
                {/* Bouton de déconnexion */}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-1 xxs:gap-0.5 xs:gap-2 sm:gap-3 px-1.5 py-1 xxs:px-1 xxs:py-0.5 xs:px-2 xs:py-1.5 sm:px-4 sm:py-3 rounded-md xxs:rounded-sm xs:rounded-lg sm:rounded-xl text-left transition-all duration-200 hover:bg-red-50 text-red-600"
                >
                  <Settings className="h-3 w-3 xxs:h-2.5 xxs:w-2.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
                  <span className="font-medium text-xs xxs:text-[10px] xs:text-sm sm:text-base">Déconnexion</span>
                </button>
              </div>
              
              <DrawerFooter className="pt-1 xxs:pt-0.5 xs:pt-2 sm:pt-3">
                <DrawerClose asChild>
                  <ModernButton variant="outline" className="w-full text-xs xxs:text-[10px] xs:text-sm sm:text-base py-1 xxs:py-0.5 xs:py-2 sm:py-2.5">
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
                Compagnon
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
