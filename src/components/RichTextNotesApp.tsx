
import React, { useState } from 'react';
import { Plus, Trash2, Calendar, Tag, Edit, Bold, Italic, Underline, Share, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNotes } from '@/hooks/useSupabaseData';
import { toast } from '@/hooks/use-toast';

const RichTextNotesApp = () => {
  const { notes, loading, addNote, deleteNote } = useNotes();
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', tags: [] });
  const [selectedText, setSelectedText] = useState('');
  const [textArea, setTextArea] = useState<HTMLTextAreaElement | null>(null);

  const handleSubmit = async () => {
    if (newNote.title && newNote.content) {
      try {
        await addNote(newNote);
        setNewNote({ title: '', content: '', tags: [] });
        setIsAdding(false);
        toast({
          description: "Note sauvegardée avec succès ✨",
        });
      } catch (error) {
        toast({
          description: "Erreur lors de la sauvegarde",
          variant: "destructive",
        });
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNote(id);
      toast({
        description: "Note supprimée",
      });
    } catch (error) {
      toast({
        description: "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  const formatText = (format: string) => {
    if (!textArea) return;
    
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const selectedText = textArea.value.substring(start, end);
    
    if (selectedText) {
      let formattedText = '';
      switch (format) {
        case 'bold':
          formattedText = `**${selectedText}**`;
          break;
        case 'italic':
          formattedText = `*${selectedText}*`;
          break;
        case 'underline':
          formattedText = `__${selectedText}__`;
          break;
        default:
          formattedText = selectedText;
      }
      
      const newContent = 
        textArea.value.substring(0, start) + 
        formattedText + 
        textArea.value.substring(end);
      
      setNewNote({ ...newNote, content: newContent });
    }
  };

  const shareNote = (note: any, type: 'internal' | 'external') => {
    if (type === 'external') {
      const shareText = `${note.title}\n\n${note.content}\n\n- Partagé depuis Compagnon Spirituel`;
      if (navigator.share) {
        navigator.share({
          title: note.title,
          text: shareText,
        });
      } else {
        navigator.clipboard.writeText(shareText);
        toast({
          description: "Note copiée dans le presse-papiers",
        });
      }
    } else {
      // Internal sharing - could be extended with community features
      toast({
        description: "Fonctionnalité de partage interne en développement",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const renderFormattedContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/__(.*?)__/g, '<u>$1</u>');
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-spiritual-500 border-t-transparent rounded-full mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <Card className="glass border-white/30">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <span>📝</span>
            Journal spirituel
          </CardTitle>
          <Dialog open={isAdding} onOpenChange={setIsAdding}>
            <DialogTrigger asChild>
              <Button className="floating-button spiritual-gradient" size="sm">
                <Plus size={18} />
              </Button>
            </DialogTrigger>
            <DialogContent className="glass border-white/30 backdrop-blur-md bg-white/95">
              <DialogHeader>
                <DialogTitle>Nouvelle note</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Titre de votre note..."
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  className="glass border-white/30 bg-white"
                />
                
                {/* Formatting toolbar */}
                <div className="flex gap-2 p-2 bg-gray-50 rounded-lg">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => formatText('bold')}
                    className="h-8 w-8 p-0"
                  >
                    <Bold size={14} />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => formatText('italic')}
                    className="h-8 w-8 p-0"
                  >
                    <Italic size={14} />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => formatText('underline')}
                    className="h-8 w-8 p-0"
                  >
                    <Underline size={14} />
                  </Button>
                </div>
                
                <Textarea
                  ref={setTextArea}
                  placeholder="Écrivez vos réflexions spirituelles... Utilisez **gras**, *italique*, __souligné__"
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  className="glass border-white/30 min-h-[120px] bg-white"
                />
                <div className="flex gap-2">
                  <Button onClick={handleSubmit} className="spiritual-gradient">
                    Sauvegarder
                  </Button>
                  <Button variant="outline" onClick={() => setIsAdding(false)}>
                    Annuler
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
      </Card>

      {/* Notes List */}
      <div className="space-y-4">
        {notes.length === 0 ? (
          <Card className="glass border-white/30">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">Aucune note pour le moment</h3>
              <p className="text-gray-600 mb-4">
                Commencez à écrire vos réflexions spirituelles
              </p>
              <Button 
                onClick={() => setIsAdding(true)}
                className="spiritual-gradient"
              >
                Créer ma première note
              </Button>
            </CardContent>
          </Card>
        ) : (
          notes.map((note) => (
            <Card key={note.id} className="glass border-white/30">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg text-spiritual-700">
                    {note.title}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => shareNote(note, 'internal')}
                      className="text-blue-400 hover:text-blue-600 hover:scale-110 transition-all"
                    >
                      <MessageSquare size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => shareNote(note, 'external')}
                      className="text-green-400 hover:text-green-600 hover:scale-110 transition-all"
                    >
                      <Share size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(note.id)}
                      className="text-red-400 hover:text-red-600 hover:scale-110 transition-all"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={14} />
                  {formatDate(note.created_at)}
                </div>
              </CardHeader>
              <CardContent>
                <div 
                  className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ 
                    __html: renderFormattedContent(note.content) 
                  }}
                />
                {note.tags && note.tags.length > 0 && (
                  <div className="flex items-center gap-2 mt-3">
                    <Tag size={14} className="text-gray-400" />
                    {note.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-spiritual-100 text-spiritual-700 px-2 py-1 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default RichTextNotesApp;
