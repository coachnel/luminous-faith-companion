
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Users, Plus, Globe, Lock } from 'lucide-react';
import { useCommunityContent } from '@/hooks/useCommunityContent';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const TestimonyPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const { publishContent } = useCommunityContent();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (!user) {
      toast.error('Vous devez être connecté pour partager un témoignage');
      return;
    }

    setLoading(true);
    
    try {
      await publishContent({
        type: 'testimony',
        title: title.trim(),
        content: content.trim(),
        is_public: isPublic
      });
      
      // Reset form
      setTitle('');
      setContent('');
      setIsPublic(true);
      
      toast.success('✨ Témoignage partagé avec succès !');
      
    } catch (error) {
      console.error('Error publishing testimony:', error);
      toast.error('Erreur lors du partage du témoignage');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 max-w-4xl mx-auto min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* En-tête */}
      <Card className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--accent-primary)' }}
            >
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg sm:text-xl text-[var(--text-primary)]">Témoignages</CardTitle>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">Partagez votre expérience avec la communauté compagnon</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Formulaire de témoignage */}
      <Card className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[var(--text-primary)]">
            <Plus className="h-5 w-5" />
            Partager un témoignage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[var(--text-primary)]">Titre de votre témoignage</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Comment la prière a transformé ma vie"
                maxLength={100}
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-[var(--text-primary)]">Votre témoignage</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Partagez votre expérience, vos défis surmontés, les bénédictions reçues..."
                rows={6}
                maxLength={2000}
                className="min-h-[150px] text-sm"
              />
              <p className="text-xs text-[var(--text-secondary)] text-right">
                {content.length}/2000 caractères
              </p>
            </div>

            <div className="flex items-center space-x-2 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <Switch
                id="share-testimony"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
              <div className="flex-1 min-w-0">
                <Label htmlFor="share-testimony" className="text-sm font-medium cursor-pointer flex items-center gap-2 break-words">
                  {isPublic ? (
                    <>
                      <Globe className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-green-700">Partager avec la communauté</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-700">Garder privé</span>
                    </>
                  )}
                </Label>
                <p className="text-xs text-gray-600 mt-1 break-words">
                  {isPublic 
                    ? "Votre témoignage sera visible par tous les membres de la communauté compagnon"
                    : "Votre témoignage restera privé"
                  }
                </p>
              </div>
            </div>

            {isPublic && (
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  📧 Tous les membres de la communauté recevront une notification de votre nouveau témoignage.
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !title.trim() || !content.trim() || !user}
              className="w-full"
            >
              {loading ? (
                'Publication en cours...'
              ) : (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Partager mon témoignage
                </div>
              )}
            </Button>

            {!user && (
              <p className="text-sm text-red-600 text-center">
                Vous devez être connecté pour partager un témoignage
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Information sur les témoignages */}
      <Card className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <CardContent className="p-4">
          <h3 className="font-semibold text-[var(--text-primary)] mb-2">Conseils pour un bon témoignage</h3>
          <ul className="text-sm text-[var(--text-secondary)] space-y-1">
            <li>• Soyez authentique et sincère dans votre partage</li>
            <li>• Décrivez les défis que vous avez rencontrés</li>
            <li>• Expliquez comment votre foi vous a aidé</li>
            <li>• Mentionnez les changements positifs dans votre vie</li>
            <li>• Encouragez les autres dans leur parcours</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestimonyPage;
