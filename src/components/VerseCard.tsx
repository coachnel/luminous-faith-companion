
import React, { useState } from 'react';
import { Star, Share2, Copy, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Verse } from '@/types/bible';
import { useNeonFavoriteVerses } from '@/hooks/useNeonData';
import { useCommunityContent } from '@/hooks/useCommunityContent';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface VerseCardProps {
  verse: Verse;
}

const VerseCard: React.FC<VerseCardProps> = ({ verse }) => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareTitle, setShareTitle] = useState('');
  const [shareReflection, setShareReflection] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const { favoriteVerses, addFavoriteVerse, removeFavoriteVerse } = useNeonFavoriteVerses();
  const { publishContent } = useCommunityContent();
  const { user } = useAuth();
  
  const verseId = `${verse.book}-${verse.chapter}-${verse.verse}`;
  const isFavorite = favoriteVerses.some(fv => fv.verse_id === verseId);

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFavoriteVerse(verseId);
        toast({
          description: "Verset retiré des favoris",
        });
      } else {
        await addFavoriteVerse({
          id: verseId,
          book: verse.book,
          chapter: verse.chapter,
          verse: verse.verse,
          text: verse.text,
          version: 'LSG',
          language: 'fr'
        });
        toast({
          description: "Verset ajouté aux favoris ⭐",
        });
      }
    } catch (error) {
      toast({
        description: "Erreur lors de la mise à jour des favoris",
        variant: "destructive",
      });
    }
  };

  const handleCopy = async () => {
    const text = `"${verse.text}" - ${verse.book} ${verse.chapter}:${verse.verse}`;
    try {
      await navigator.clipboard.writeText(text);
      toast({
        description: "Verset copié dans le presse-papiers",
      });
    } catch (error) {
      toast({
        description: "Erreur lors de la copie",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    const text = `"${verse.text}" - ${verse.book} ${verse.chapter}:${verse.verse}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${verse.book} ${verse.chapter}:${verse.verse}`,
          text: text,
        });
      } catch (error) {
        console.log('Partage annulé');
      }
    } else {
      await handleCopy();
    }
  };

  const handleShareWithCommunity = async () => {
    if (!user) {
      toast({
        description: "Vous devez être connecté pour partager",
        variant: "destructive",
      });
      return;
    }

    if (!shareTitle.trim()) {
      toast({
        description: "Veuillez entrer un titre",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const verseText = `"${verse.text}" - ${verse.book} ${verse.chapter}:${verse.verse}`;
      const content = shareReflection.trim() 
        ? `${verseText}\n\n${shareReflection.trim()}`
        : verseText;

      await publishContent({
        type: 'verse',
        title: shareTitle.trim(),
        content: content,
        is_public: isPublic
      });

      setShareDialogOpen(false);
      setShareTitle('');
      setShareReflection('');
      setIsPublic(true);
      
      toast({
        description: "✨ Verset partagé avec la communauté !",
      });
    } catch (error) {
      console.error('Error sharing verse:', error);
      toast({
        description: "Erreur lors du partage",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass border-white/30 bg-white/90 hover:shadow-lg transition-all">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-purple-600 text-sm sm:text-base">
                {verse.book} {verse.chapter}:{verse.verse}
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              {verse.text}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleFavorite}
            className={`${
              isFavorite 
                ? 'text-yellow-500 hover:text-yellow-600' 
                : 'text-gray-400 hover:text-yellow-500'
            } hover:scale-110 transition-all`}
          >
            <Star size={16} className={isFavorite ? 'fill-current' : ''} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="text-gray-400 hover:text-blue-500 hover:scale-110 transition-all"
          >
            <Copy size={16} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="text-gray-400 hover:text-green-500 hover:scale-110 transition-all"
          >
            <Share2 size={16} />
          </Button>

          <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-purple-500 hover:scale-110 transition-all"
              >
                <Users size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Partager avec la communauté</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg border">
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    {verse.book} {verse.chapter}:{verse.verse}
                  </p>
                  <p className="text-sm text-blue-700 italic">
                    "{verse.text}"
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="share-title">Titre de votre partage</Label>
                  <Input
                    id="share-title"
                    value={shareTitle}
                    onChange={(e) => setShareTitle(e.target.value)}
                    placeholder="Ex: Un verset qui m'encourage..."
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="share-reflection">Votre réflexion (optionnel)</Label>
                  <Textarea
                    id="share-reflection"
                    value={shareReflection}
                    onChange={(e) => setShareReflection(e.target.value)}
                    placeholder="Partagez pourquoi ce verset vous parle..."
                    rows={3}
                    maxLength={500}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="share-public"
                    checked={isPublic}
                    onCheckedChange={setIsPublic}
                  />
                  <Label htmlFor="share-public" className="text-sm">
                    Partager avec la communauté compagnon
                  </Label>
                </div>

                <Button
                  onClick={handleShareWithCommunity}
                  disabled={loading || !shareTitle.trim() || !user}
                  className="w-full"
                >
                  {loading ? 'Partage en cours...' : 'Partager'}
                </Button>

                {!user && (
                  <p className="text-sm text-red-600 text-center">
                    Vous devez être connecté pour partager
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerseCard;
