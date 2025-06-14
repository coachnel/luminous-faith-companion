
import React from 'react';
import ModernDashboard from './ModernDashboard';

interface DashboardProps {
  onNavigate: (path: string) => void;
}

const RealTimeDashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return <ModernDashboard onNavigate={onNavigate} />;
};

export default RealTimeDashboard;
