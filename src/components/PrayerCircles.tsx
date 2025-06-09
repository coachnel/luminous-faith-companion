
import React, { useState } from 'react';
import { Users, Send, Eye, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const PrayerCircles = () => {
  const { toast } = useToast();
  const [groupName, setGroupName] = useState('');
  const [theme, setTheme] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const prayerThemes = [
    'Guérison',
    'Famille',
    'Foi',
    'Paix',
    'Protection',
    'Sagesse',
    'Travail',
    'Études',
    'Santé',
    'Réconciliation',
    'Jeunesse',
    'Mariage',
    'Enfants',
    'Finances'
  ];

  const generateMessage = () => {
    const baseMessage = `🙏 Rejoins mon cercle de prière "${groupName}" sur le thème "${theme}".`;
    const callToAction = "Clique ici pour nous rejoindre et prier ensemble !";
    const personalNote = customMessage ? `\n\n${customMessage}` : '';
    
    return `${baseMessage}\n${callToAction}${personalNote}`;
  };

  const shareToWhatsApp = () => {
    if (!groupName || !theme) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir le nom du groupe et le thème.",
        variant: "destructive"
      });
      return;
    }

    const message = generateMessage();
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Cercle de prière créé !",
      description: "Le message a été ouvert dans WhatsApp.",
    });
  };

  const copyToClipboard = () => {
    if (!groupName || !theme) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir le nom du groupe et le thème.",
        variant: "destructive"
      });
      return;
    }

    const message = generateMessage();
    navigator.clipboard.writeText(message).then(() => {
      toast({
        title: "Message copié !",
        description: "Vous pouvez maintenant le coller où vous voulez.",
      });
    });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      <Card className="glass border-white/30 bg-white/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="text-purple-600" size={24} />
            Créer un cercle de prière
          </CardTitle>
          <p className="text-sm text-gray-600">
            Invitez vos proches à vous rejoindre dans la prière via WhatsApp
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nom du groupe de prière *
            </label>
            <Input
              placeholder="Ex: Prière pour la paix, Groupe famille..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="glass border-white/30 bg-white/90"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Thème de prière *
            </label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="glass border-white/30 bg-white/90">
                <SelectValue placeholder="Choisissez un thème..." />
              </SelectTrigger>
              <SelectContent>
                {prayerThemes.map((themeOption) => (
                  <SelectItem key={themeOption} value={themeOption}>
                    {themeOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Message personnalisé (optionnel)
            </label>
            <Textarea
              placeholder="Ajoutez un message personnel pour encourager vos proches..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="glass border-white/30 bg-white/90 min-h-[100px]"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setShowPreview(!showPreview)}
              variant="outline"
              className="flex items-center gap-2"
              disabled={!groupName || !theme}
            >
              <Eye size={16} />
              {showPreview ? 'Masquer' : 'Prévisualiser'}
            </Button>

            <Button
              onClick={shareToWhatsApp}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              disabled={!groupName || !theme}
            >
              <Send size={16} />
              Envoyer via WhatsApp
            </Button>

            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="flex items-center gap-2"
              disabled={!groupName || !theme}
            >
              <Share2 size={16} />
              Copier le message
            </Button>
          </div>

          {showPreview && groupName && theme && (
            <Card className="mt-4 border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="text-lg">Aperçu du message</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm p-3 bg-white rounded border">
                  {generateMessage()}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card className="glass border-white/30 bg-white/80">
        <CardHeader>
          <CardTitle className="text-lg">Comment ça marche ?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">1</div>
            <p>Remplissez le nom de votre groupe et choisissez un thème de prière</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">2</div>
            <p>Ajoutez un message personnel si vous le souhaitez</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">3</div>
            <p>Prévisualisez votre message puis partagez-le via WhatsApp</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">4</div>
            <p>Vos contacts pourront rejoindre votre cercle de prière en un clic</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrayerCircles;
