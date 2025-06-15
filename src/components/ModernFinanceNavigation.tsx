
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  BookOpen, 
  Users, 
  Heart, 
  Settings,
  PenTool,
  Bell,
  Plus,
  MoreHorizontal
} from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface ModernFinanceNavigationProps {
  currentSection: string;
  onNavigate: (section: string) => void;
}

const ModernFinanceNavigation = ({ currentSection, onNavigate }: ModernFinanceNavigationProps) => {
  const isMobile = useIsMobile();
  const [visibleItemsCount, setVisibleItemsCount] = useState(6);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navigationItems = [
    { path: 'dashboard', label: 'Tableau de bord', icon: Calendar, color: 'from-blue-500 to-blue-600' },
    { path: 'discover', label: 'Découvrir', icon: BookOpen, color: 'from-green-500 to-green-600' },
    { path: 'notes', label: 'Journal', icon: PenTool, color: 'from-purple-500 to-purple-600' },
    { path: 'prayer', label: 'Prière', icon: Heart, color: 'from-rose-500 to-rose-600' },
    { path: 'challenges', label: 'Défis', icon: Bell, color: 'from-cyan-500 to-cyan-600' },
    { path: 'testimony', label: 'Témoignages', icon: Plus, color: 'from-orange-500 to-orange-600' },
    { path: 'community', label: 'Communauté', icon: Users, color: 'from-indigo-500 to-indigo-600' },
    { path: 'settings', label: 'Paramètres', icon: Settings, color: 'from-gray-500 to-gray-600' }
  ];

  // Fonction pour déterminer le nombre d'éléments visibles selon la taille d'écran
  useEffect(() => {
    const updateVisibleItems = () => {
      const width = window.innerWidth;
      
      if (width < 280) {
        setVisibleItemsCount(4);
      } else if (width < 320) {
        setVisibleItemsCount(5);
      } else if (width < 375) {
        setVisibleItemsCount(5);
      } else if (width < 640) {
        setVisibleItemsCount(6);
      } else {
        setVisibleItemsCount(7);
      }
    };

    updateVisibleItems();
    window.addEventListener('resize', updateVisibleItems);
    
    return () => window.removeEventListener('resize', updateVisibleItems);
  }, []);

  const handleNavigation = (path: string) => {
    onNavigate(path);
    setIsDrawerOpen(false);
  };

  const isActive = (path: string) => {
    return currentSection === path;
  };

  const visibleItems = navigationItems.slice(0, visibleItemsCount - 1);
  const hiddenItems = navigationItems.slice(visibleItemsCount - 1);
  const showMoreButton = hiddenItems.length > 0;

  const renderNavigationItem = (item: any, isInDrawer = false) => {
    const Icon = item.icon;
    const active = isActive(item.path);
    
    return (
      <button
        key={item.path}
        onClick={() => handleNavigation(item.path)}
        className={`
          flex ${isInDrawer ? 'flex-row items-center justify-start w-full p-3 xs:p-4 text-left' : 'flex-col items-center justify-center'} 
          ${isInDrawer ? 'hover:bg-gray-50 rounded-xl' : 'p-1 xs:p-2 rounded-xl'} transition-all duration-300
          ${!isInDrawer ? 'min-w-0 flex-1 max-w-[3.5rem] xs:max-w-[4.5rem]' : ''}
          ${active && !isInDrawer
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white transform scale-105 shadow-lg' 
            : active && isInDrawer
            ? 'bg-blue-50 text-blue-600'
            : 'text-gray-600 hover:text-gray-800'
          }
        `}
      >
        <Icon 
          className={`
            ${isInDrawer ? 'mr-3 w-4 h-4 xs:w-5 xs:h-5' : 'mb-0.5 xs:mb-1 flex-shrink-0 w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5'}
            ${active ? 'text-white' : ''}
          `}
        />
        <span 
          className={`
            ${isInDrawer ? 'text-sm xs:text-base font-medium' : 'text-[8px] xs:text-[9px] sm:text-[10px] font-medium leading-tight truncate w-full text-center'}
            ${active ? 'text-white font-semibold' : ''}
          `}
          title={item.label}
        >
          {item.label}
        </span>
      </button>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200/50 shadow-lg" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>
      <div className="max-w-md mx-auto px-1 xs:px-2 py-1 xs:py-2">
        <div className="flex justify-around items-center space-x-0.5 xs:space-x-1">
          {/* Éléments visibles */}
          {visibleItems.map((item) => renderNavigationItem(item))}
          
          {/* Bouton "Plus" avec Drawer */}
          {showMoreButton && (
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <button className="flex flex-col items-center justify-center p-1 xs:p-2 rounded-xl transition-all duration-300 min-w-0 flex-1 max-w-[3.5rem] xs:max-w-[4.5rem] text-gray-600 hover:text-gray-800 hover:bg-gray-50">
                  <MoreHorizontal className="mb-0.5 xs:mb-1 flex-shrink-0 w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
                  <span className="text-[8px] xs:text-[9px] sm:text-[10px] font-medium leading-tight truncate w-full text-center">
                    Plus
                  </span>
                </button>
              </DrawerTrigger>
              <DrawerContent className="max-h-[60vh]">
                <DrawerHeader>
                  <DrawerTitle className="text-center text-base xs:text-lg font-semibold">Plus d'options</DrawerTitle>
                </DrawerHeader>
                <div className="px-4 pb-8">
                  <div className="space-y-2">
                    {hiddenItems.map((item) => renderNavigationItem(item, true))}
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          )}
        </div>
      </div>
    </nav>
  );
};

export default ModernFinanceNavigation;
