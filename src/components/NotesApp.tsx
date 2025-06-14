
import React, { useState } from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { Badge } from '@/components/ui/badge';
import { Edit3, Plus, Save, X, Calendar, User, Info } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNeonNotes } from '@/hooks/useNeonData';
import { toast } from 'sonner';

const NotesApp = () => {
  const { user } = useAuth();
  const { notes, addNote, updateNote, deleteNote } = useNeonNotes();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    tags: [] as string[]
  });
  const [editData, setEditData] = useState({
    title: '',
    content: '',
    tags: [] as string[]
  });

  const createNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      await addNote({
        title: newNote.title,
        content: newNote.content,
        tags: newNote.tags
      });

      setNewNote({ title: '', content: '', tags: [] });
      setShowCreateForm(false);
      toast.success('Note créée !');
    } catch (error) {
      toast.error('Erreur lors de la création');
    }
  };

  const startEdit = (note: any) => {
    setEditingNote(note.id);
    setEditData({
      title: note.title,
      content: note.content,
      tags: note.tags || []
    });
  };

  const saveEdit = async () => {
    if (!editData.title.trim() || !editData.content.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      await updateNote(editingNote!, {
        title: editData.title,
        content: editData.content,
        tags: editData.tags
      });

      setEditingNote(null);
      setEditData({ title: '', content: '', tags: [] });
      toast.success('Note mise à jour !');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const cancelEdit = () => {
    setEditingNote(null);
    setEditData({ title: '', content: '', tags: [] });
  };

  const handleDeleteNote = async (noteId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      try {
        await deleteNote(noteId);
        toast.success('Note supprimée !');
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  return (
    <div 
      className="p-4 space-y-6 max-w-4xl mx-auto min-h-screen"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* En-tête */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--accent-primary)' }}
          >
            <Edit3 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">Journal</h1>
            <p className="text-sm text-[var(--text-secondary)] break-words">
              Capturez vos pensées et réflexions
            </p>
          </div>
        </div>
      </ModernCard>

      {/* Actions principales */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Mes notes</h3>
            <p className="text-sm text-[var(--text-secondary)]">{notes.length} note(s) créée(s)</p>
          </div>
          <ModernButton 
            onClick={() => setShowCreateForm(!showCreateForm)} 
            className="gap-2 flex-shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span className="whitespace-nowrap">Nouvelle note</span>
          </ModernButton>
        </div>

        {/* Formulaire de création */}
        {showCreateForm && (
          <ModernCard className="mb-6 p-4 bg-[var(--bg-secondary)] border-[var(--border-default)]">
            <div className="space-y-4">
              <h4 className="font-semibold text-[var(--text-primary)]">Nouvelle note</h4>
              
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Titre
                </label>
                <input
                  type="text"
                  value={newNote.title}
                  onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                  placeholder="Titre de votre note..."
                  className="w-full p-3 border border-[var(--border-default)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Contenu
                </label>
                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                  placeholder="Écrivez votre note ici..."
                  className="w-full p-3 border border-[var(--border-default)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] h-32 resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <ModernButton 
                  onClick={createNote}
                  disabled={!newNote.title.trim() || !newNote.content.trim()}
                  className="flex-1 gap-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Créer la note</span>
                </ModernButton>
                <ModernButton 
                  onClick={() => setShowCreateForm(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Annuler
                </ModernButton>
              </div>
            </div>
          </ModernCard>
        )}

        {/* Liste des notes */}
        {notes.length === 0 ? (
          <div className="text-center py-8">
            <Edit3 className="h-12 w-12 text-[var(--text-secondary)] mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Aucune note</h4>
            <p className="text-[var(--text-secondary)] mb-4">Créez votre première note</p>
            <ModernButton onClick={() => setShowCreateForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              <span>Créer une note</span>
            </ModernButton>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <ModernCard key={note.id} className="p-4 bg-[var(--bg-secondary)] border-[var(--border-default)]">
                {editingNote === note.id ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editData.title}
                      onChange={(e) => setEditData({...editData, title: e.target.value})}
                      className="w-full p-3 border border-[var(--border-default)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] font-semibold"
                    />
                    <textarea
                      value={editData.content}
                      onChange={(e) => setEditData({...editData, content: e.target.value})}
                      className="w-full p-3 border border-[var(--border-default)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] h-32 resize-none"
                    />
                    <div className="flex gap-2">
                      <ModernButton onClick={saveEdit} size="sm" className="gap-2">
                        <Save className="h-4 w-4" />
                        <span>Sauvegarder</span>
                      </ModernButton>
                      <ModernButton onClick={cancelEdit} size="sm" variant="outline" className="gap-2">
                        <X className="h-4 w-4" />
                        <span>Annuler</span>
                      </ModernButton>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-[var(--text-primary)] break-words">{note.title}</h4>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed break-words mt-2">
                          {note.content}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-[var(--border-default)]">
                      <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(note.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>Privé</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <ModernButton
                          onClick={() => startEdit(note)}
                          size="sm"
                          variant="outline"
                          className="gap-2"
                        >
                          <Edit3 className="h-4 w-4" />
                          <span>Modifier</span>
                        </ModernButton>
                        <ModernButton
                          onClick={() => handleDeleteNote(note.id)}
                          size="sm"
                          variant="ghost"
                          className="gap-2 text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                          <span className="hidden sm:inline">Supprimer</span>
                        </ModernButton>
                      </div>
                    </div>
                  </div>
                )}
              </ModernCard>
            ))}
          </div>
        )}
      </ModernCard>

      {/* Comment ça marche */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center flex-shrink-0">
            <Info className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              Comment ça marche ?
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Créez des notes personnelles pour capturer vos pensées, réflexions ou idées importantes. 
              Vous pouvez modifier ou supprimer vos notes à tout moment. 
              Toutes vos notes sont privées et sauvegardées de manière sécurisée dans votre compte personnel.
            </p>
          </div>
        </div>
      </ModernCard>
    </div>
  );
};

export default NotesApp;
