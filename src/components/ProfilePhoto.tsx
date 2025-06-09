
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
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

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
    <Card className="glass border-white/30 bg-white/90">
      <CardContent className="p-6 text-center">
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-full spiritual-gradient flex items-center justify-center overflow-hidden">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Photo de profil"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="text-white" size={40} />
            )}
          </div>
          <label className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border-2 border-purple-500 flex items-center justify-center cursor-pointer hover:bg-purple-50 transition-colors">
            <Camera size={16} className="text-purple-600" />
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {profile?.name || 'Utilisateur'}
        </h3>
        <p className="text-sm text-gray-600 mb-4">{user?.email}</p>
        
        <label className="w-full">
          <Button
            variant="outline"
            disabled={uploading}
            className="w-full"
            asChild
          >
            <span>
              <Upload size={16} className="mr-2" />
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
