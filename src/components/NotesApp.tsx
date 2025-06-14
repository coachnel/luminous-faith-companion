
import React, { useState } from 'react';
import { Plus, Trash2, Calendar, Tag, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNeonNotes } from '@/hooks/useNeonData';
import { toast } from '@/hooks/use-toast';

const NotesApp = () => {
  const { notes, loading, addNote, deleteNote } = useNeonNotes();
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', tags: [] });

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
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
            Journal spirituel (Neon)
          </CardTitle>
          <Dialog open={isAdding} onOpenChange={setIsAdding}>
            <DialogTrigger asChild>
              <Button className="floating-button spiritual-gradient" size="sm">
                <Plus size={18} />
              </Button>
            </DialogTrigger>
            <DialogContent className="glass border-white/30 backdrop-blur-md">
              <DialogHeader>
                <DialogTitle>Nouvelle note</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Titre de votre note..."
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  className="glass border-white/30"
                />
                <Textarea
                  placeholder="Écrivez vos réflexions spirituelles..."
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  className="glass border-white/30 min-h-[120px]"
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
                Commencez à écrire vos réflexions spirituelles sur Neon
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(note.id)}
                    className="text-red-400 hover:text-red-600 hover:scale-110 transition-all"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={14} />
                  {formatDate(note.created_at)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {note.content}
                </p>
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

export default NotesApp;
