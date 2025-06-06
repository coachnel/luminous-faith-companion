
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Note } from '../types';

interface NotesJournalProps {
  notes: Note[];
  onAddNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDeleteNote: (id: string) => void;
}

const NotesJournal: React.FC<NotesJournalProps> = ({ notes, onAddNote, onDeleteNote }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', tags: [] });

  const handleSubmit = () => {
    if (newNote.title && newNote.content) {
      onAddNote({
        title: newNote.title,
        content: newNote.content,
        tags: newNote.tags,
      });
      setNewNote({ title: '', content: '', tags: [] });
      setIsAdding(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="glass rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold glow-text">Journal spirituel</h2>
          <Button
            onClick={() => setIsAdding(!isAdding)}
            className="floating-button spiritual-gradient"
            size="sm"
          >
            <Plus size={18} />
          </Button>
        </div>

        {isAdding && (
          <div className="verse-card space-y-4 mb-6">
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
        )}
      </div>

      <div className="space-y-4">
        {notes.length === 0 ? (
          <div className="verse-card text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">Aucune note pour le moment</h3>
            <p className="text-gray-600">Commencez à écrire vos réflexions spirituelles</p>
          </div>
        ) : (
          notes.map((note) => (
            <Card key={note.id} className="verse-card">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{note.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteNote(note.id)}
                    className="text-red-400 hover:text-red-600 hover:scale-110 transition-all"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={14} />
                  {formatDate(note.createdAt)}
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

export default NotesJournal;
