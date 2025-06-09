
import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Share2, MessageSquare, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useNotes } from '@/hooks/useSupabaseData';
import { toast } from '@/hooks/use-toast';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  user_id: string;
}

const RichTextNotesApp = () => {
  const { user } = useAuth();
  const { notes, createNote, updateNote, deleteNote } = useNotes();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateNote = async () => {
    if (!user) return;
    
    try {
      await createNote({
        title: 'Nouvelle note',
        content: '',
        tags: [],
        user_id: user.id,
      });
      toast({
        title: "Note créée",
        description: "Nouvelle note ajoutée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la note",
        variant: "destructive",
      });
    }
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditTags(note.tags.join(', '));
    setIsEditing(true);
  };

  const handleSaveNote = async () => {
    if (!selectedNote) return;

    try {
      const tags = editTags.split(',').map(tag => tag.trim()).filter(tag => tag);
      await updateNote(selectedNote.id, {
        title: editTitle,
        content: editContent,
        tags,
      });
      
      setIsEditing(false);
      setSelectedNote(null);
      toast({
        title: "Note sauvegardée",
        description: "Modifications enregistrées avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la note",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) return;

    try {
      await deleteNote(noteId);
      setSelectedNote(null);
      setIsEditing(false);
      toast({
        title: "Note supprimée",
        description: "Note supprimée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la note",
        variant: "destructive",
      });
    }
  };

  const handleShareNote = async (note: Note) => {
    const shareText = `📝 ${note.title}\n\n${note.content}\n\n#CompagnonSpirituel`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: note.title,
          text: shareText,
        });
        toast({
          title: "Note partagée",
          description: "Note partagée avec succès",
        });
      } catch (error) {
        console.log('Partage annulé');
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Note copiée",
          description: "Note copiée dans le presse-papiers",
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de copier la note",
          variant: "destructive",
        });
      }
    }
  };

  const formatText = (type: string) => {
    const textarea = document.getElementById('note-content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editContent.substring(start, end);
    
    let formattedText = '';
    switch (type) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `__${selectedText}__`;
        break;
      case 'list':
        formattedText = `\n• ${selectedText}`;
        break;
      default:
        formattedText = selectedText;
    }

    const newContent = editContent.substring(0, start) + formattedText + editContent.substring(end);
    setEditContent(newContent);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Mes Notes Spirituelles</h1>
          <Button onClick={handleCreateNote} className="spiritual-gradient text-white">
            <Plus size={16} className="mr-2" />
            Nouvelle note
          </Button>
        </div>
        
        <div className="mb-4">
          <Input
            placeholder="Rechercher dans vos notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass border-white/30 bg-white/90"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liste des notes */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Notes ({filteredNotes.length})
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredNotes.map((note) => (
              <Card key={note.id} className="glass border-white/30 bg-white/90 hover:shadow-lg transition-all cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-medium text-gray-800 line-clamp-1">
                      {note.title}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditNote(note)}
                        className="p-1 h-6 w-6"
                      >
                        <Edit3 size={12} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShareNote(note)}
                        className="p-1 h-6 w-6"
                      >
                        <Share2 size={12} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-1 h-6 w-6 text-red-600"
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                    {note.content || 'Aucun contenu'}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {note.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(note.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Éditeur de note */}
        <div className="space-y-4">
          {isEditing && selectedNote ? (
            <Card className="glass border-white/30 bg-white/90">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Éditer la note</CardTitle>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveNote} size="sm" className="spiritual-gradient text-white">
                      <Save size={16} className="mr-1" />
                      Sauvegarder
                    </Button>
                    <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Titre
                  </label>
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Titre de la note"
                    className="glass border-white/30 bg-white/90"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Mise en forme
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => formatText('bold')}
                      className="font-bold"
                    >
                      B
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => formatText('italic')}
                      className="italic"
                    >
                      I
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => formatText('underline')}
                      className="underline"
                    >
                      U
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => formatText('list')}
                    >
                      •
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Contenu
                  </label>
                  <textarea
                    id="note-content"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Écrivez votre note spirituelle ici..."
                    className="w-full h-64 p-3 rounded-lg border border-white/30 bg-white/90 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Étiquettes (séparées par des virgules)
                  </label>
                  <Input
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    placeholder="prière, méditation, réflexion..."
                    className="glass border-white/30 bg-white/90"
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="glass border-white/30 bg-white/90">
              <CardContent className="p-8 text-center">
                <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Sélectionnez une note à éditer
                </h3>
                <p className="text-gray-600">
                  Cliquez sur l'icône d'édition d'une note pour commencer à l'éditer
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default RichTextNotesApp;
