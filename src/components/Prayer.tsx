
import React, { useState } from 'react';
import { Heart, Clock, Users, Send, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNeonPrayerRequests } from '@/hooks/useNeonData';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import PrayerReminder from './PrayerReminder';

const Prayer = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
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
          <div 
            className="animate-spin w-8 h-8 border-4 border-t-transparent rounded-full mx-auto mb-4 loading-spinner"
            style={{ borderColor: 'var(--border-default)', borderTopColor: 'var(--accent-primary)' }}
          ></div>
          <p style={{ color: 'var(--text-secondary)' }}>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      {/* En-tête */}
      <Card 
        className="modern-card"
        style={{ 
          background: 'var(--bg-card)', 
          borderColor: 'var(--border-default)',
          color: 'var(--text-primary)'
        }}
      >
        <CardHeader>
          <CardTitle 
            className="flex items-center gap-2"
            style={{ color: 'var(--text-primary)' }}
          >
            <Heart style={{ color: 'var(--accent-primary)' }} size={24} />
            Centre de Prière
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Rappels de prière */}
      <PrayerReminder 
        reminderTimes={reminderTimes}
        onPrayerCompleted={onPrayerCompleted}
      />

      {/* Nouvelle demande de prière */}
      <Card 
        className="modern-card"
        style={{ 
          background: 'var(--bg-card)', 
          borderColor: 'var(--border-default)',
          color: 'var(--text-primary)'
        }}
      >
        <CardHeader>
          <CardTitle 
            className="flex items-center gap-2"
            style={{ color: 'var(--text-primary)' }}
          >
            <Plus style={{ color: 'var(--accent-primary)' }} size={20} />
            Nouvelle demande de prière
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Titre de votre demande..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="input-field"
            style={{
              background: 'var(--bg-secondary)',
              borderColor: 'var(--border-default)',
              color: 'var(--text-primary)'
            }}
          />
          <Textarea
            placeholder="Partagez votre demande de prière..."
            value={newPrayer}
            onChange={(e) => setNewPrayer(e.target.value)}
            className="min-h-[100px] input-field"
            style={{
              background: 'var(--bg-secondary)',
              borderColor: 'var(--border-default)',
              color: 'var(--text-primary)'
            }}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="rounded"
            />
            <label 
              htmlFor="anonymous" 
              className="text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              Poster de manière anonyme
            </label>
          </div>
          <Button 
            onClick={handleAddPrayer}
            className="w-full button-primary"
            disabled={!newTitle.trim() || !newPrayer.trim()}
            style={{
              background: 'var(--accent-primary)',
              color: 'var(--text-inverse)'
            }}
          >
            <Send size={16} className="mr-2" />
            Ajouter ma demande
          </Button>
        </CardContent>
      </Card>

      {/* Liste des demandes de prière */}
      <Card 
        className="modern-card"
        style={{ 
          background: 'var(--bg-card)', 
          borderColor: 'var(--border-default)',
          color: 'var(--text-primary)'
        }}
      >
        <CardHeader>
          <CardTitle 
            className="flex items-center gap-2"
            style={{ color: 'var(--text-primary)' }}
          >
            <Users style={{ color: 'var(--accent-primary)' }} size={20} />
            Mes demandes de prière ({prayerRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {prayerRequests.length === 0 ? (
            <p 
              className="text-center py-8"
              style={{ color: 'var(--text-secondary)' }}
            >
              Aucune demande de prière pour le moment
            </p>
          ) : (
            <div className="space-y-4">
              {prayerRequests.map((request) => (
                <div
                  key={request.id}
                  className="p-4 rounded-lg border card-content"
                  style={{
                    background: 'var(--bg-secondary)',
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span 
                        className="font-medium text-sm"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {request.author_name}
                      </span>
                      <span 
                        className="text-xs"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {new Date(request.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    {request.is_anonymous && (
                      <span 
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          background: 'var(--bg-tertiary)',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        Anonyme
                      </span>
                    )}
                  </div>
                  <h4 
                    className="font-semibold mb-2"
                    style={{ color: 'var(--accent-primary)' }}
                  >
                    {request.title}
                  </h4>
                  <p 
                    className="mb-3"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {request.content}
                  </p>
                  <div 
                    className="flex items-center gap-2 text-sm"
                    style={{ color: 'var(--text-secondary)' }}
                  >
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
