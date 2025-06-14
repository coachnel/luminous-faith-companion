
import React from 'react';
import { Palette, Sun, Moon } from 'lucide-react';
import { ModernCard } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useUserPreferences } from '@/hooks/useSupabaseData';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';

export function ThemeSettings() {
  const { preferences, loading, updatePreferences } = useUserPreferences();
  const { theme, setTheme } = useTheme();

  const handleThemeChange = async (newTheme: 'light' | 'dark') => {
    try {
      await setTheme(newTheme);
      toast.success('Thème mis à jour !');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du thème');
    }
  };

  if (loading) {
    return (
      <ModernCard>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-[var(--border-default)] rounded w-1/4"></div>
          <div className="h-20 bg-[var(--border-default)] rounded"></div>
        </div>
      </ModernCard>
    );
  }

  return (
    <ModernCard variant="elevated" className="animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center">
          <Palette className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Apparence</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Personnalisez l'apparence de l'application
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-base font-medium text-[var(--text-primary)] mb-4 block">
            Mode d'affichage
          </Label>
          <RadioGroup 
            value={theme} 
            onValueChange={(value) => handleThemeChange(value as 'light' | 'dark')}
            className="space-y-3"
          >
            {/* Mode clair */}
            <div className="flex items-center space-x-4 p-4 border border-[var(--border-default)] rounded-xl hover:bg-[var(--bg-secondary)] transition-all duration-200 cursor-pointer">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light" className="flex items-center gap-4 cursor-pointer flex-1">
                <div className="flex items-center justify-center w-12 h-12 bg-white border-2 border-gray-200 rounded-xl shadow-sm">
                  <Sun className="h-5 w-5 text-[var(--accent-primary)]" />
                </div>
                <div>
                  <div className="font-medium text-[var(--text-primary)]">Mode clair</div>
                  <div className="text-sm text-[var(--text-secondary)]">Interface lumineuse et épurée</div>
                </div>
              </Label>
            </div>

            {/* Mode sombre */}
            <div className="flex items-center space-x-4 p-4 border border-[var(--border-default)] rounded-xl hover:bg-[var(--bg-secondary)] transition-all duration-200 cursor-pointer">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark" className="flex items-center gap-4 cursor-pointer flex-1">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-900 border-2 border-gray-700 rounded-xl shadow-sm">
                  <Moon className="h-5 w-5 text-[var(--accent-primary)]" />
                </div>
                <div>
                  <div className="font-medium text-[var(--text-primary)]">Mode sombre</div>
                  <div className="text-sm text-[var(--text-secondary)]">Interface élégante pour la soirée</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Aperçu du thème */}
        <div className="space-y-3">
          <Label className="text-base font-medium text-[var(--text-primary)]">Aperçu</Label>
          <ModernCard padding="md">
            <div className="space-y-3">
              <div className="font-medium text-[var(--text-primary)]">Exemple de contenu</div>
              <div className="text-sm text-[var(--text-secondary)]">
                Voici comment apparaîtra le texte avec le thème sélectionné. 
                L'interface s'adapte automatiquement pour une expérience optimale.
              </div>
              <div className="flex gap-2">
                <ModernButton size="sm" variant="primary">Principal</ModernButton>
                <ModernButton size="sm" variant="secondary">Secondaire</ModernButton>
                <ModernButton size="sm" variant="outline">Outline</ModernButton>
              </div>
            </div>
          </ModernCard>
        </div>

        <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-default)]">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[var(--accent-primary)] flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs">💡</span>
            </div>
            <div className="text-sm">
              <strong className="text-[var(--text-primary)]">Conseil :</strong>
              <span className="text-[var(--text-secondary)] ml-1">
                Le mode sombre réduit la fatigue oculaire dans des environnements peu éclairés, 
                parfait pour la méditation et la lecture spirituelle nocturne.
              </span>
            </div>
          </div>
        </div>
      </div>
    </ModernCard>
  );
}
