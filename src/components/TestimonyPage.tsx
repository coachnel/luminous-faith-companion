
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
      {/* En-tête moderne unifié */}
      <div className="bg-[var(--bg-card)] border-[var(--border-default)] rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div 
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--accent-primary)' }}
          >
            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--text-primary)] break-words">
              Témoignages
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] break-words">
              Partagez votre expérience avec la communauté
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire de témoignage moderne */}
      <div className="bg-[var(--bg-card)] border-[var(--border-default)] rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--text-primary)]" />
          <h2 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
            Partager un témoignage
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs sm:text-sm font-medium text-[var(--text-primary)]">
              Titre de votre témoignage
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Comment la prière a transformé ma vie"
              maxLength={100}
              className="text-xs sm:text-sm bg-[var(--bg-secondary)] border-[var(--border-default)]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-xs sm:text-sm font-medium text-[var(--text-primary)]">
              Votre témoignage
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Partagez votre expérience, vos défis surmontés, les bénédictions reçues..."
              rows={6}
              maxLength={2000}
              className="min-h-[120px] sm:min-h-[150px] text-xs sm:text-sm bg-[var(--bg-secondary)] border-[var(--border-default)] resize-none"
            />
            <p className="text-[10px] xs:text-xs text-[var(--text-secondary)] text-right">
              {content.length}/2000 caractères
            </p>
          </div>

          <div className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <Switch
              id="share-testimony"
              checked={isPublic}
              onCheckedChange={setIsPublic}
              className="mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <Label htmlFor="share-testimony" className="text-xs sm:text-sm font-medium cursor-pointer flex items-center gap-1 sm:gap-2 break-words">
                {isPublic ? (
                  <>
                    <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                    <span className="text-green-700 dark:text-green-400">Partager avec la communauté</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-400">Garder privé</span>
                  </>
                )}
              </Label>
              <p className="text-[10px] xs:text-xs text-gray-600 dark:text-gray-400 mt-1 break-words">
                {isPublic 
                  ? "Votre témoignage sera visible par tous les membres de la communauté"
                  : "Votre témoignage restera privé"
                }
              </p>
            </div>
          </div>

          {isPublic && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 sm:p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-400 break-words">
                📧 Tous les membres de la communauté recevront une notification de votre nouveau témoignage.
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || !title.trim() || !content.trim() || !user}
            className="w-full gap-2 sm:gap-3 text-xs sm:text-sm py-2 sm:py-3"
          >
            {loading ? (
              'Publication en cours...'
            ) : (
              <>
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                Partager mon témoignage
              </>
            )}
          </Button>

          {!user && (
            <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 text-center break-words">
              Vous devez être connecté pour partager un témoignage
            </p>
          )}
        </form>
      </div>

      {/* Conseils modernes */}
      <div className="bg-[var(--bg-card)] border-[var(--border-default)] rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <h3 className="text-sm sm:text-base font-semibold text-[var(--text-primary)] mb-3 sm:mb-4">
          Conseils pour un bon témoignage
        </h3>
        <ul className="text-xs sm:text-sm text-[var(--text-secondary)] space-y-1 sm:space-y-2">
          <li>• Soyez authentique et sincère dans votre partage</li>
          <li>• Décrivez les défis que vous avez rencontrés</li>
          <li>• Expliquez comment votre foi vous a aidé</li>
          <li>• Mentionnez les changements positifs dans votre vie</li>
          <li>• Encouragez les autres dans leur parcours</li>
        </ul>
      </div>
    </div>
  );
};

export default TestimonyPage;
