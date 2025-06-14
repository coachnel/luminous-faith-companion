
import React, { useState, useEffect } from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { Badge } from '@/components/ui/badge';
import { PenSquare, Plus, Search, Calendar, Tag, BookOpen, Heart, Target, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNeonNotes } from '@/hooks/useNeonData';
import { toast } from 'sonner';

const NotesApp = () => {
  const { notes, addNote, updateNote, deleteNote } = useNeonNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    category: 'reflection'
  });

  const categories = [
    { id: 'all', label: 'Toutes', icon: PenSquare },
    { id: 'reflection', label: 'Réflexions', icon: BookOpen },
    { id: 'prayer', label: 'Prières', icon: Heart },
    { id: 'goals', label: 'Objectifs', icon: Target },
    { id: 'journal', label: 'Journal', icon: Calendar }
  ];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
        category: newNote.category
      });

      setNewNote({ title: '', content: '', category: 'reflection' });
      setShowCreateForm(false);
      toast.success('Note créée !');
    } catch (error) {
      toast.error('Erreur lors de la création');
    }
  };

  const saveEdit = async () => {
    if (!editingNote || !editingNote.title.trim() || !editingNote.content.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      await updateNote(editingNote.id, {
        title: editingNote.title,
        content: editingNote.content,
        category: editingNote.category
      });

      setEditingNote(null);
      toast.success('Note mise à jour !');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async (noteId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      try {
        await deleteNote(noteId);
        toast.success('Note supprimée');
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.icon : PenSquare;
  };

  const getCategoryLabel = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.label : 'Autre';
  };

  const getCategoryStats = () => {
    return categories.map(category => ({
      ...category,
      count: category.id === 'all' ? notes.length : notes.filter(note => note.category === category.id).length
    }));
  };

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* En-tête */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--accent-primary)' }}
          >
            <PenSquare className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">Notes personnelles</h1>
            <p className="text-sm text-[var(--text-secondary)] break-words">
              Votre journal et vos réflexions
            </p>
          </div>
        </div>
      </ModernCard>

      {/* Filtres et recherche */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
              <Input
                placeholder="Rechercher dans vos notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[var(--bg-secondary)] border-[var(--border-default)] text-[var(--text-primary)]"
              />
            </div>
            <ModernButton 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="gap-2 flex-shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>Nouvelle note</span>
            </ModernButton>
          </div>

          {/* Catégories */}
          <div className="flex flex-wrap gap-2">
            {getCategoryStats().map((category) => {
              const Icon = category.icon;
              return (
                <ModernButton
                  key={category.id}
                  variant={selectedCategory === category.id ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.label}</span>
                  <Badge variant="secondary" className="ml-1">
                    {category.count}
                  </Badge>
                </ModernButton>
              );
            })}
          </div>
        </div>
      </ModernCard>

      {/* Formulaire de création/édition */}
      {(showCreateForm || editingNote) && (
        <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              {editingNote ? 'Modifier la note' : 'Nouvelle note'}
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Titre
              </label>
              <input
                type="text"
                value={editingNote ? editingNote.title : newNote.title}
                onChange={(e) => {
                  if (editingNote) {
                    setEditingNote({...editingNote, title: e.target.value});
                  } else {
                    setNewNote({...newNote, title: e.target.value});
                  }
                }}
                placeholder="Titre de votre note..."
                className="w-full p-3 border border-[var(--border-default)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Catégorie
              </label>
              <select
                value={editingNote ? editingNote.category : newNote.category}
                onChange={(e) => {
                  if (editingNote) {
                    setEditingNote({...editingNote, category: e.target.value});
                  } else {
                    setNewNote({...newNote, category: e.target.value});
                  }
                }}
                className="w-full p-3 border border-[var(--border-default)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)]"
              >
                {categories.filter(c => c.id !== 'all').map(category => (
                  <option key={category.id} value={category.id}>{category.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Contenu
              </label>
              <textarea
                value={editingNote ? editingNote.content : newNote.content}
                onChange={(e) => {
                  if (editingNote) {
                    setEditingNote({...editingNote, content: e.target.value});
                  } else {
                    setNewNote({...newNote, content: e.target.value});
                  }
                }}
                placeholder="Écrivez votre note ici..."
                className="w-full p-3 border border-[var(--border-default)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] h-32 resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <ModernButton 
                onClick={editingNote ? saveEdit : createNote}
                className="flex-1 gap-2"
              >
                <PenSquare className="h-4 w-4" />
                <span>{editingNote ? 'Sauvegarder' : 'Créer la note'}</span>
              </ModernButton>
              <ModernButton 
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingNote(null);
                }}
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
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Mes notes {selectedCategory !== 'all' && `- ${getCategoryLabel(selectedCategory)}`}
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            {filteredNotes.length} note(s) trouvée(s)
          </p>
        </div>

        {filteredNotes.length === 0 ? (
          <div className="text-center py-8">
            <PenSquare className="h-12 w-12 text-[var(--text-secondary)] mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              {searchQuery ? 'Aucune note trouvée' : 'Aucune note créée'}
            </h4>
            <p className="text-[var(--text-secondary)] mb-4">
              {searchQuery ? 'Essayez de modifier votre recherche' : 'Commencez par créer votre première note'}
            </p>
            {!searchQuery && (
              <ModernButton onClick={() => setShowCreateForm(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                <span>Créer une note</span>
              </ModernButton>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotes.map((note) => {
              const CategoryIcon = getCategoryIcon(note.category);
              return (
                <ModernCard key={note.id} className="p-4 bg-[var(--bg-secondary)] border-[var(--border-default)]">
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CategoryIcon className="h-4 w-4 text-[var(--accent-primary)]" />
                          <h4 className="font-semibold text-[var(--text-primary)] break-words">{note.title}</h4>
                          <Badge variant="outline" className="flex-shrink-0">
                            {getCategoryLabel(note.category)}
                          </Badge>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed break-words line-clamp-3">
                          {note.content}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-[var(--border-default)]">
                      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(note.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <ModernButton
                          onClick={() => setEditingNote(note)}
                          size="sm"
                          variant="outline"
                          className="gap-2"
                        >
                          <PenSquare className="h-4 w-4" />
                          <span>Modifier</span>
                        </ModernButton>
                        <ModernButton
                          onClick={() => handleDelete(note.id)}
                          size="sm"
                          variant="outline"
                          className="gap-2 text-red-600 hover:text-red-700"
                        >
                          <span>Supprimer</span>
                        </ModernButton>
                      </div>
                    </div>
                  </div>
                </ModernCard>
              );
            })}
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
              Créez et organisez vos notes personnelles par catégories : réflexions, prières, objectifs, ou journal. 
              Utilisez la barre de recherche pour retrouver rapidement vos notes. 
              Filtrez par catégorie pour une navigation plus facile. 
              Vos notes sont automatiquement sauvegardées et synchronisées. 
              Vous pouvez modifier ou supprimer vos notes à tout moment.
            </p>
          </div>
        </div>
      </ModernCard>
    </div>
  );
};

export default NotesApp;
