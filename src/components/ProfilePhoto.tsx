
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

  const ensureBucketExists = async () => {
    try {
      // Vérifier si le bucket existe
      const { data: buckets } = await supabase.storage.listBuckets();
      const avatarBucket = buckets?.find(bucket => bucket.id === 'avatars');
      
      if (!avatarBucket) {
        console.log('Bucket avatars n\'existe pas, création en cours...');
        const { error: createError } = await supabase.storage.createBucket('avatars', {
          public: true,
          allowedMimeTypes: ['image/*'],
          fileSizeLimit: 5242880 // 5MB
        });
        
        if (createError) {
          console.error('Erreur création bucket:', createError);
          throw createError;
        }
        console.log('Bucket avatars créé avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification/création du bucket:', error);
      throw error;
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      console.log('=== DÉBUT UPLOAD PHOTO ===');
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        console.log('Aucun fichier sélectionné');
        toast({
          title: "Aucun fichier sélectionné",
          description: "Veuillez sélectionner une image",
          variant: "destructive",
        });
        return;
      }

      if (!user?.id) {
        console.log('Utilisateur non authentifié');
        toast({
          title: "Erreur d'authentification",
          description: "Vous devez être connecté pour modifier votre photo",
          variant: "destructive",
        });
        return;
      }

      const file = event.target.files[0];
      console.log('Fichier sélectionné:', {
        name: file.name,
        size: file.size,
        type: file.type
      });
      
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        console.log('Fichier trop volumineux:', file.size);
        toast({
          title: "Fichier trop volumineux",
          description: "La photo ne doit pas dépasser 5MB",
          variant: "destructive",
        });
        return;
      }

      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        console.log('Type de fichier invalide:', file.type);
        toast({
          title: "Type de fichier non supporté",
          description: "Veuillez sélectionner une image",
          variant: "destructive",
        });
        return;
      }

      // S'assurer que le bucket existe
      await ensureBucketExists();

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`;
      console.log('Nom du fichier pour upload:', fileName);

      // Upload file to Supabase Storage
      console.log('Début upload vers Supabase Storage...');
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { 
          upsert: true,
          contentType: file.type
        });

      if (uploadError) {
        console.error('Erreur upload:', uploadError);
        throw uploadError;
      }

      console.log('Upload réussi:', uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;
      console.log('URL publique générée:', publicUrl);

      // Update profile with new avatar URL
      console.log('Mise à jour du profil...');
      await updateProfile({
        avatar_url: publicUrl
      });

      console.log('Profil mis à jour avec succès');

      toast({
        title: "Photo mise à jour",
        description: "Votre photo de profil a été mise à jour avec succès",
      });

      // Reset file input
      event.target.value = '';
      console.log('=== FIN UPLOAD PHOTO (SUCCÈS) ===');
    } catch (error) {
      console.error('=== ERREUR UPLOAD PHOTO ===', error);
      toast({
        title: "Erreur",
        description: `Erreur lors de l'upload: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
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
                onError={(e) => {
                  console.error('Erreur chargement image avatar:', profile.avatar_url);
                  e.currentTarget.style.display = 'none';
                }}
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
            className="w-full text-xs sm:text-sm cursor-pointer"
          >
            <Upload size={14} className="mr-2" />
            {uploading ? 'Téléchargement...' : 'Changer la photo'}
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
