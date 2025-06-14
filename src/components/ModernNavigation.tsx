
import React from 'react';
import ModernFinanceNavigation from './ModernFinanceNavigation';

interface ModernNavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const ModernNavigation = ({ activeSection, setActiveSection }: ModernNavigationProps) => {
  return <ModernFinanceNavigation activeSection={activeSection} setActiveSection={setActiveSection} />;
};

export default ModernNavigation;
