
import React, { useState } from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen, AlertTriangle } from 'lucide-react';
import BibleLite from './BibleLite';

const EnhancedBibleView = () => {
  const [useLiteVersion, setUseLiteVersion] = useState(false);

  if (useLiteVersion) {
    return <BibleLite />;
  }

  return (
    <div 
      className="p-4 space-y-6 max-w-4xl mx-auto min-h-screen"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* En-tête */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--accent-primary)' }}
          >
            <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] truncate">Section Bible</h1>
            <p className="text-sm text-[var(--text-secondary)] truncate">
              Explorez les Écritures Saintes
            </p>
          </div>
        </div>
      </ModernCard>

      {/* Alerte de maintenance */}
      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>Maintenance en cours :</strong> La version complète de la Bible est temporairement indisponible 
          en raison de problèmes de données. Nous travaillons sur une solution.
        </AlertDescription>
      </Alert>

      {/* Options disponibles */}
      <div className="grid gap-4 md:grid-cols-2">
        <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)] p-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Version Lite</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Nouveau Testament complet avec suivi de progression et fonctionnalités de base
            </p>
            <ModernButton onClick={() => setUseLiteVersion(true)} className="w-full">
              Accéder à la Version Lite
            </ModernButton>
          </div>
        </ModernCard>

        <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)] p-6 opacity-50">
          <div className="text-center">
            <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Version Complète</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Bible complète avec Ancien et Nouveau Testament (en maintenance)
            </p>
            <ModernButton disabled className="w-full">
              Bientôt disponible
            </ModernButton>
          </div>
        </ModernCard>
      </div>

      {/* Informations sur la version Lite */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Fonctionnalités de la Version Lite</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium text-[var(--text-primary)]">✅ Inclus :</h4>
              <ul className="text-sm text-[var(--text-secondary)] space-y-1">
                <li>• Nouveau Testament complet (27 livres)</li>
                <li>• Navigation par livre et chapitre</li>
                <li>• Suivi de progression de lecture</li>
                <li>• Marquage des chapitres lus</li>
                <li>• Interface responsive et moderne</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-[var(--text-primary)]">🔄 À venir :</h4>
              <ul className="text-sm text-[var(--text-secondary)] space-y-1">
                <li>• Ancien Testament</li>
                <li>• Recherche avancée</li>
                <li>• Annotations personnelles</li>
                <li>• Multiples versions</li>
                <li>• Partage de versets</li>
              </ul>
            </div>
          </div>
        </div>
      </ModernCard>
    </div>
  );
};

export default EnhancedBibleView;
