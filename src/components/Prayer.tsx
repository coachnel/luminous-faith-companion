
import React, { useState } from 'react';
import { Heart, Clock, Users, Send, Plus } from 'lucide-react';
import { ModernButton } from '@/components/ui/modern-button';
import { ModernCard } from '@/components/ui/modern-card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useNeonPrayerRequests } from '@/hooks/useNeonData';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
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
      toast.error("Veuillez remplir le titre et le contenu");
      return;
    }

    if (!user) {
      toast.error("Vous devez être connecté pour ajouter une demande");
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
      
      toast.success("Demande de prière ajoutée avec succès ✨");
    } catch (error) {
      toast.error("Erreur lors de l'ajout de la demande");
    }
  };

  const onPrayerCompleted = () => {
    console.log('Prière marquée comme terminée');
    toast.success("Merci pour ce temps de prière 🙏");
  };

  if (loading) {
    return (
      <div className="p-4 space-y-6 max-w-4xl mx-auto">
        <div className="text-center">
          <div 
            className="animate-spin w-8 h-8 border-4 border-t-transparent rounded-full mx-auto mb-4"
            style={{ borderColor: 'var(--border-default)', borderTopColor: 'var(--accent-primary)' }}
          ></div>
          <p className="text-[var(--text-secondary)]">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      {/* En-tête */}
      <ModernCard variant="elevated">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Centre de Prière</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Partagez vos intentions et priez ensemble
            </p>
          </div>
        </div>
      </ModernCard>

      {/* Rappels de prière */}
      <PrayerReminder 
        reminderTimes={reminderTimes}
        onPrayerCompleted={onPrayerCompleted}
      />

      {/* Nouvelle demande de prière */}
      <ModernCard variant="elevated">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
            <Plus className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">Nouvelle demande</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Ajoutez votre intention de prière
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-[var(--text-primary)] mb-2 block">
              Titre de votre demande
            </Label>
            <Input
              placeholder="Ex: Prière pour la famille..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="bg-[var(--bg-secondary)] border-[var(--border-default)] text-[var(--text-primary)]"
            />
          </div>
          
          <div>
            <Label className="text-sm font-medium text-[var(--text-primary)] mb-2 block">
              Votre demande
            </Label>
            <Textarea
              placeholder="Partagez votre demande de prière..."
              value={newPrayer}
              onChange={(e) => setNewPrayer(e.target.value)}
              className="min-h-[100px] bg-[var(--bg-secondary)] border-[var(--border-default)] text-[var(--text-primary)] resize-none"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium text-[var(--text-primary)]">
                Poster de manière anonyme
              </Label>
              <p className="text-xs text-[var(--text-secondary)]">
                Votre nom ne sera pas affiché
              </p>
            </div>
            <Switch
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
          </div>
          
          <ModernButton 
            onClick={handleAddPrayer}
            className="w-full"
            disabled={!newTitle.trim() || !newPrayer.trim()}
          >
            <Send className="h-4 w-4 mr-2" />
            Ajouter ma demande
          </ModernButton>
        </div>
      </ModernCard>

      {/* Liste des demandes de prière */}
      <ModernCard variant="elevated">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">Mes demandes</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              {prayerRequests.length} demande(s) de prière
            </p>
          </div>
        </div>
        
        {prayerRequests.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-[var(--text-secondary)] mx-auto mb-4" />
            <p className="text-[var(--text-secondary)] mb-2">Aucune demande de prière</p>
            <p className="text-sm text-[var(--text-secondary)]">
              Commencez par ajouter votre première intention
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {prayerRequests.map((request) => (
              <div
                key={request.id}
                className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-[var(--text-primary)]">
                      {request.author_name}
                    </span>
                    <span className="text-xs text-[var(--text-secondary)]">
                      {new Date(request.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  {request.is_anonymous && (
                    <span className="text-xs px-2 py-1 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
                      Anonyme
                    </span>
                  )}
                </div>
                
                <h4 className="font-semibold mb-2 text-[var(--accent-primary)]">
                  {request.title}
                </h4>
                
                <p className="text-[var(--text-primary)] mb-3 leading-relaxed">
                  {request.content}
                </p>
                
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <Heart className="h-4 w-4" />
                  <span>{request.prayer_count} prière(s)</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </ModernCard>
    </div>
  );
};

export default Prayer;
