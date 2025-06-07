
import React, { useState, useEffect } from 'react';
import { Sun, Moon, Heart, BookOpen, Sparkles, Calendar, Target, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, useFavoriteVerses, useUserPreferences } from '@/hooks/useSupabaseData';
import { getDailyVerse, getRandomEncouragement, getDailyWelcomeMessage, getDailyChallenge } from '@/data/bibleData';
import { toast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { favoriteVerses, addFavoriteVerse, removeFavoriteVerse } = useFavoriteVerses();
  const { preferences } = useUserPreferences();
  const [dailyVerse, setDailyVerse] = useState(getDailyVerse());
  const [greeting, setGreeting] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [daysSinceStart, setDaysSinceStart] = useState(1);
  const [todayChallenge, setTodayChallenge] = useState('');

  useEffect(() => {
    // Configuration du message d'accueil selon l'heure
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Bonjour');
    } else if (hour < 18) {
      setGreeting('Bon après-midi');
    } else {
      setGreeting('Bonsoir');
    }

    // Message de bienvenue quotidien
    setWelcomeMessage(getDailyWelcomeMessage());

    // Défi du jour
    setTodayChallenge(getDailyChallenge());

    // Calculer les jours depuis l'inscription
    if (profile?.created_at) {
      const startDate = new Date(profile.created_at);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysSinceStart(diffDays);
    }

    // Vérifier les notifications intelligentes
    checkNotifications();
  }, [profile]);

  const checkNotifications = () => {
    const lastReadDate = localStorage.getItem('lastBibleRead');
    const today = new Date().toDateString();
    
    if (!lastReadDate || lastReadDate !== today) {
      const daysSinceRead = lastReadDate ? 
        Math.floor((new Date().getTime() - new Date(lastReadDate).getTime()) / (1000 * 60 * 60 * 24)) : 1;
      
      if (daysSinceRead >= 1) {
        setTimeout(() => {
          toast({
            title: "📖 Lecture biblique",
            description: daysSinceRead === 1 ? 
              "Vous n'avez pas lu la Bible aujourd'hui" : 
              `Vous n'avez pas lu la Bible depuis ${daysSinceRead} jours`,
            duration: 5000,
          });
        }, 2000);
      }
    }
  };

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
      }).catch(() => {
        navigator.clipboard.writeText(`"${dailyVerse.text}" - ${dailyVerse.book} ${dailyVerse.chapter}:${dailyVerse.verse}`);
        toast({
          description: "Verset copié dans le presse-papier",
        });
      });
    } else {
      navigator.clipboard.writeText(`"${dailyVerse.text}" - ${dailyVerse.book} ${dailyVerse.chapter}:${dailyVerse.verse}`);
      toast({
        description: "Verset copié dans le presse-papier",
      });
    }
  };

  const markBibleAsRead = () => {
    localStorage.setItem('lastBibleRead', new Date().toDateString());
    toast({
      title: "✅ Lecture marquée",
      description: "Votre lecture biblique d'aujourd'hui a été enregistrée",
    });
  };

  const isFavorite = favoriteVerses.some(fv => fv.verse_id === dailyVerse.id);

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      {/* Carte d'accueil */}
      <Card className="glass border-white/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-spiritual-500/10 to-heavenly-500/10"></div>
        <CardContent className="p-6 text-center relative z-10">
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
          <p className="text-gray-700 mb-3 font-medium">{welcomeMessage}</p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="text-spiritual-500" size={16} />
              <span className="text-spiritual-600 font-medium">
                Jour {daysSinceStart} avec nous
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="text-spiritual-500" size={16} />
              <span className="text-spiritual-600 font-medium">
                Continuez ainsi !
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verset du jour */}
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
          
          <div className="flex items-center justify-between">
            <cite className="text-sm font-medium text-spiritual-600">
              {dailyVerse.book} {dailyVerse.chapter}:{dailyVerse.verse}
            </cite>
            <Button 
              onClick={markBibleAsRead}
              size="sm"
              className="spiritual-gradient"
            >
              Marquer comme lu
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Défi du jour */}
      <Card className="glass border-white/30 border-l-4 border-l-purple-500">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Target className="text-purple-600" size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-purple-700">Défi spirituel du jour</h4>
              <p className="text-sm text-gray-700">{todayChallenge}</p>
            </div>
            <Button size="sm" className="bg-purple-500 hover:bg-purple-600 text-white">
              Commencer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass border-white/30">
          <CardContent className="p-4 text-center">
            <Heart className="mx-auto mb-2 text-red-500" size={24} />
            <div className="text-lg font-bold text-spiritual-700">{favoriteVerses.length}</div>
            <div className="text-sm text-gray-600">Versets favoris</div>
          </CardContent>
        </Card>

        <Card className="glass border-white/30">
          <CardContent className="p-4 text-center">
            <Calendar className="mx-auto mb-2 text-blue-500" size={24} />
            <div className="text-lg font-bold text-spiritual-700">{daysSinceStart}</div>
            <div className="text-sm text-gray-600">Jours actifs</div>
          </CardContent>
        </Card>

        <Card className="glass border-white/30">
          <CardContent className="p-4 text-center">
            <BookOpen className="mx-auto mb-2 text-green-500" size={24} />
            <div className="text-lg font-bold text-spiritual-700">
              {localStorage.getItem('lastBibleRead') === new Date().toDateString() ? '✅' : '📖'}
            </div>
            <div className="text-sm text-gray-600">Lecture du jour</div>
          </CardContent>
        </Card>

        <Card className="glass border-white/30">
          <CardContent className="p-4 text-center">
            <Sparkles className="mx-auto mb-2 text-purple-500" size={24} />
            <div className="text-lg font-bold text-spiritual-700">🙏</div>
            <div className="text-sm text-gray-600">En prière</div>
          </CardContent>
        </Card>
      </div>

      {/* Rappels rapides */}
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
              <Button size="sm" className="spiritual-gradient">
                Prier maintenant
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
