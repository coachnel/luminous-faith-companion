
import React, { useState } from 'react';
import { Heart, Clock, Users, Send, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNeonPrayerRequests } from '@/hooks/useNeonData';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import PrayerReminder from './PrayerReminder';

const Prayer = () => {
  const { user } = useAuth();
  const { prayerRequests, loading, addPrayerRequest } = useNeonPrayerRequests();
  const [newPrayer, setNewPrayer] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [reminderTimes, setReminderTimes] = useState<string[]>(['07:00', '12:00', '19:00']);

  const handleAddPrayer = async () => {
    if (!newPrayer.trim() || !newTitle.trim()) {
      toast({
        description: "Veuillez remplir le titre et le contenu",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        description: "Vous devez être connecté pour ajouter une demande",
        variant: "destructive",
      });
      return;
    }

    try {
      await addPrayerRequest({
        title: newTitle,
        content: newPrayer,
        author_name: isAnonymous ? 'Anonyme' : (user.email || 'Utilisateur'),
        is_anonymous: isAnonymous,
      });

      setNewPrayer('');
      setNewTitle('');
      setIsAnonymous(false);
      
      toast({
        description: "Demande de prière ajoutée avec succès ✨",
      });
    } catch (error) {
      toast({
        description: "Erreur lors de l'ajout de la demande",
        variant: "destructive",
      });
    }
  };

  const onPrayerCompleted = () => {
    console.log('Prière marquée comme terminée');
    toast({
      description: "Merci pour ce temps de prière 🙏",
    });
  };

  if (loading) {
    return (
      <div className="p-4 space-y-6 max-w-4xl mx-auto">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      {/* En-tête */}
      <Card className="glass border-white/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="text-red-500" size={24} />
            Centre de Prière (Neon)
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Rappels de prière */}
      <PrayerReminder 
        reminderTimes={reminderTimes}
        onPrayerCompleted={onPrayerCompleted}
      />

      {/* Nouvelle demande de prière */}
      <Card className="glass border-white/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="text-purple-600" size={20} />
            Nouvelle demande de prière
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Titre de votre demande..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="glass border-white/30 bg-white/90"
          />
          <Textarea
            placeholder="Partagez votre demande de prière..."
            value={newPrayer}
            onChange={(e) => setNewPrayer(e.target.value)}
            className="min-h-[100px] glass border-white/30 bg-white/90"
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="anonymous" className="text-sm text-gray-600">
              Poster de manière anonyme
            </label>
          </div>
          <Button 
            onClick={handleAddPrayer}
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={!newTitle.trim() || !newPrayer.trim()}
          >
            <Send size={16} className="mr-2" />
            Ajouter ma demande
          </Button>
        </CardContent>
      </Card>

      {/* Liste des demandes de prière */}
      <Card className="glass border-white/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="text-blue-600" size={20} />
            Mes demandes de prière ({prayerRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {prayerRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Aucune demande de prière pour le moment
            </p>
          ) : (
            <div className="space-y-4">
              {prayerRequests.map((request) => (
                <div
                  key={request.id}
                  className="p-4 rounded-lg border bg-white border-gray-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{request.author_name}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(request.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    {request.is_anonymous && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        Anonyme
                      </span>
                    )}
                  </div>
                  <h4 className="font-semibold text-purple-700 mb-2">{request.title}</h4>
                  <p className="text-gray-700 mb-3">{request.content}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Heart size={14} />
                    <span>{request.prayer_count} prière(s)</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Prayer;
