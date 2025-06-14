
import React from 'react';
import ModernNavigation from './ModernNavigation';

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Navigation = ({ activeSection, setActiveSection }: NavigationProps) => {
  return <ModernNavigation activeSection={activeSection} setActiveSection={setActiveSection} />;
};

export default Navigation;
