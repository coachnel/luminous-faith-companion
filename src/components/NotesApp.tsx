
import React, { useState } from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Edit, Trash, Tag, FileText, Info } from 'lucide-react';
import { useNeonNotes } from '@/hooks/useNeonData';
import { toast } from 'sonner';

const NotesApp = () => {
  const { notes, loading, addNote, updateNote, deleteNote } = useNeonNotes();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Veuillez donner un titre à la note');
      return;
    }

    try {
      const noteData = {
        title: formData.title,
        content: formData.content,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (editingNote) {
        await updateNote(editingNote.id, noteData);
        toast.success('Note mise à jour !');
      } else {
        await addNote(noteData);
        toast.success('Note créée !');
      }
      
      setIsDialogOpen(false);
      setEditingNote(null);
      setFormData({ title: '', content: '', tags: '' });
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const handleEdit = (note: any) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content || '',
      tags: note.tags?.join(', ') || ''
    });
    setIsDialogOpen(true);
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

  // Filtrage des notes avec pagination
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || note.tags?.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  // Extraction de tous les tags
  const allTags = Array.from(new Set(notes.flatMap(note => note.tags || [])));

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Chargement des notes...</p>
      </div>
    );
  }

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
            <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">Journal</h1>
            <p className="text-sm text-[var(--text-secondary)] break-words">
              Organisez vos pensées et réflexions
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <ModernButton 
                onClick={() => {
                  setEditingNote(null);
                  setFormData({ title: '', content: '', tags: '' });
                }}
                className="gap-2 flex-shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span className="whitespace-nowrap">Nouvelle note</span>
              </ModernButton>
            </DialogTrigger>
            <DialogContent className="bg-[var(--bg-card)] max-w-md">
              <DialogHeader>
                <DialogTitle className="text-[var(--text-primary)]">
                  {editingNote ? 'Modifier la note' : 'Créer une nouvelle note'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Titre *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Titre de la note..."
                    className="border-[var(--border-default)] bg-[var(--bg-secondary)]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Contenu
                  </label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Écrivez vos pensées..."
                    className="border-[var(--border-default)] bg-[var(--bg-secondary)]"
                    rows={6}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Tags (séparés par des virgules)
                  </label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="personnel, prière, méditation..."
                    className="border-[var(--border-default)] bg-[var(--bg-secondary)]"
                  />
                </div>
                
                <div className="flex gap-2">
                  <ModernButton type="submit" className="flex-1">
                    {editingNote ? 'Modifier' : 'Créer'}
                  </ModernButton>
                  <ModernButton 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Annuler
                  </ModernButton>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </ModernCard>

      {/* Recherche et filtres */}
      <ModernCard className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] h-4 w-4" />
            <Input
              type="text"
              placeholder="Rechercher dans vos notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-[var(--border-default)] bg-[var(--bg-secondary)]"
            />
          </div>
          
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <ModernButton
                variant={selectedTag === '' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedTag('')}
              >
                Tous
              </ModernButton>
              {allTags.map(tag => (
                <ModernButton
                  key={tag}
                  variant={selectedTag === tag ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTag(tag)}
                  className="gap-1"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </ModernButton>
              ))}
            </div>
          )}
        </div>
      </ModernCard>

      {/* Liste des notes */}
      {filteredNotes.length === 0 ? (
        <ModernCard className="bg-[var(--bg-card)] border-[var(--border-default)]">
          <div className="text-center py-8">
            <FileText className="mx-auto mb-4 text-[var(--text-secondary)]" size={48} />
            <p className="text-[var(--text-secondary)] mb-2">
              {searchTerm || selectedTag ? 'Aucune note trouvée' : 'Aucune note pour le moment'}
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              {searchTerm || selectedTag 
                ? 'Essayez de modifier vos critères de recherche'
                : 'Créez votre première note pour commencer'
              }
            </p>
          </div>
        </ModernCard>
      ) : (
        <div className="space-y-4">
          {filteredNotes.slice(0, 20).map((note) => (
            <ModernCard key={note.id} className="bg-[var(--bg-card)] border-[var(--border-default)]">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--text-primary)] break-words">{note.title}</h3>
                    {note.content && (
                      <p className="text-sm text-[var(--text-secondary)] mt-2 line-clamp-3 break-words">
                        {note.content}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2 flex-shrink-0">
                    <ModernButton variant="ghost" size="sm" onClick={() => handleEdit(note)}>
                      <Edit className="h-4 w-4" />
                    </ModernButton>
                    <ModernButton 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(note.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </ModernButton>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex flex-wrap gap-1">
                    {note.tags?.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <span className="text-xs text-[var(--text-secondary)] flex-shrink-0">
                    {new Date(note.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </ModernCard>
          ))}
        </div>
      )}

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
              Créez et organisez vos notes personnelles avec ce journal numérique. 
              Ajoutez des tags pour catégoriser vos notes et utilisez la fonction de recherche pour retrouver rapidement ce que vous cherchez. 
              Vos notes sont privées et sécurisées. Parfait pour noter vos réflexions, prières, ou idées importantes.
            </p>
          </div>
        </div>
      </ModernCard>
    </div>
  );
};

export default NotesApp;
