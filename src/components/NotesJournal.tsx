
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
    <div className="space-y-6 p-4 max-w-2xl mx-auto">
      {/* En-tête */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                <PenTool className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>Journal spirituel</CardTitle>
                <p className="text-sm text-gray-600">Organisez vos pensées et réflexions</p>
              </div>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => {
                    setEditingNote(null);
                    setFormData({ title: '', content: '', tags: '', isPublic: false });
                    setSelectedImage(null);
                    setSelectedAudio(null);
                    setImagePreview('');
                    setAudioPreview('');
                  }}
                >
                  <Plus size={16} className="mr-2" />
                  Ajouter une note
                </Button>
              </DialogTrigger>
              
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingNote ? 'Modifier la note' : 'Créer une nouvelle note'}
                  </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Titre *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Titre de votre note"
                    />
                  </div>
                  
                  <div>
                    <Label>Contenu</Label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Écrivez vos pensées..."
                      className="min-h-[120px]"
                      rows={6}
                    />
                  </div>

                  {/* Upload d'image */}
                  <div>
                    <Label>Image (optionnel)</Label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <Label htmlFor="image-upload" className="cursor-pointer">
                          <Button type="button" variant="outline" className="gap-2" asChild>
                            <span>
                              <Image className="h-4 w-4" />
                              Ajouter une image
                            </span>
                          </Button>
                        </Label>
                      </div>
                      
                      {imagePreview && (
                        <div className="relative">
                          <img 
                            src={imagePreview} 
                            alt="Aperçu" 
                            className="w-full max-w-sm h-32 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={removeImage}
                            className="absolute top-2 right-2"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload d'audio */}
                  <div>
                    <Label>Audio (optionnel)</Label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="audio/*"
                          onChange={handleAudioUpload}
                          className="hidden"
                          id="audio-upload"
                        />
                        <Label htmlFor="audio-upload" className="cursor-pointer">
                          <Button type="button" variant="outline" className="gap-2" asChild>
                            <span>
                              <Mic className="h-4 w-4" />
                              Ajouter un audio
                            </span>
                          </Button>
                        </Label>
                      </div>
                      
                      {audioPreview && (
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={toggleAudioPlayback}
                          >
                            {isPlayingAudio ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <span className="text-sm text-gray-600">
                            {selectedAudio?.name || 'Fichier audio'}
                          </span>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={removeAudio}
                            className="ml-auto"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label>Tags</Label>
                    <Input
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="prière, réflexion, gratitude..."
                    />
                    <p className="text-xs text-gray-500 mt-1">Séparez les tags par des virgules</p>
                  </div>

                  {/* Switch de partage communautaire */}
                  <div className="flex items-center space-x-2 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <Switch
                      id="share-note"
                      checked={formData.isPublic}
                      onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                    />
                    <div className="flex-1">
                      <Label htmlFor="share-note" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                        {formData.isPublic ? (
                          <>
                            <Globe className="h-4 w-4 text-green-600" />
                            <span className="text-green-700">Partager avec la communauté</span>
                          </>
                        ) : (
                          <>
                            <Lock className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700">Garder privé</span>
                          </>
                        )}
                      </Label>
                      <p className="text-xs text-gray-600 mt-1">
                        {formData.isPublic 
                          ? "Cette note sera visible par tous les membres de la communauté"
                          : "Cette note restera privée et ne sera visible que par vous"
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      {editingNote ? 'Modifier' : 'Créer'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      className="flex-1"
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

      {/* Barre de recherche et filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher dans vos notes..."
                className="pl-10"
              />
            </div>
            
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedTag === '' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTag('')}
                  className="text-xs"
                >
                  Tous
                </Button>
                {allTags.map(tag => (
                  <Button
                    key={tag}
                    variant={selectedTag === tag ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                    className="text-xs"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Liste des notes */}
      <div className="space-y-4">
        {filteredNotes.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <PenTool className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-600 mb-2">
                {searchQuery || selectedTag ? 'Aucune note trouvée' : 'Aucune note pour le moment'}
              </p>
              <p className="text-sm text-gray-500">
                {searchQuery || selectedTag ? 'Essayez avec d\'autres critères de recherche' : 'Commencez à écrire vos premières réflexions'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* En-tête de la note */}
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {note.title}
                        </h3>
                        {note.isPublic ? (
                          <Globe className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        ) : (
                          <Lock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(note.createdAt).toLocaleDateString('fr-FR')}</span>
                        {note.updatedAt !== note.createdAt && (
                          <span className="text-gray-400">• Modifié</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-1 flex-shrink-0">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(note)}>
                        <Edit size={14} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(note.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash size={14} />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Contenu de la note */}
                  {note.content && (
                    <p className="text-sm text-gray-700 leading-relaxed line-clamp-3 break-words">
                      {note.content}
                    </p>
                  )}

                  {/* Aperçu des médias */}
                  {(note.imageUrl || note.audioUrl) && (
                    <div className="space-y-2">
                      {note.imageUrl && (
                        <div>
                          <img 
                            src={note.imageUrl} 
                            alt="Image de la note" 
                            className="w-full max-w-xs h-24 object-cover rounded border"
                          />
                        </div>
                      )}
                      {note.audioUrl && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          <Mic className="h-4 w-4" />
                          <span>Fichier audio joint</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Tags */}
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map(tag => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="text-xs px-2 py-1 cursor-pointer hover:bg-gray-200"
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
