
import React, { useState, useEffect } from 'react';
import { Book, Heart, Bell, Calendar, Target, User, Sunrise, Moon, Sun } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useFavoriteVerses, useNotes } from '@/hooks/useSupabaseData';

const Dashboard = () => {
  const { user } = useAuth();
  const { favoriteVerses } = useFavoriteVerses();
  const { notes } = useNotes();
  const [dailyMessage, setDailyMessage] = useState('');
  const [daysUsing, setDaysUsing] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Messages d'accueil variés
  const welcomeMessages = [
    "Que cette journée soit bénie ! 🌟",
    "Dieu vous aime infiniment ! ❤️",
    "Sa grâce vous accompagne aujourd'hui ! ✨",
    "Cherchez d'abord le royaume de Dieu ! 🙏",
    "Il fait toutes choses nouvelles ! 🌅",
    "Sa fidélité se renouvelle chaque matin ! 🌄",
    "Vous êtes précieux à ses yeux ! 💎",
    "Il a des projets de paix pour vous ! 🕊️",
    "Marchez dans la lumière ! 💫",
    "Goûtez et voyez que l'Éternel est bon ! 🍯"
  ];

  // Défis spirituels quotidiens
  const dailyChallenges = [
    {
      title: "Prière matinale",
      description: "Commencez votre journée par 5 minutes de prière",
      icon: "🌅",
      type: "prayer"
    },
    {
      title: "Lecture inspirante",
      description: "Lisez un chapitre des Psaumes",
      icon: "📖",
      type: "reading"
    },
    {
      title: "Acte de bonté",
      description: "Faites un geste bienveillant envers quelqu'un",
      icon: "💝",
      type: "kindness"
    },
    {
      title: "Gratitude",
      description: "Notez 3 choses pour lesquelles vous êtes reconnaissant",
      icon: "🙏",
      type: "gratitude"
    },
    {
      title: "Méditation",
      description: "Méditez sur un verset biblique pendant 10 minutes",
      icon: "🧘",
      type: "meditation"
    },
    {
      title: "Pardon",
      description: "Pardonnez à quelqu'un ou demandez pardon",
      icon: "💚",
      type: "forgiveness"
    },
    {
      title: "Service",
      description: "Aidez quelqu'un dans le besoin",
      icon: "🤝",
      type: "service"
    }
  ];

  useEffect(() => {
    // Calculer le nombre de jours d'utilisation
    const firstVisit = localStorage.getItem('firstVisit');
    const today = new Date().toDateString();
    
    if (!firstVisit) {
      localStorage.setItem('firstVisit', today);
      setDaysUsing(1);
    } else {
      const start = new Date(firstVisit);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysUsing(diffDays);
    }

    // Message quotidien basé sur la date
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const messageIndex = dayOfYear % welcomeMessages.length;
    setDailyMessage(welcomeMessages[messageIndex]);

    // Mettre à jour l'heure
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getTimeGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return { text: "Bonjour", icon: <Sunrise className="text-yellow-500" size={20} /> };
    if (hour < 18) return { text: "Bon après-midi", icon: <Sun className="text-orange-500" size={20} /> };
    return { text: "Bonsoir", icon: <Moon className="text-purple-500" size={20} /> };
  };

  const greeting = getTimeGreeting();
  const userName = user?.user_metadata?.name || 'Cher utilisateur';

  // Défi du jour basé sur la date
  const today = new Date();
  const challengeIndex = today.getDate() % dailyChallenges.length;
  const todayChallenge = dailyChallenges[challengeIndex];

  const markChallengeComplete = () => {
    const completedChallenges = JSON.parse(localStorage.getItem('completedChallenges') || '{}');
    const todayKey = today.toDateString();
    completedChallenges[todayKey] = true;
    localStorage.setItem('completedChallenges', JSON.stringify(completedChallenges));
  };

  const isChallengeCompleted = () => {
    const completedChallenges = JSON.parse(localStorage.getItem('completedChallenges') || '{}');
    return completedChallenges[today.toDateString()] || false;
  };

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto">
      {/* Message d'accueil principal */}
      <Card className="glass border-white/30 animate-fade-in">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-spiritual-600 to-heavenly-600">
              {greeting.icon}
              {greeting.text}, {userName}
            </div>
            <p className="text-xl text-spiritual-700 font-medium">
              {dailyMessage}
            </p>
            <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
              <span className="bg-spiritual-100 px-3 py-1 rounded-full">
                📅 Jour {daysUsing} avec nous
              </span>
              <span className="bg-heavenly-100 px-3 py-1 rounded-full">
                🕐 {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Défi quotidien */}
      <Card className="glass border-white/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="text-green-600" size={24} />
            Défi spirituel du jour
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{todayChallenge.icon}</div>
              <div>
                <h3 className="font-semibold text-lg">{todayChallenge.title}</h3>
                <p className="text-gray-600">{todayChallenge.description}</p>
              </div>
            </div>
            <Button
              onClick={markChallengeComplete}
              disabled={isChallengeCompleted()}
              className={isChallengeCompleted() ? "bg-green-500" : "spiritual-gradient"}
            >
              {isChallengeCompleted() ? "✅ Accompli" : "Marquer comme fait"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass border-white/30">
          <CardContent className="p-4 text-center">
            <Heart className="mx-auto mb-2 text-red-500" size={32} />
            <div className="text-2xl font-bold text-spiritual-700">{favoriteVerses.length}</div>
            <div className="text-sm text-gray-600">Versets favoris</div>
          </CardContent>
        </Card>

        <Card className="glass border-white/30">
          <CardContent className="p-4 text-center">
            <Book className="mx-auto mb-2 text-blue-500" size={32} />
            <div className="text-2xl font-bold text-spiritual-700">{notes.length}</div>
            <div className="text-sm text-gray-600">Notes spirituelles</div>
          </CardContent>
        </Card>

        <Card className="glass border-white/30">
          <CardContent className="p-4 text-center">
            <Calendar className="mx-auto mb-2 text-green-500" size={32} />
            <div className="text-2xl font-bold text-spiritual-700">{daysUsing}</div>
            <div className="text-sm text-gray-600">Jours d'utilisation</div>
          </CardContent>
        </Card>
      </div>

      {/* Verset du jour */}
      <Card className="glass border-white/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="text-spiritual-600" size={24} />
            Verset du jour
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4 p-4">
            <blockquote className="text-lg italic text-gray-700 leading-relaxed">
              "Car je connais les projets que j'ai formés sur vous, dit l'Éternel, projets de paix et non de malheur, afin de vous donner un avenir et de l'espérance."
            </blockquote>
            <cite className="text-spiritual-600 font-semibold">
              — Jérémie 29:11
            </cite>
          </div>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <Card className="glass border-white/30">
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="glass border-white/30 h-16 flex flex-col gap-1">
              <Book size={20} />
              <span className="text-xs">Lire la Bible</span>
            </Button>
            <Button variant="outline" className="glass border-white/30 h-16 flex flex-col gap-1">
              <Heart size={20} />
              <span className="text-xs">Mes favoris</span>
            </Button>
            <Button variant="outline" className="glass border-white/30 h-16 flex flex-col gap-1">
              <Bell size={20} />
              <span className="text-xs">Rappels</span>
            </Button>
            <Button variant="outline" className="glass border-white/30 h-16 flex flex-col gap-1">
              <User size={20} />
              <span className="text-xs">Profil</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
