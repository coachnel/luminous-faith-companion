
import React from 'react';
import ModernFinanceNavigation from './ModernFinanceNavigation';

interface ExpandedNavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const ExpandedNavigation = ({ activeSection, setActiveSection }: ExpandedNavigationProps) => {
  return <ModernFinanceNavigation activeSection={activeSection} setActiveSection={setActiveSection} />;
};

export default ExpandedNavigation;
