
import React from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { Settings, User, Bell, Palette, Shield, Info, Camera, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useSupabaseData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from './ThemeToggle';
import NotificationSettings from './NotificationSettings';
import PasswordChangeDialog from './PasswordChangeDialog';

const SettingsApp = () => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const [activeSection, setActiveSection] = React.useState('general');

  const getUserInitials = () => {
    if (profile?.name) {
      return profile.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'notifications':
        return <NotificationSettings />;
      case 'general':
      default:
        return (
          <div className="space-y-6">
            {/* Profil utilisateur */}
            <ModernCard variant="elevated">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[var(--text-primary)]">Profil utilisateur</h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Gérez vos informations personnelles
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 ring-2 ring-[var(--border-default)]">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-semibold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-lg text-[var(--text-primary)]">
                      {profile?.name || user?.email?.split('@')[0] || 'Utilisateur'}
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]">{user?.email}</div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <ModernButton variant="outline" size="sm" className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Modifier la photo
                  </ModernButton>
                  <PasswordChangeDialog>
                    <ModernButton variant="outline" size="sm" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Changer le mot de passe
                    </ModernButton>
                  </PasswordChangeDialog>
                </div>
              </div>
            </ModernCard>

            {/* Thème */}
            <ModernCard variant="elevated">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center">
                  <Palette className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[var(--text-primary)]">Apparence</h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Personnalisez l'apparence de l'application
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[var(--text-primary)]">Mode sombre</p>
                  <p className="text-sm text-[var(--text-secondary)]">Basculer entre les modes clair et sombre</p>
                </div>
                <ThemeToggle />
              </div>
            </ModernCard>

            {/* Actions */}
            <ModernCard variant="elevated">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[var(--text-primary)]">Actions</h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Gérez votre compte
                  </p>
                </div>
              </div>
              
              <ModernButton 
                variant="outline" 
                onClick={signOut}
                className="w-full border-red-500 text-red-500 hover:bg-red-50"
              >
                Se déconnecter
              </ModernButton>
            </ModernCard>
          </div>
        );
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      {/* En-tête */}
      <ModernCard variant="elevated">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Paramètres</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Personnalisez votre expérience
            </p>
          </div>
        </div>
      </ModernCard>

      {/* Navigation des paramètres */}
      <ModernCard variant="elevated">
        <div className="flex gap-2 overflow-x-auto">
          <ModernButton
            variant={activeSection === 'general' ? 'primary' : 'ghost'}
            onClick={() => setActiveSection('general')}
            className="whitespace-nowrap"
          >
            <User className="h-4 w-4 mr-2" />
            Général
          </ModernButton>
          <ModernButton
            variant={activeSection === 'notifications' ? 'primary' : 'ghost'}
            onClick={() => setActiveSection('notifications')}
            className="whitespace-nowrap"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </ModernButton>
        </div>
      </ModernCard>

      {/* Contenu */}
      {renderContent()}
    </div>
  );
};

export default SettingsApp;
