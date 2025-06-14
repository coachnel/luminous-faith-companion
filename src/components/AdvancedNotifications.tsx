
import React from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { Bell, Info } from 'lucide-react';
import NotificationSettings from './NotificationSettings';

const AdvancedNotifications = () => {
  return (
    <div className="p-4 space-y-6">
      {/* Explication */}
      <ModernCard className="border-[var(--accent-primary)]/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center flex-shrink-0">
            <Info className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              Comment ça marche ?
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Activez les notifications pour recevoir des rappels spirituels personnalisés. 
              L'application vous enverra des notifications locales sur votre appareil 
              pour vous encourager dans votre parcours spirituel quotidien.
            </p>
          </div>
        </div>
      </ModernCard>

      <ModernCard variant="elevated">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center">
            <Bell className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              Notifications & Rappels
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Configurez vos rappels spirituels personnalisés
            </p>
          </div>
        </div>

        <NotificationSettings />
      </ModernCard>
    </div>
  );
};

export default AdvancedNotifications;
