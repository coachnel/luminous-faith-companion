
import React, { useState } from 'react';
import { Plus, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface NotesDialogProps {
  onNoteCreated: (note: Note) => void;
}

const NotesDialog: React.FC<NotesDialogProps> = ({ onNoteCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        description: "Veuillez saisir un titre",
        variant: "destructive",
      });
      return;
    }

    const newNote: Note = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onNoteCreated(newNote);
    
    // Réinitialiser le formulaire
    setTitle('');
    setContent('');
    setTags('');
    setIsOpen(false);

    toast({
      title: "📝 Note créée",
      description: "Votre réflexion spirituelle a été sauvegardée",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="spiritual-gradient">
          <Plus size={18} className="mr-2" />
          Nouvelle note
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-white max-w-md border border-purple-200 shadow-xl">
        <DialogHeader className="border-b border-gray-100 pb-4">
          <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">📝</span>
            Nouvelle note spirituelle
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Titre *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ma réflexion du jour..."
              className="border-gray-300 bg-white focus:border-purple-400 focus:ring-purple-400"
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contenu
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Partagez vos pensées, prières, réflexions..."
              className="border-gray-300 bg-white focus:border-purple-400 focus:ring-purple-400 min-h-[120px]"
              rows={6}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Étiquettes
            </label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="prière, gratitude, réflexion..."
              className="border-gray-300 bg-white focus:border-purple-400 focus:ring-purple-400"
            />
            <p className="text-xs text-gray-500 mt-1">
              Séparez les étiquettes par des virgules
            </p>
          </div>
          
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button 
              onClick={handleSave} 
              className="flex-1 spiritual-gradient font-medium"
            >
              <Save size={16} className="mr-2" />
              Enregistrer
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              <X size={16} className="mr-2" />
              Annuler
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotesDialog;
