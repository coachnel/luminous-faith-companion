
import React, { useState, useEffect } from 'react';
import { Sun, Moon, Heart, BookOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, useFavoriteVerses, useUserPreferences } from '@/hooks/useSupabaseData';
import { getDailyVerse, getRandomEncouragement } from '@/data/bibleVerses';
import { toast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { favoriteVerses, addFavoriteVerse, removeFavoriteVerse } = useFavoriteVerses();
  const { preferences } = useUserPreferences();
  const [dailyVerse, setDailyVerse] = useState(getDailyVerse());
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

    setEncouragement(getRandomEncouragement());
  }, []);

  const handleToggleFavorite = async () => {
    try {
      const isFavorite = favoriteVerses.some(fv => fv.verse_id === dailyVerse.id);
      
      if (isFavorite) {
        await removeFavoriteVerse(dailyVerse.id);
        toast({
          description: "Verset retiré des favoris",
        });
      } else {
        await addFavoriteVerse(dailyVerse);
        toast({
          description: "Verset ajouté aux favoris ❤️",
        });
      }
    } catch (error) {
      toast({
        description: "Erreur lors de la sauvegarde",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Verset du jour',
        text: `"${dailyVerse.text}" - ${dailyVerse.book} ${dailyVerse.chapter}:${dailyVerse.verse}`,
      });
    } else {
      navigator.clipboard.writeText(`"${dailyVerse.text}" - ${dailyVerse.book} ${dailyVerse.chapter}:${dailyVerse.verse}`);
      toast({
        description: "Verset copié dans le presse-papier",
      });
    }
  };

  const isFavorite = favoriteVerses.some(fv => fv.verse_id === dailyVerse.id);

  return (
    <div className="p-4 space-y-4">
      {/* Greeting Card */}
      <Card className="glass border-white/30">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            {new Date().getHours() < 18 ? (
              <Sun className="text-yellow-500" size={24} />
            ) : (
              <Moon className="text-blue-500" size={24} />
            )}
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-spiritual-600 to-heavenly-600">
              {greeting}, {profile?.name || 'Bien-aimé(e)'} !
            </h2>
          </div>
          <p className="text-gray-600 mb-3">{encouragement}</p>
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="text-spiritual-500" size={16} />
            <span className="text-sm text-spiritual-600 font-medium">
              Que cette journée soit bénie
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Daily Verse Card */}
      <Card className="glass border-white/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-spiritual-500/10 to-heavenly-500/10"></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-spiritual-600 to-heavenly-600">
              Verset du jour ✨
            </h3>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleFavorite}
                className={`rounded-full ${isFavorite ? 'text-red-500' : 'text-gray-500'}`}
              >
                <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="rounded-full text-gray-500 hover:text-spiritual-600"
              >
                📤
              </Button>
            </div>
          </div>
          
          <blockquote className="text-lg italic text-gray-700 leading-relaxed mb-4">
            "{dailyVerse.text}"
          </blockquote>
          
          <cite className="text-sm font-medium text-spiritual-600">
            {dailyVerse.book} {dailyVerse.chapter}:{dailyVerse.verse}
          </cite>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="glass border-white/30">
          <CardContent className="p-4 text-center">
            <BookOpen className="mx-auto mb-2 text-spiritual-600" size={24} />
            <div className="text-lg font-bold text-spiritual-700">{favoriteVerses.length}</div>
            <div className="text-sm text-gray-600">Versets favoris</div>
          </CardContent>
        </Card>

        <Card className="glass border-white/30">
          <CardContent className="p-4 text-center">
            <Heart className="mx-auto mb-2 text-red-500" size={24} />
            <div className="text-lg font-bold text-spiritual-700">1</div>
            <div className="text-sm text-gray-600">Jour actif</div>
          </CardContent>
        </Card>
      </div>

      {/* Prayer Reminder */}
      {preferences?.notification_preferences?.prayerReminder && (
        <Card className="glass border-white/30 border-l-4 border-l-spiritual-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-spiritual-100 flex items-center justify-center">
                <span className="text-spiritual-600">🙏</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-spiritual-700">Temps de prière</h4>
                <p className="text-sm text-gray-600">Prenez un moment pour vous connecter avec Dieu</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reading Reminder */}
      {preferences?.notification_preferences?.readingReminder && (
        <Card className="glass border-white/30 border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <BookOpen className="text-blue-600" size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-blue-700">Lecture biblique</h4>
                <p className="text-sm text-gray-600">Continuez votre parcours dans la Parole</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
