
import React, { useState } from 'react';
import { Camera, User, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useSupabaseData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const ProfilePhoto = () => {
  const { user } = useAuth();
  const { profile, updateProfile } = useProfile();
  const [uploading, setUploading] = useState(false);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: "La photo ne doit pas dépasser 5MB",
          variant: "destructive",
        });
        return;
      }

      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Type de fichier non supporté",
          description: "Veuillez sélectionner une image",
          variant: "destructive",
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/avatar.${fileExt}`;
      const filePath = fileName;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { 
          upsert: true,
          contentType: file.type
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      await updateProfile({
        avatar_url: data.publicUrl
      });

      toast({
        title: "Photo mise à jour",
        description: "Votre photo de profil a été mise à jour avec succès",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre photo de profil",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="glass border-white/30 bg-white/90 w-full max-w-sm">
      <CardContent className="p-4 sm:p-6 text-center">
        <div className="relative inline-block mb-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full spiritual-gradient flex items-center justify-center overflow-hidden ring-4 ring-white/50">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Photo de profil"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="text-white" size={32} />
            )}
          </div>
          <label className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full border-2 border-purple-500 flex items-center justify-center cursor-pointer hover:bg-purple-50 transition-colors shadow-lg">
            <Camera size={14} className="text-purple-600" />
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
        
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">
          {profile?.name || 'Utilisateur'}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-3">{user?.email}</p>
        
        <label className="w-full">
          <Button
            variant="outline"
            disabled={uploading}
            className="w-full text-xs sm:text-sm"
            asChild
          >
            <span>
              <Upload size={14} className="mr-2" />
              {uploading ? 'Téléchargement...' : 'Changer la photo'}
            </span>
          </Button>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </CardContent>
    </Card>
  );
};

export default ProfilePhoto;
