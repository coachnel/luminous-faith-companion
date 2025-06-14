
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Send, Heart, BookOpen, MessageCircle, Star } from 'lucide-react';
import { useCommunityContent } from '@/hooks/useCommunityContent';
import { toast } from 'sonner';

const CommunityPublish = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'prayer' | 'note' | 'verse' | 'testimony'>('note');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const { publishContent } = useCommunityContent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    
    try {
      await publishContent({
        type,
        title: title.trim(),
        content: content.trim(),
        is_public: isPublic
      });
      
      // Reset form
      setTitle('');
      setContent('');
      setType('note');
      setIsPublic(true);
      
    } catch (error) {
      console.error('Error publishing content:', error);
    } finally {
      setLoading(false);
    }
  };

  const typeIcons = {
    prayer: Heart,
    note: MessageCircle,
    verse: BookOpen,
    testimony: Star
  };

  const typeLabels = {
    prayer: 'Demande de prière',
    note: 'Réflexion',
    verse: 'Verset inspirant',
    testimony: 'Témoignage'
  };

  const IconComponent = typeIcons[type];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Partager avec la communauté
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type de contenu</Label>
            <Select value={type} onValueChange={(value: 'prayer' | 'note' | 'verse' | 'testimony') => setType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(typeLabels).map(([key, label]) => {
                  const Icon = typeIcons[key as keyof typeof typeIcons];
                  return (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Titre de votre ${typeLabels[type].toLowerCase()}`}
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenu</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Partagez votre ${typeLabels[type].toLowerCase()}...`}
              rows={4}
              maxLength={1000}
            />
            <p className="text-xs text-gray-500 text-right">
              {content.length}/1000 caractères
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
            <Label htmlFor="public" className="text-sm">
              Partager publiquement avec la communauté
            </Label>
          </div>

          {isPublic && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-700">
                📧 Tous les membres de la communauté recevront une notification par email de votre publication.
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || !title.trim() || !content.trim()}
            className="w-full"
          >
            {loading ? (
              'Publication en cours...'
            ) : (
              <div className="flex items-center gap-2">
                <IconComponent className="h-4 w-4" />
                Publier {typeLabels[type].toLowerCase()}
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CommunityPublish;
