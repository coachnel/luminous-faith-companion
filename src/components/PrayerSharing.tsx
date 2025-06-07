
import React, { useState, useEffect } from 'react';
import { Heart, Send, MessageCircle, User } from 'lucide-react';
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
      const { error } = await supabase
        .from('prayer_requests')
        .insert([{
          title: newTitle,
          content: newContent,
          author_name: isAnonymous ? 'Anonyme' : (user.user_metadata?.name || 'Utilisateur'),
          is_anonymous: isAnonymous,
          user_id: user.id,
          prayer_count: 0
        }]);

      if (error) throw error;

      setNewTitle('');
      setNewContent('');
      setIsAnonymous(false);
      
      toast({
        title: "🙏 Demande partagée",
        description: "Votre demande de prière a été partagée avec la communauté",
      });

      fetchPrayerRequests();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      toast({
        description: "Erreur lors de la soumission de la demande",
        variant: "destructive",
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

  return (
    <div className="p-4 space-y-4 max-w-4xl mx-auto">
      <Card className="glass border-white/30">
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
        <Card className="glass border-white/30">
          <CardHeader>
            <CardTitle className="text-lg">Partager une demande de prière</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Titre de votre demande..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="glass border-white/30"
            />
            
            <Textarea
              placeholder="Décrivez votre demande de prière..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="glass border-white/30 min-h-[100px]"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="anonymous"
                  checked={isAnonymous}
                  onCheckedChange={setIsAnonymous}
                />
                <label htmlFor="anonymous" className="text-sm">
                  Publier en anonyme
                </label>
              </div>
              
              <Button
                onClick={submitPrayerRequest}
                className="spiritual-gradient"
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
          <Card className="glass border-white/30">
            <CardContent className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-spiritual-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Chargement des demandes...</p>
            </CardContent>
          </Card>
        ) : prayerRequests.length === 0 ? (
          <Card className="glass border-white/30">
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
            <Card key={request.id} className="glass border-white/30 hover:shadow-lg transition-all">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-spiritual-100 flex items-center justify-center">
                      {request.is_anonymous ? (
                        <User className="text-spiritual-600" size={16} />
                      ) : (
                        <span className="text-spiritual-600 font-medium">
                          {request.author_name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-spiritual-700">
                        {request.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Par {request.author_name} • {new Date(request.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {request.content}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MessageCircle size={16} />
                    <span>{request.prayer_count} prière(s)</span>
                  </div>
                  
                  <Button
                    onClick={() => prayForRequest(request.id)}
                    disabled={prayedFor.has(request.id)}
                    variant={prayedFor.has(request.id) ? "outline" : "default"}
                    size="sm"
                    className={prayedFor.has(request.id) ? "text-green-600" : "spiritual-gradient"}
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
