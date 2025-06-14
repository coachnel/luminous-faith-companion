
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
  const actions = [
    {
      icon: Book,
      label: 'Lire la Bible',
      action: () => {
        onNavigate('bible');
        localStorage.setItem('lastBibleRead', new Date().toDateString());
        toast({
          title: "📖 Bible ouverte",
          description: "Bonne lecture spirituelle !",
        });
      },
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: Plus,
      label: 'Nouvelle note',
      action: () => {
        onNavigate('notes');
        toast({
          title: "📝 Créer une note",
          description: "Partagez vos réflexions spirituelles",
        });
      },
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: Heart,
      label: 'Mes favoris',
      action: () => {
        const favorites = JSON.parse(localStorage.getItem('bibleFavorites') || '[]');
        if (favorites.length === 0) {
          toast({
            description: "Vous n'avez pas encore de versets favoris",
            variant: "destructive",
          });
        } else {
          toast({
            title: `⭐ ${favorites.length} favoris`,
            description: "Vos versets préférés vous attendent",
          });
        }
      },
      color: 'text-red-600 bg-red-100'
    },
    {
      icon: Calendar,
      label: 'Plans lecture',
      action: () => {
        onNavigate('plans');
        toast({
          title: "📅 Plans de lecture",
          description: "Organisez votre parcours spirituel",
        });
      },
      color: 'text-purple-600 bg-purple-100'
    },
    {
      icon: Bell,
      label: 'Notifications',
      action: () => {
        onNavigate('notifications');
        toast({
          title: "🔔 Notifications",
          description: "Configurez vos rappels spirituels",
        });
      },
      color: 'text-orange-600 bg-orange-100'
    },
    {
      icon: Search,
      label: 'Verset aléatoire',
      action: () => {
        const verse = getDailyVerse();
        toast({
          title: `${verse.book} ${verse.chapter}:${verse.verse}`,
          description: `"${verse.text.substring(0, 60)}${verse.text.length > 60 ? '...' : ''}"`,
          duration: 8000,
        });
      },
      color: 'text-indigo-600 bg-indigo-100'
    }
  ];

  return (
    <Card className="glass border-white/30 bg-white/90">
      <CardContent className="p-3 sm:p-4">
        <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">Actions rapides</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-2 sm:p-3 flex flex-col gap-1 hover:shadow-md transition-all border-gray-200 bg-white/50 min-h-[70px] sm:min-h-[90px]"
              onClick={action.action}
            >
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${action.color} flex items-center justify-center flex-shrink-0`}>
                <action.icon size={14} className="sm:w-4 sm:h-4" />
              </div>
              <span className="text-[10px] sm:text-xs font-medium text-gray-700 text-center leading-tight break-words px-1 max-w-full overflow-hidden">
                {action.label}
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
