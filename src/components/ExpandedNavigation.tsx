
import React from 'react';
import ModernNavigation from './ModernNavigation';

interface ExpandedNavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const ExpandedNavigation = ({ activeSection, setActiveSection }: ExpandedNavigationProps) => {
  return <ModernNavigation activeSection={activeSection} setActiveSection={setActiveSection} />;
};

export default ExpandedNavigation;
