import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PenTool, Plus, Edit, Trash, Calendar, Tag, Search, Globe, Lock, Image, Mic, Upload, X, Play, Pause } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useCommunityContent } from '@/hooks/useCommunityContent';
import { useAuth } from '@/hooks/useAuth';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  imageUrl?: string;
  audioUrl?: string;
}

const NotesJournal = () => {
  const { user } = useAuth();
  const { publishContent } = useCommunityContent();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [audioPreview, setAudioPreview] = useState<string>('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    isPublic: false
  });

  useEffect(() => {
    const savedNotes = localStorage.getItem('journalNotes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  const saveNotes = (notesToSave: Note[]) => {
    setNotes(notesToSave);
    localStorage.setItem('journalNotes', JSON.stringify(notesToSave));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          description: "L'image ne doit pas dépasser 5MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedImage(file);
      
      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          description: "L'audio ne doit pas dépasser 10MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedAudio(file);
      
      // Créer un aperçu de l'audio
      const reader = new FileReader();
      reader.onload = (e) => {
        setAudioPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview('');
  };

  const removeAudio = () => {
    setSelectedAudio(null);
    setAudioPreview('');
    if (audioElement) {
      audioElement.pause();
      setAudioElement(null);
    }
    setIsPlayingAudio(false);
  };

  const toggleAudioPlayback = () => {
    if (!audioPreview) return;
    
    if (audioElement) {
      if (isPlayingAudio) {
        audioElement.pause();
        setIsPlayingAudio(false);
      } else {
        audioElement.play();
        setIsPlayingAudio(true);
      }
    } else {
      const audio = new Audio(audioPreview);
      audio.onended = () => setIsPlayingAudio(false);
      audio.play();
      setAudioElement(audio);
      setIsPlayingAudio(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        description: "Veuillez donner un titre à votre note",
        variant: "destructive",
      });
      return;
    }

    const tagsArray = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    // Simuler l'upload des fichiers (en réalité, il faudrait les uploader vers un service)
    let imageUrl = '';
    let audioUrl = '';
    
    if (selectedImage) {
      imageUrl = URL.createObjectURL(selectedImage);
    }
    
    if (selectedAudio) {
      audioUrl = URL.createObjectURL(selectedAudio);
    }

    if (editingNote) {
      const updatedNotes = notes.map(note =>
        note.id === editingNote.id
          ? {
              ...note,
              title: formData.title,
              content: formData.content,
              tags: tagsArray,
              isPublic: formData.isPublic,
              updatedAt: new Date().toISOString(),
              imageUrl: imageUrl || note.imageUrl,
              audioUrl: audioUrl || note.audioUrl
            }
          : note
      );
      saveNotes(updatedNotes);
      toast({
        title: "Note modifiée",
        description: "Votre note a été mise à jour avec succès",
      });
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title: formData.title,
        content: formData.content,
        tags: tagsArray,
        isPublic: formData.isPublic,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        imageUrl,
        audioUrl
      };
      
      saveNotes([newNote, ...notes]);

      // Si la note est publique, la publier dans la communauté
      if (formData.isPublic && user) {
        try {
          await publishContent({
            type: 'note',
            title: formData.title,
            content: formData.content,
            is_public: true,
          });
          toast({
            title: "📝 Note créée et partagée",
            description: "Votre note a été créée et partagée avec la communauté",
          });
        } catch (error) {
          toast({
            title: "📝 Note créée",
            description: "Note créée localement, erreur lors du partage communautaire",
          });
        }
      } else {
        toast({
          title: "📝 Note créée",
          description: "Votre note a été créée avec succès",
        });
      }
    }

    setFormData({ title: '', content: '', tags: '', isPublic: false });
    setSelectedImage(null);
    setSelectedAudio(null);
    setImagePreview('');
    setAudioPreview('');
    setEditingNote(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      tags: note.tags.join(', '),
      isPublic: note.isPublic
    });
    
    // Précharger les médias si ils existent
    if (note.imageUrl) {
      setImagePreview(note.imageUrl);
    }
    if (note.audioUrl) {
      setAudioPreview(note.audioUrl);
    }
    
    setIsDialogOpen(true);
  };

  const handleDelete = (noteId: string) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    saveNotes(updatedNotes);
    toast({
      description: "Note supprimée",
    });
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || note.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

  return (
    <div 
      className="min-h-screen p-2 xs:p-3 sm:p-4 space-y-3 sm:space-y-4 max-w-7xl mx-auto pb-20"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* En-tête moderne unifié */}
      <Card className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <CardHeader className="p-3 sm:p-4 lg:p-6">
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div 
                className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--accent-primary)' }}
              >
                <PenTool className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-base xs:text-lg sm:text-xl lg:text-2xl font-bold text-[var(--text-primary)] break-words">
                  Journal
                </CardTitle>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] break-words">
                  Organisez vos pensées et réflexions
                </p>
              </div>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="w-full xs:w-auto flex-shrink-0 text-xs sm:text-sm"
                  onClick={() => {
                    setEditingNote(null);
                    setFormData({ title: '', content: '', tags: '', isPublic: false });
                    setSelectedImage(null);
                    setSelectedAudio(null);
                    setImagePreview('');
                    setAudioPreview('');
                  }}
                >
                  <Plus size={14} className="mr-1 sm:mr-2" />
                  <span className="whitespace-nowrap">Ajouter une note</span>
                </Button>
              </DialogTrigger>
              
              <DialogContent className="max-w-[95vw] xs:max-w-2xl max-h-[95vh] overflow-y-auto mx-2 xs:mx-auto">
                <DialogHeader>
                  <DialogTitle className="text-sm sm:text-base">
                    {editingNote ? 'Modifier la note' : 'Créer une nouvelle note'}
                  </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  <div>
                    <Label className="text-xs sm:text-sm">Titre *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Titre de votre note"
                      className="text-xs sm:text-sm mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs sm:text-sm">Contenu</Label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Écrivez vos pensées..."
                      className="min-h-[100px] sm:min-h-[120px] text-xs sm:text-sm mt-1"
                      rows={4}
                    />
                  </div>

                  {/* Upload d'image - Responsive */}
                  <div>
                    <Label className="text-xs sm:text-sm">Image (optionnel)</Label>
                    <div className="space-y-2 sm:space-y-3 mt-1">
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <Label htmlFor="image-upload" className="cursor-pointer w-full">
                          <Button type="button" variant="outline" className="gap-2 w-full text-xs sm:text-sm h-8 sm:h-10" asChild>
                            <span>
                              <Image className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="whitespace-nowrap">Ajouter une image</span>
                            </span>
                          </Button>
                        </Label>
                      </div>
                      
                      {imagePreview && (
                        <div className="relative">
                          <img 
                            src={imagePreview} 
                            alt="Aperçu" 
                            className="w-full max-w-xs h-24 sm:h-32 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={removeImage}
                            className="absolute top-1 right-1 h-6 w-6 sm:h-8 sm:w-8 p-0"
                          >
                            <X className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload d'audio - Responsive */}
                  <div>
                    <Label className="text-xs sm:text-sm">Audio (optionnel)</Label>
                    <div className="space-y-2 sm:space-y-3 mt-1">
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="audio/*"
                          onChange={handleAudioUpload}
                          className="hidden"
                          id="audio-upload"
                        />
                        <Label htmlFor="audio-upload" className="cursor-pointer w-full">
                          <Button type="button" variant="outline" className="gap-2 w-full text-xs sm:text-sm h-8 sm:h-10" asChild>
                            <span>
                              <Mic className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="whitespace-nowrap">Ajouter un audio</span>
                            </span>
                          </Button>
                        </Label>
                      </div>
                      
                      {audioPreview && (
                        <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={toggleAudioPlayback}
                            className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                          >
                            {isPlayingAudio ? <Pause className="h-3 w-3 sm:h-4 sm:w-4" /> : <Play className="h-3 w-3 sm:h-4 sm:w-4" />}
                          </Button>
                          <span className="text-xs sm:text-sm text-gray-600 flex-1 min-w-0 break-words">
                            {selectedAudio?.name || 'Fichier audio'}
                          </span>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={removeAudio}
                            className="ml-auto flex-shrink-0 h-6 w-6 sm:h-8 sm:w-8 p-0"
                          >
                            <X className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs sm:text-sm">Tags</Label>
                    <Input
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="prière, réflexion, gratitude..."
                      className="text-xs sm:text-sm mt-1"
                    />
                    <p className="text-[10px] xs:text-xs text-gray-500 mt-1">Séparez les tags par des virgules</p>
                  </div>

                  {/* Switch de partage communautaire - Responsive */}
                  <div className="flex items-start space-x-2 p-2 sm:p-3 lg:p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <Switch
                      id="share-note"
                      checked={formData.isPublic}
                      onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <Label htmlFor="share-note" className="text-xs sm:text-sm font-medium cursor-pointer flex items-center gap-2 break-words">
                        {formData.isPublic ? (
                          <>
                            <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                            <span className="text-green-700">Partager avec la communauté</span>
                          </>
                        ) : (
                          <>
                            <Lock className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                            <span className="text-gray-700">Garder privé</span>
                          </>
                        )}
                      </Label>
                      <p className="text-[10px] xs:text-xs text-gray-600 mt-1 break-words">
                        {formData.isPublic 
                          ? "Cette note sera visible par tous les membres de la communauté"
                          : "Cette note restera privée et ne sera visible que par vous"
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col xs:flex-row gap-2">
                    <Button type="submit" className="flex-1 text-xs sm:text-sm h-8 sm:h-10">
                      {editingNote ? 'Modifier' : 'Créer'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      className="flex-1 text-xs sm:text-sm h-8 sm:h-10"
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Barre de recherche et filtres - Responsive */}
      <Card className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <CardContent className="p-2 xs:p-3 sm:p-4">
          <div className="space-y-2 sm:space-y-3">
            <div className="relative">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 sm:h-4 sm:w-4" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher dans vos notes..."
                className="pl-8 sm:pl-10 text-xs sm:text-sm h-8 sm:h-10"
              />
            </div>
            
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-1 sm:gap-2">
                <Button
                  variant={selectedTag === '' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTag('')}
                  className="text-[10px] xs:text-xs h-6 sm:h-7 px-2 sm:px-3"
                >
                  Tous
                </Button>
                {allTags.map(tag => (
                  <Button
                    key={tag}
                    variant={selectedTag === tag ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                    className="text-[10px] xs:text-xs h-6 sm:h-7 px-2 sm:px-3"
                  >
                    <Tag className="h-2 w-2 xs:h-3 xs:w-3 mr-1" />
                    <span className="break-words max-w-16 xs:max-w-20 sm:max-w-none truncate">{tag}</span>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Liste des notes - Responsive */}
      <div className="space-y-3 sm:space-y-4">
        {filteredNotes.length === 0 ? (
          <Card className="bg-[var(--bg-card)] border-[var(--border-default)]">
            <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
              <PenTool className="mx-auto mb-3 sm:mb-4 text-gray-400" size={32} />
              <p className="text-gray-600 mb-2 text-sm sm:text-base">
                {searchQuery || selectedTag ? 'Aucune note trouvée' : 'Aucune note pour le moment'}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 px-2 sm:px-4">
                {searchQuery || selectedTag ? 'Essayez avec d\'autres critères de recherche' : 'Commencez à écrire vos premières réflexions'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-md transition-shadow bg-[var(--bg-card)] border-[var(--border-default)]">
              <CardContent className="p-2 xs:p-3 sm:p-4">
                <div className="space-y-2 sm:space-y-3">
                  {/* En-tête de la note - Responsive */}
                  <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-2 sm:gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 mb-1">
                        <h3 className="font-semibold text-[var(--text-primary)] break-words text-sm sm:text-base">
                          {note.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          {note.isPublic ? (
                            <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" />
                          ) : (
                            <Lock className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col xs:flex-row xs:items-center gap-1 text-[10px] xs:text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-2 w-2 xs:h-3 xs:w-3 flex-shrink-0" />
                          <span>{new Date(note.createdAt).toLocaleDateString('fr-FR')}</span>
                        </div>
                        {note.updatedAt !== note.createdAt && (
                          <span className="text-gray-400 hidden xs:inline">• Modifié</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-1 flex-shrink-0 self-start xs:self-center">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(note)} className="p-1 h-6 w-6 sm:h-8 sm:w-8">
                        <Edit size={12} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(note.id)}
                        className="text-red-600 hover:text-red-700 p-1 h-6 w-6 sm:h-8 sm:w-8"
                      >
                        <Trash size={12} />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Contenu de la note */}
                  {note.content && (
                    <p className="text-[10px] xs:text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3 break-words">
                      {note.content}
                    </p>
                  )}

                  {/* Aperçu des médias - Responsive */}
                  {(note.imageUrl || note.audioUrl) && (
                    <div className="space-y-2">
                      {note.imageUrl && (
                        <div>
                          <img 
                            src={note.imageUrl} 
                            alt="Image de la note" 
                            className="w-full max-w-xs h-16 xs:h-20 sm:h-24 object-cover rounded border"
                          />
                        </div>
                      )}
                      {note.audioUrl && (
                        <div className="flex items-center gap-2 text-[10px] xs:text-xs sm:text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          <Mic className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span>Fichier audio joint</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Tags - Responsive */}
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map(tag => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="text-[9px] xs:text-[10px] sm:text-xs px-1.5 xs:px-2 py-0.5 xs:py-1 cursor-pointer hover:bg-gray-200"
                          onClick={() => setSelectedTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default NotesJournal;
