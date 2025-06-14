
// Dashboard component with all features integrated
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModernButton } from '@/components/ui/modern-button';
import { ModernCard } from '@/components/ui/modern-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useSupabaseData';
import { useNeonBible } from '@/hooks/useNeonBible';
import { BookOpen, Settings, LogOut, User, Home, BookMarked, PenSquare, Heart, PieChart, Calendar, Info } from 'lucide-react';
import { useNeonNotes } from '@/hooks/useNeonData';
import { EnhancedReadingProgress } from './EnhancedReadingProgress';
import { EnhancedChallengesSection } from './EnhancedChallengesSection';
import { ThemeSettings } from './ThemeSettings';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { notes } = useNeonNotes();
  const { books, totalBooks } = useNeonBible();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen" style={{ background: `var(--bg-primary)` }}>
      <header className="border-b border-[var(--border-default)] bg-[var(--bg-card)] backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl text-[var(--text-primary)]">BibleApp</span>
              <p className="text-xs text-[var(--text-secondary)]">Votre compagnon spirituel</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            <ModernButton variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </ModernButton>
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="font-medium text-[var(--text-primary)]">{profile?.name || user?.email}</div>
                <div className="text-xs text-[var(--text-secondary)]">Connecté</div>
              </div>
              <Avatar className="h-9 w-9 ring-2 ring-[var(--border-default)]">
                <AvatarImage src={profile?.avatar_url || ''} />
                <AvatarFallback className="bg-[var(--accent-primary)] text-white">
                  {(profile?.name || user?.email || '?').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-[var(--bg-card)] border border-[var(--border-default)]">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-[var(--accent-primary)] data-[state=active]:text-white">Accueil</TabsTrigger>
            <TabsTrigger value="bible" className="data-[state=active]:bg-[var(--accent-primary)] data-[state=active]:text-white">Bible</TabsTrigger>
            <TabsTrigger value="reading" className="data-[state=active]:bg-[var(--accent-primary)] data-[state=active]:text-white">Lecture</TabsTrigger>
            <TabsTrigger value="challenges" className="data-[state=active]:bg-[var(--accent-primary)] data-[state=active]:text-white">Défis</TabsTrigger>
            <TabsTrigger value="prayer" className="data-[state=active]:bg-[var(--accent-primary)] data-[state=active]:text-white">Prière</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-[var(--accent-primary)] data-[state=active]:text-white">Réglages</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="space-y-6">
              {/* Explication */}
              <ModernCard variant="elevated" className="border-[var(--accent-primary)]/20 animate-slide-up">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center flex-shrink-0">
                    <Info className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                      Comment ça marche ?
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      Bienvenue sur votre tableau de bord spirituel ! Explorez la Bible, suivez vos plans de lecture, 
                      créez des défis personnels et partagez vos intentions de prière avec la communauté. 
                      Chaque section vous aide à enrichir votre vie spirituelle de manière organisée et motivante.
                    </p>
                  </div>
                </div>
              </ModernCard>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <ModernCard variant="elevated" className="animate-slide-up">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[var(--text-primary)]">{totalBooks}</div>
                      <div className="text-sm text-[var(--text-secondary)]">livres</div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-1">Bible complète</h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {books.filter(b => b.testament === 'old').length} AT + {books.filter(b => b.testament === 'new').length} NT
                  </p>
                </ModernCard>
                
                <ModernCard variant="elevated" className="animate-slide-up">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center">
                      <PenSquare className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[var(--text-primary)]">{notes.length}</div>
                      <div className="text-sm text-[var(--text-secondary)]">notes</div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-1">Notes personnelles</h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Vos réflexions spirituelles
                  </p>
                </ModernCard>
                
                <ModernCard variant="elevated" className="animate-slide-up">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-[var(--text-primary)]">Aujourd'hui</div>
                      <div className="text-sm text-[var(--text-secondary)]">activité</div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-1">Votre journée</h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                </ModernCard>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bible">
            <div className="space-y-6">
              {/* Explication */}
              <ModernCard variant="elevated" className="border-[var(--accent-primary)]/20 animate-slide-up">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center flex-shrink-0">
                    <Info className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                      Comment ça marche ?
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      Explorez l'ensemble des livres bibliques organisés par testament. 
                      Cliquez sur un livre pour commencer votre lecture et découvrir les richesses de la Parole de Dieu. 
                      Votre progression est automatiquement sauvegardée.
                    </p>
                  </div>
                </div>
              </ModernCard>

              <ModernCard variant="elevated" className="animate-slide-up">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--text-primary)]">Explorer la Bible</h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Parcourez les livres et chapitres de la Bible
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {books.slice(0, 8).map((book) => (
                    <ModernButton key={book.id} variant="outline" className="justify-start h-auto p-3">
                      <BookMarked className="mr-2 h-4 w-4 text-[var(--accent-primary)]" />
                      <span className="text-sm">{book.name}</span>
                    </ModernButton>
                  ))}
                  <ModernButton variant="secondary" className="h-auto p-3">
                    <span className="text-sm">Voir tous les livres</span>
                  </ModernButton>
                </div>
              </ModernCard>
            </div>
          </TabsContent>

          <TabsContent value="reading">
            <div className="animate-slide-up">
              <EnhancedReadingProgress />
            </div>
          </TabsContent>

          <TabsContent value="challenges">
            <div className="animate-slide-up">
              <EnhancedChallengesSection />
            </div>
          </TabsContent>

          <TabsContent value="prayer">
            <div className="space-y-6">
              {/* Explication */}
              <ModernCard variant="elevated" className="border-[var(--accent-primary)]/20 animate-slide-up">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center flex-shrink-0">
                    <Info className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                      Comment ça marche ?
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      Créez et gérez vos demandes de prière personnelles. Partagez vos intentions avec la communauté 
                      ou gardez-les privées. Suivez l'évolution de vos prières et encouragez d'autres croyants 
                      en priant pour leurs demandes.
                    </p>
                  </div>
                </div>
              </ModernCard>

              <ModernCard variant="elevated" className="animate-slide-up">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--text-primary)]">Demandes de prière</h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Gérez vos demandes de prière personnelles
                    </p>
                  </div>
                </div>
                <p className="text-[var(--text-secondary)]">Contenu des prières à venir...</p>
              </ModernCard>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6 animate-slide-up">
              <ThemeSettings />
              
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
                      <AvatarImage src={profile?.avatar_url || ''} />
                      <AvatarFallback className="bg-[var(--accent-primary)] text-white text-xl">
                        {(profile?.name || user?.email || '?').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-lg text-[var(--text-primary)]">{profile?.name || 'Utilisateur'}</div>
                      <div className="text-sm text-[var(--text-secondary)]">{user?.email}</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <ModernButton variant="outline" size="sm">Modifier le profil</ModernButton>
                    <ModernButton variant="outline" size="sm">Changer le mot de passe</ModernButton>
                  </div>
                </div>
              </ModernCard>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
