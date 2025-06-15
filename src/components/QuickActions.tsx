
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
  // Design sobre avec cartes blanches et couleurs douces
  const actions = [
    {
      icon: Book,
      label: 'Lire la Bible',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-100',
      action: () => {
        onNavigate('bible');
        localStorage.setItem('lastBibleRead', new Date().toDateString());
        toast({ title: "📖 Bible ouverte", description: "Bonne lecture spirituelle !" });
      }
    },
    {
      icon: Plus,
      label: 'Nouvelle note',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-100',
      action: () => {
        onNavigate('notes');
        toast({ title: "📝 Créer une note", description: "Partagez vos réflexions spirituelles" });
      }
    },
    {
      icon: Heart,
      label: 'Mes favoris',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600',
      borderColor: 'border-pink-100',
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
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-100',
      action: () => {
        onNavigate('plans');
        toast({ title: "📅 Plans de lecture", description: "Organisez votre parcours spirituel" });
      }
    },
    {
      icon: Bell,
      label: 'Notifications',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-100',
      action: () => {
        onNavigate('notifications');
        toast({ title: "🔔 Notifications", description: "Configurez vos rappels spirituels" });
      }
    },
    {
      icon: Search,
      label: 'Verset aléatoire',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      borderColor: 'border-indigo-100',
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
          className={`rounded-lg shadow-sm border transition-all duration-200 hover:shadow-md ${action.bgColor} ${action.borderColor} p-3 min-h-[80px] flex flex-col items-center justify-center`}
          onClick={action.action}
          type="button"
        >
          <div className={`w-8 h-8 mb-2 rounded-lg ${action.bgColor} flex items-center justify-center`}>
            <action.icon size={16} className={action.iconColor} />
          </div>
          <span className={`text-xs font-medium ${action.iconColor} text-center`}>{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
