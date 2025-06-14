
// Dashboard component with all features integrated
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useSupabaseData';
import { useNeonBible } from '@/hooks/useNeonBible';
import { BookOpen, Settings, LogOut, User, Home, BookMarked, PenSquare, Heart, PieChart, Calendar, Info } from 'lucide-react';
import { useNeonNotes } from '@/hooks/useNeonData';
import { EnhancedReadingProgress } from './EnhancedReadingProgress';
import { EnhancedChallengesSection } from './EnhancedChallengesSection';
import { ThemeSettings } from './ThemeSettings';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { notes } = useNeonNotes();
  const { books, totalBooks } = useNeonBible();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">BibleApp</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="font-medium">{profile?.name || user?.email}</div>
                <div className="text-xs text-gray-500">Connecté</div>
              </div>
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url || ''} />
                <AvatarFallback>{(profile?.name || user?.email || '?').charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
            <TabsTrigger value="bible">Bible</TabsTrigger>
            <TabsTrigger value="reading">Lecture</TabsTrigger>
            <TabsTrigger value="challenges">Défis</TabsTrigger>
            <TabsTrigger value="prayer">Prière</TabsTrigger>
            <TabsTrigger value="settings">Réglages</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="space-y-6">
              {/* Explication */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-600" />
                    Comment ça marche ?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">
                    Bienvenue sur votre tableau de bord spirituel ! Explorez la Bible, suivez vos plans de lecture, 
                    créez des défis personnels et partagez vos intentions de prière avec la communauté. 
                    Chaque section vous aide à enrichir votre vie spirituelle de manière organisée et motivante.
                  </p>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Bible
                    </CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalBooks} livres</div>
                    <p className="text-xs text-muted-foreground">
                      {books.filter(b => b.testament === 'old').length} AT + {books.filter(b => b.testament === 'new').length} NT
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Notes
                    </CardTitle>
                    <PenSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{notes.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Notes personnelles
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Activité
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Aujourd'hui</div>
                    <p className="text-xs text-muted-foreground">
                      {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bible">
            <div className="space-y-4">
              {/* Explication */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-600" />
                    Comment ça marche ?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">
                    Explorez l'ensemble des livres bibliques organisés par testament. 
                    Cliquez sur un livre pour commencer votre lecture et découvrir les richesses de la Parole de Dieu. 
                    Votre progression est automatiquement sauvegardée.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Explorer la Bible</CardTitle>
                  <CardDescription>
                    Parcourez les livres et chapitres de la Bible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {books.slice(0, 8).map((book) => (
                      <Button key={book.id} variant="outline" className="justify-start">
                        <BookMarked className="mr-2 h-4 w-4" />
                        {book.name}
                      </Button>
                    ))}
                    <Button variant="secondary">
                      Voir tous les livres
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reading">
            <EnhancedReadingProgress />
          </TabsContent>

          <TabsContent value="challenges">
            <EnhancedChallengesSection />
          </TabsContent>

          <TabsContent value="prayer">
            <div className="space-y-4">
              {/* Explication */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-600" />
                    Comment ça marche ?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">
                    Créez et gérez vos demandes de prière personnelles. Partagez vos intentions avec la communauté 
                    ou gardez-les privées. Suivez l'évolution de vos prières et encouragez d'autres croyants 
                    en priant pour leurs demandes.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Demandes de prière</CardTitle>
                  <CardDescription>
                    Gérez vos demandes de prière personnelles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Contenu des prières à venir...</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              {/* Explication */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-600" />
                    Comment ça marche ?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">
                    Personnalisez votre expérience spirituelle en configurant vos préférences de lecture, 
                    votre thème visuel et vos informations de profil. Adaptez l'application à vos besoins 
                    pour une utilisation optimale.
                  </p>
                </CardContent>
              </Card>

              <ThemeSettings />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profil utilisateur
                  </CardTitle>
                  <CardDescription>
                    Gérez vos informations personnelles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={profile?.avatar_url || ''} />
                        <AvatarFallback>{(profile?.name || user?.email || '?').charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-lg">{profile?.name || 'Utilisateur'}</div>
                        <div className="text-sm text-gray-500">{user?.email}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">Modifier le profil</Button>
                      <Button variant="outline">Changer le mot de passe</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
