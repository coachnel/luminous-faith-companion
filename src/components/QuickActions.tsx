import React from 'react';
import { Book, Plus, Heart, Calendar, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { getDailyVerse } from '@/lib/dailyVerse';

interface QuickActionsProps {
  onNavigate: (path: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onNavigate }) => {
  // Redesigned: visually distinctive rounded glass cards, colored gradients per action
  const actions = [
    {
      icon: Book,
      label: 'Lire la Bible',
      color: 'from-blue-500 via-blue-300 to-blue-100',
      textColor: 'text-blue-900',
      action: () => {
        onNavigate('bible');
        localStorage.setItem('lastBibleRead', new Date().toDateString());
        toast({ title: "📖 Bible ouverte", description: "Bonne lecture spirituelle !" });
      }
    },
    {
      icon: Plus,
      label: 'Nouvelle note',
      color: 'from-green-500 via-green-300 to-green-100',
      textColor: 'text-green-900',
      action: () => {
        onNavigate('notes');
        toast({ title: "📝 Créer une note", description: "Partagez vos réflexions spirituelles" });
      }
    },
    {
      icon: Heart,
      label: 'Mes favoris',
      color: 'from-pink-500 via-pink-300 to-pink-100',
      textColor: 'text-pink-900',
      action: () => {
        const favorites = JSON.parse(localStorage.getItem('bibleFavorites') || '[]');
        if (favorites.length === 0) {
          toast({ description: "Vous n'avez pas encore de versets favoris", variant: "destructive" });
        } else {
          toast({ title: `⭐ ${favorites.length} favoris`, description: "Vos versets préférés vous attendent" });
        }
      }
    },
    {
      icon: Calendar,
      label: 'Plans lecture',
      color: 'from-purple-500 via-indigo-300 to-purple-100',
      textColor: 'text-purple-900',
      action: () => {
        onNavigate('plans');
        toast({ title: "📅 Plans de lecture", description: "Organisez votre parcours spirituel" });
      }
    },
    {
      icon: Bell,
      label: 'Notifications',
      color: 'from-orange-500 via-orange-300 to-orange-100',
      textColor: 'text-orange-900',
      action: () => {
        onNavigate('notifications');
        toast({ title: "🔔 Notifications", description: "Configurez vos rappels spirituels" });
      }
    },
    {
      icon: Search,
      label: 'Verset aléatoire',
      color: 'from-indigo-500 via-indigo-300 to-indigo-100',
      textColor: 'text-indigo-900',
      action: () => {
        const verse = getDailyVerse();
        toast({
          title: `${verse.book} ${verse.chapter}:${verse.verse}`,
          description: `"${verse.text.substring(0, 60)}${verse.text.length > 60 ? '...' : ''}"`,
          duration: 8000,
        });
      }
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
      {actions.map((action, i) => (
        <button
          key={i}
          className={`rounded-2xl shadow-md glass ring-2 bg-gradient-to-br ${action.color} hover:scale-105 transition-all duration-200 px-0 pt-3 pb-2 min-h-[80px] flex flex-col items-center select-none`}
          onClick={action.action}
          type="button"
        >
          <div className="w-8 h-8 mb-1 rounded-xl bg-white/80 flex items-center justify-center shadow-sm">
            <action.icon size={16} className={action.textColor} />
          </div>
          <span className={`text-xs font-semibold ${action.textColor}`}>{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
