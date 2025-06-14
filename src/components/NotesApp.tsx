
import React, { useState } from 'react';
import { Plus, Trash2, Calendar, Tag, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNeonNotes } from '@/hooks/useNeonData';
import { toast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';

const NotesApp = () => {
  const { notes, loading, addNote, deleteNote } = useNeonNotes();
  const { theme } = useTheme();
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
        <div 
          className="animate-spin w-8 h-8 border-4 border-t-transparent rounded-full mx-auto loading-spinner"
          style={{ borderColor: 'var(--border-default)', borderTopColor: 'var(--accent-primary)' }}
        ></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <Card 
        className="modern-card"
        style={{ 
          background: 'var(--bg-card)', 
          borderColor: 'var(--border-default)',
          color: 'var(--text-primary)'
        }}
      >
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle 
            className="flex items-center gap-2 card-title"
            style={{ color: 'var(--text-primary)' }}
          >
            <span>📝</span>
            Journal spirituel
          </CardTitle>
          <Dialog open={isAdding} onOpenChange={setIsAdding}>
            <DialogTrigger asChild>
              <Button 
                className="button-primary" 
                size="sm"
                style={{
                  background: 'var(--accent-primary)',
                  color: 'var(--text-inverse)'
                }}
              >
                <Plus size={18} />
              </Button>
            </DialogTrigger>
            <DialogContent 
              className="modern-card"
              style={{ 
                background: 'var(--bg-card)', 
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)'
              }}
            >
              <DialogHeader>
                <DialogTitle style={{ color: 'var(--text-primary)' }}>Nouvelle note</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Titre de votre note..."
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  className="input-field"
                  style={{
                    background: 'var(--bg-secondary)',
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-primary)'
                  }}
                />
                <Textarea
                  placeholder="Écrivez vos réflexions spirituelles..."
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  className="input-field min-h-[120px]"
                  style={{
                    background: 'var(--bg-secondary)',
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-primary)'
                  }}
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSubmit} 
                    className="button-primary"
                    style={{
                      background: 'var(--accent-primary)',
                      color: 'var(--text-inverse)'
                    }}
                  >
                    Sauvegarder
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAdding(false)}
                    className="button-secondary"
                    style={{
                      background: 'var(--bg-secondary)',
                      borderColor: 'var(--border-default)',
                      color: 'var(--text-primary)'
                    }}
                  >
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
          <Card 
            className="modern-card"
            style={{ 
              background: 'var(--bg-card)', 
              borderColor: 'var(--border-default)',
              color: 'var(--text-primary)'
            }}
          >
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 
                className="text-xl font-semibold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                Aucune note pour le moment
              </h3>
              <p 
                className="mb-4"
                style={{ color: 'var(--text-secondary)' }}
              >
                Commencez à écrire vos réflexions spirituelles
              </p>
              <Button 
                onClick={() => setIsAdding(true)}
                className="button-primary"
                style={{
                  background: 'var(--accent-primary)',
                  color: 'var(--text-inverse)'
                }}
              >
                Créer ma première note
              </Button>
            </CardContent>
          </Card>
        ) : (
          notes.map((note) => (
            <Card 
              key={note.id} 
              className="modern-card"
              style={{ 
                background: 'var(--bg-card)', 
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)'
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle 
                    className="text-lg"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {note.title}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(note.id)}
                    style={{ color: 'var(--accent-error)' }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                <div 
                  className="flex items-center gap-2 text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <Calendar size={14} />
                  {formatDate(note.created_at)}
                </div>
              </CardHeader>
              <CardContent>
                <p 
                  className="leading-relaxed whitespace-pre-wrap"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {note.content}
                </p>
                {note.tags && note.tags.length > 0 && (
                  <div className="flex items-center gap-2 mt-3">
                    <Tag size={14} style={{ color: 'var(--text-tertiary)' }} />
                    {note.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 rounded-full text-xs"
                        style={{
                          background: 'rgba(0, 102, 255, 0.1)',
                          color: 'var(--accent-primary)'
                        }}
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
