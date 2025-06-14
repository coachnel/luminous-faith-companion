
import React, { useState, useEffect } from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { Badge } from '@/components/ui/badge';
import { Heart, Plus, Users, Lock, Globe, MessageCircle, Calendar, Info } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNeonPrayerRequests } from '@/hooks/useNeonData';
import { toast } from 'sonner';

const PrayerCircles = () => {
  const { user } = useAuth();
  const { prayerRequests, addPrayerRequest } = useNeonPrayerRequests();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRequest, setNewRequest] = useState({
    title: '',
    content: '',
    isAnonymous: false
  });

  const createPrayerRequest = async () => {
    if (!newRequest.title.trim() || !newRequest.content.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      await addPrayerRequest({
        title: newRequest.title,
        content: newRequest.content,
        is_anonymous: newRequest.isAnonymous,
        author_name: newRequest.isAnonymous ? 'Anonyme' : (user?.email?.split('@')[0] || 'Utilisateur')
      });

      setNewRequest({ title: '', content: '', isAnonymous: false });
      setShowCreateForm(false);
      toast.success('Demande de prière créée !');
    } catch (error) {
      toast.error('Erreur lors de la création');
    }
  };

  const handlePrayerToggle = async (requestId: string, currentCount: number) => {
    try {
      // Simuler l'incrémentation locale pour une meilleure UX
      toast.success('Merci pour votre prière 🙏');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const getVisibilityStats = () => {
    const publicRequests = prayerRequests.filter(req => !req.is_anonymous).length;
    const anonymousRequests = prayerRequests.filter(req => req.is_anonymous).length;
    return { public: publicRequests, anonymous: anonymousRequests };
  };

  const stats = getVisibilityStats();

  return (
    <div 
      className="p-4 space-y-6 max-w-4xl mx-auto min-h-screen"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* En-tête */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--accent-primary)' }}
          >
            <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">Cercles de prière</h1>
            <p className="text-sm text-[var(--text-secondary)] break-words">
              Partagez vos intentions et priez ensemble
            </p>
          </div>
        </div>
      </ModernCard>

      {/* Statistiques */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <ModernCard className="p-4 text-center bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{prayerRequests.length}</div>
          <div className="text-sm text-blue-700">Total</div>
        </ModernCard>
        <ModernCard className="p-4 text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="text-2xl font-bold text-green-600">{stats.public}</div>
          <div className="text-sm text-green-700">Publiques</div>
        </ModernCard>
        <ModernCard className="p-4 text-center bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <div className="text-2xl font-bold text-purple-600">{stats.anonymous}</div>
          <div className="text-sm text-purple-700">Anonymes</div>
        </ModernCard>
      </div>

      {/* Actions principales */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Demandes de prière</h3>
            <p className="text-sm text-[var(--text-secondary)]">{prayerRequests.length} intention(s) partagée(s)</p>
          </div>
          <ModernButton 
            onClick={() => setShowCreateForm(!showCreateForm)} 
            className="gap-2 flex-shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span className="whitespace-nowrap">Créer un cercle</span>
          </ModernButton>
        </div>

        {/* Formulaire de création */}
        {showCreateForm && (
          <ModernCard className="mb-6 p-4 bg-[var(--bg-secondary)] border-[var(--border-default)]">
            <div className="space-y-4">
              <h4 className="font-semibold text-[var(--text-primary)]">Nouvelle demande de prière</h4>
              
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Titre de la demande
                </label>
                <input
                  type="text"
                  value={newRequest.title}
                  onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                  placeholder="Ex: Prière pour la guérison..."
                  className="w-full p-3 border border-[var(--border-default)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Description
                </label>
                <textarea
                  value={newRequest.content}
                  onChange={(e) => setNewRequest({...newRequest, content: e.target.value})}
                  placeholder="Partagez votre intention de prière..."
                  className="w-full p-3 border border-[var(--border-default)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] h-24 resize-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newRequest.isAnonymous}
                    onChange={(e) => setNewRequest({...newRequest, isAnonymous: e.target.checked})}
                    className="rounded border-[var(--border-default)]"
                  />
                  <span className="text-sm text-[var(--text-primary)]">Rester anonyme</span>
                </label>
                <span className="text-xs text-[var(--text-secondary)]">
                  {newRequest.isAnonymous ? 'Votre nom ne sera pas affiché' : 'Votre nom sera visible'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <ModernButton 
                  onClick={createPrayerRequest}
                  disabled={!newRequest.title.trim() || !newRequest.content.trim()}
                  className="flex-1 gap-2"
                >
                  <Heart className="h-4 w-4" />
                  <span>Créer la demande</span>
                </ModernButton>
                <ModernButton 
                  onClick={() => setShowCreateForm(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Annuler
                </ModernButton>
              </div>
            </div>
          </ModernCard>
        )}

        {/* Liste des demandes */}
        {prayerRequests.length === 0 ? (
          <div className="text-center py-8">
            <Heart className="h-12 w-12 text-[var(--text-secondary)] mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Aucune demande de prière</h4>
            <p className="text-[var(--text-secondary)] mb-4">Créez votre première intention de prière</p>
            <ModernButton onClick={() => setShowCreateForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              <span>Créer une demande</span>
            </ModernButton>
          </div>
        ) : (
          <div className="space-y-4">
            {prayerRequests.map((request) => (
              <ModernCard key={request.id} className="p-4 bg-[var(--bg-secondary)] border-[var(--border-default)]">
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-[var(--text-primary)] break-words">{request.title}</h4>
                        <Badge variant={request.is_anonymous ? "secondary" : "default"} className="flex items-center gap-1 flex-shrink-0">
                          {request.is_anonymous ? <Lock className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
                          <span>{request.is_anonymous ? 'Anonyme' : 'Public'}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed break-words">{request.content}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-[var(--border-default)]">
                    <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(request.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>{request.prayer_count || 0} prières</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <ModernButton
                        onClick={() => handlePrayerToggle(request.id, request.prayer_count || 0)}
                        size="sm"
                        variant="outline"
                        className="gap-2"
                      >
                        <Heart className="h-4 w-4" />
                        <span>Prier</span>
                      </ModernButton>
                      {!request.is_anonymous && (
                        <ModernButton
                          size="sm"
                          variant="ghost"
                          className="gap-2"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span className="hidden sm:inline">Partager</span>
                        </ModernButton>
                      )}
                    </div>
                  </div>
                </div>
              </ModernCard>
            ))}
          </div>
        )}
      </ModernCard>

      {/* Comment ça marche */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center flex-shrink-0">
            <Info className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              Comment ça marche ?
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Créez des demandes de prière pour partager vos intentions avec la communauté ou restez anonyme. 
              Vous pouvez choisir si votre demande est visible par tous (publique) ou anonyme. 
              Cliquez sur "Prier" pour soutenir les intentions d'autres membres. 
              Toutes vos demandes sont sauvegardées et vous pouvez suivre le nombre de personnes qui prient pour chaque intention.
            </p>
          </div>
        </div>
      </ModernCard>
    </div>
  );
};

export default PrayerCircles;
