
import React, { useState, useEffect } from 'react';
import { Sparkles, Sun, Moon } from 'lucide-react';
import Navigation from '../components/Navigation';
import DailyVerse from '../components/DailyVerse';
import PrayerReminder from '../components/PrayerReminder';
import BibleReader from '../components/BibleReader';
import NotesJournal from '../components/NotesJournal';
import UserProfile from '../components/UserProfile';
import { useUserProfile, useNotes, useFavoriteVerses } from '../hooks/useLocalStorage';
import { getDailyVerse, getRandomEncouragement } from '../data/bibleVerses';
import { BibleVerse, Note } from '../types';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [profile, setProfile] = useUserProfile();
  const [notes, setNotes] = useNotes();
  const [favoriteVerses, setFavoriteVerses] = useFavoriteVerses();
  const [dailyVerse, setDailyVerse] = useState<BibleVerse>(getDailyVerse());
  const [greeting, setGreeting] = useState('');
  const [encouragement, setEncouragement] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Bonjour');
    } else if (hour < 18) {
      setGreeting('Bon après-midi');
    } else {
      setGreeting('Bonsoir');
    }

    // Fixer le message d'encouragement une seule fois
    setEncouragement(getRandomEncouragement());

    // Mettre à jour les statistiques
    setProfile(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        lastActivity: new Date(),
      },
    }));
  }, [setProfile]);

  const handleAddToFavorites = (verse: BibleVerse) => {
    const isFavorite = favoriteVerses.includes(verse.id);
    if (isFavorite) {
      setFavoriteVerses(prev => prev.filter(id => id !== verse.id));
      setProfile(prev => ({
        ...prev,
        favoriteVerses: prev.favoriteVerses.filter(id => id !== verse.id),
      }));
      toast({
        description: "Verset retiré des favoris",
      });
    } else {
      setFavoriteVerses(prev => [...prev, verse.id]);
      setProfile(prev => ({
        ...prev,
        favoriteVerses: [...prev.favoriteVerses, verse.id],
        stats: {
          ...prev.stats,
          versesRead: prev.stats.versesRead + 1,
        },
      }));
      toast({
        description: "Verset ajouté aux favoris ❤️",
      });
    }
  };

  const handleAddNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes(prev => [newNote, ...prev]);
    setProfile(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        notesWritten: prev.stats.notesWritten + 1,
      },
    }));
    toast({
      description: "Note sauvegardée avec succès ✨",
    });
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    toast({
      description: "Note supprimée",
    });
  };

  const handlePrayerCompleted = () => {
    toast({
      description: "Que Dieu bénisse ce moment de prière 🙏",
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-4 pb-20">
            {/* Header avec hauteur fixe */}
            <div className="glass rounded-2xl p-6 text-center h-auto">
              <div className="flex items-center justify-center gap-2 mb-4 h-8">
                {new Date().getHours() < 18 ? <Sun className="text-yellow-500" size={24} /> : <Moon className="text-blue-500" size={24} />}
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-spiritual-600 to-heavenly-600">
                  {greeting}, {profile.name} !
                </h1>
              </div>
              <div className="h-12 flex items-center justify-center">
                <p className="text-gray-600">{encouragement}</p>
              </div>
              <div className="flex items-center justify-center gap-2 h-6">
                <Sparkles className="text-spiritual-500" size={16} />
                <span className="text-sm text-spiritual-600 font-medium">
                  Jour {profile.stats.daysActive} de votre parcours spirituel
                </span>
              </div>
            </div>

            {/* Verset du jour avec hauteur minimale fixe */}
            <div className="w-full min-h-[180px]">
              <DailyVerse
                verse={dailyVerse}
                onAddToFavorites={handleAddToFavorites}
                isFavorite={favoriteVerses.includes(dailyVerse.id)}
              />
            </div>

            {/* Rappels de prière */}
            <div className="w-full">
              <PrayerReminder
                reminderTimes={profile.preferences.reminderTimes.prayer}
                onPrayerCompleted={handlePrayerCompleted}
              />
            </div>

            {/* Statistiques avec hauteur fixe */}
            <div className="glass rounded-2xl p-6 h-auto">
              <h3 className="font-semibold mb-4 flex items-center gap-2 h-6">
                <Sparkles className="text-spiritual-500" size={18} />
                Statistiques du jour
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center h-16">
                <div className="flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold text-spiritual-600">{profile.stats.versesRead}</div>
                  <div className="text-xs text-gray-600">Versets</div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold text-green-600">{profile.favoriteVerses.length}</div>
                  <div className="text-xs text-gray-600">Favoris</div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold text-blue-600">{notes.length}</div>
                  <div className="text-xs text-gray-600">Notes</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'bible':
        return (
          <BibleReader
            onAddToFavorites={handleAddToFavorites}
            favoriteVerses={favoriteVerses}
          />
        );

      case 'notes':
        return (
          <NotesJournal
            notes={notes}
            onAddNote={handleAddNote}
            onDeleteNote={handleDeleteNote}
          />
        );

      case 'profile':
        return (
          <UserProfile
            profile={profile}
            onUpdateProfile={(updates) => setProfile(prev => ({ ...prev, ...updates }))}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-heavenly-50 via-spiritual-50 to-purple-50">
      <div className="max-w-md mx-auto pt-6 px-4">
        {renderContent()}
      </div>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
