
import React, { useState, useEffect } from 'react';
import { Heart, Send, MessageCircle, User, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface PrayerRequest {
  id: string;
  title: string;
  content: string;
  author_name: string;
  is_anonymous: boolean;
  prayer_count: number;
  created_at: string;
  user_id: string;
}

const PrayerSharing = () => {
  const { user } = useAuth();
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(true);
  const [prayedFor, setPrayedFor] = useState<Set<string>>(new Set());

  // Helper function to get user display name
  const getUserDisplayName = () => {
    if (!user) return 'Utilisateur';
    // Check user_metadata first, then fallback to email
    return user.user_metadata?.name || user.email?.split('@')[0] || 'Utilisateur';
  };

  useEffect(() => {
    fetchPrayerRequests();
    loadPrayedFor();
  }, []);

  const loadPrayedFor = () => {
    const saved = localStorage.getItem('prayedForRequests');
    if (saved) {
      setPrayedFor(new Set(JSON.parse(saved)));
    }
  };

  const savePrayedFor = (requestId: string) => {
    const updated = new Set([...prayedFor, requestId]);
    setPrayedFor(updated);
    localStorage.setItem('prayedForRequests', JSON.stringify([...updated]));
  };

  const fetchPrayerRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('prayer_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des demandes:', error);
        setPrayerRequests([]);
      } else {
        setPrayerRequests(data || []);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
      setPrayerRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const submitPrayerRequest = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      toast({
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        description: "Vous devez être connecté pour partager une demande",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('prayer_requests')
        .insert({
          title: newTitle,
          content: newContent,
          author_name: isAnonymous ? 'Anonyme' : getUserDisplayName(),
          is_anonymous: isAnonymous,
          prayer_count: 0,
          user_id: user?.id,
        });

      if (error) {
        throw error;
      }

      setPrayerRequests((prev) => [...prev, ...(data || [])]);
      setNewTitle('');
      setNewContent('');
      setIsAnonymous(false);

      toast({
        title: '🙏 Demande de prière partagée',
        description: 'Votre demande a été partagée avec succès.',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de partager la demande de prière.',
        variant: 'destructive',
      });
    }
  };

  const prayForRequest = async (requestId: string) => {
    if (prayedFor.has(requestId)) {
      toast({
        description: "Vous avez déjà prié pour cette demande aujourd'hui",
      });
      return;
    }

    try {
      const currentRequest = prayerRequests.find(r => r.id === requestId);
      const newCount = (currentRequest?.prayer_count || 0) + 1;

      const { error } = await supabase
        .from('prayer_requests')
        .update({ prayer_count: newCount })
        .eq('id', requestId);

      if (error) throw error;

      savePrayedFor(requestId);
      
      toast({
        title: "🙏 Merci pour votre prière",
        description: "Votre prière a été comptabilisée",
      });

      fetchPrayerRequests();
    } catch (error) {
      console.error('Erreur lors de la prière:', error);
      toast({
        description: "Erreur lors de l'enregistrement de la prière",
        variant: "destructive",
      });
    }
  };

  const deletePrayerRequest = async (id: string) => {
    try {
      const { error } = await supabase
        .from('prayer_requests')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast({ description: 'Demande supprimée.' });
      fetchPrayerRequests();
    } catch (error) {
      toast({ description: 'Erreur lors de la suppression', variant: 'destructive' });
    }
  };

  // Suppression automatique des demandes de plus de 7 jours
  useEffect(() => {
    if (!loading && prayerRequests.length > 0) {
      const now = new Date();
      prayerRequests.forEach(async (req) => {
        const created = new Date(req.created_at);
        const diff = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
        if (diff > 7) {
          await deletePrayerRequest(req.id);
        }
      });
    }
  }, [loading, prayerRequests]);

  return (
    <div className="p-4 space-y-4 max-w-4xl mx-auto">
      <Card className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="text-red-500" size={24} />
            Partage de prières
            <span className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded-full">
              {prayerRequests.length} demande(s)
            </span>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Formulaire de nouvelle demande */}
      {user && (
        <Card className="bg-[var(--bg-card)] border-[var(--border-default)]">
          <CardHeader>
            <CardTitle className="text-lg">Partager une demande de prière</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Titre de votre demande..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="bg-[var(--bg-card)] border-[var(--border-default)]"
            />
            
            <Textarea
              placeholder="Décrivez votre demande de prière..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="bg-[var(--bg-card)] border-[var(--border-default)] min-h-[100px]"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="anonymous"
                  checked={isAnonymous}
                  onCheckedChange={setIsAnonymous}
                />
                <label htmlFor="anonymous" className="text-sm text-[var(--text-primary)]">
                  Publier en anonyme
                </label>
              </div>
              
              <Button
                onClick={submitPrayerRequest}
                className="bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:opacity-90 rounded-xl"
              >
                <Send size={16} className="mr-2" />
                Partager
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des demandes de prière */}
      <div className="space-y-4">
        {loading ? (
          <Card className="bg-[var(--bg-card)] border-[var(--border-default)]">
            <CardContent className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Chargement des demandes...</p>
            </CardContent>
          </Card>
        ) : prayerRequests.length === 0 ? (
          <Card className="bg-[var(--bg-card)] border-[var(--border-default)]">
            <CardContent className="p-8 text-center">
              <Heart className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-semibold mb-2">Aucune demande de prière</h3>
              <p className="text-gray-600">
                Soyez le premier à partager une demande avec la communauté
              </p>
            </CardContent>
          </Card>
        ) : (
          prayerRequests.map((request) => (
            <Card key={request.id} className="bg-[var(--bg-card)] border-[var(--border-default)] hover:shadow-lg transition-all">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      {request.is_anonymous ? (
                        <User className="text-blue-600" size={16} />
                      ) : (
                        <span className="text-blue-600 font-medium">
                          {request.author_name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[var(--text-primary)]">
                        {request.title}
                      </h4>
                      <p className="text-sm text-[var(--text-secondary)]">
                        Par {request.author_name} • {new Date(request.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  {/* Bouton suppression amélioré pour l'auteur */}
                  {user && user.id === request.user_id && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => deletePrayerRequest(request.id)} 
                      className="text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl border border-red-200 hover:border-red-300 transition-all"
                      title="Supprimer cette demande"
                    >
                      <Trash2 size={16} />
                      <span className="ml-1 hidden sm:inline">Supprimer</span>
                    </Button>
                  )}
                </div>
                
                <p className="text-[var(--text-primary)] mb-4 leading-relaxed">
                  {request.content}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <MessageCircle size={16} />
                    <span>{request.prayer_count} prière(s)</span>
                  </div>
                  
                  <Button
                    onClick={() => prayForRequest(request.id)}
                    disabled={prayedFor.has(request.id)}
                    size="sm"
                    className={`rounded-xl transition-all ${
                      prayedFor.has(request.id) 
                        ? "bg-green-100 text-green-700 border border-green-200 hover:bg-green-150" 
                        : "bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:opacity-90 shadow-sm"
                    }`}
                  >
                    <Heart size={16} className="mr-2" fill={prayedFor.has(request.id) ? 'currentColor' : 'none'} />
                    {prayedFor.has(request.id) ? 'Prié' : 'Prier'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default PrayerSharing;
