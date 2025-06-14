
-- Table pour le contenu communautaire
CREATE TABLE public.community_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  author_name VARCHAR NOT NULL,
  type VARCHAR NOT NULL CHECK (type IN ('prayer', 'note', 'verse', 'testimony')),
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  likes_count INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0
);

-- Table pour les notifications communautaires
CREATE TABLE public.community_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID REFERENCES public.community_content(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users,
  type VARCHAR NOT NULL CHECK (type IN ('new_content', 'content_liked', 'content_commented')),
  title VARCHAR NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  email_sent BOOLEAN NOT NULL DEFAULT false
);

-- Table pour les likes sur le contenu communautaire
CREATE TABLE public.community_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID REFERENCES public.community_content(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(content_id, user_id)
);

-- Table pour les commentaires
CREATE TABLE public.community_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID REFERENCES public.community_content(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  author_name VARCHAR NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS sur toutes les tables
ALTER TABLE public.community_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour community_content
CREATE POLICY "Tout le monde peut voir le contenu public" 
  ON public.community_content 
  FOR SELECT 
  USING (is_public = true);

CREATE POLICY "Les utilisateurs peuvent créer du contenu" 
  ON public.community_content 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent modifier leur contenu" 
  ON public.community_content 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent supprimer leur contenu" 
  ON public.community_content 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Politiques RLS pour community_notifications
CREATE POLICY "Les utilisateurs voient leurs notifications" 
  ON public.community_notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Le système peut créer des notifications" 
  ON public.community_notifications 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Les utilisateurs peuvent marquer leurs notifications comme lues" 
  ON public.community_notifications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Politiques RLS pour community_likes
CREATE POLICY "Tout le monde peut voir les likes" 
  ON public.community_likes 
  FOR SELECT 
  USING (true);

CREATE POLICY "Les utilisateurs peuvent aimer du contenu" 
  ON public.community_likes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent retirer leurs likes" 
  ON public.community_likes 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Politiques RLS pour community_comments
CREATE POLICY "Tout le monde peut voir les commentaires" 
  ON public.community_comments 
  FOR SELECT 
  USING (true);

CREATE POLICY "Les utilisateurs peuvent commenter" 
  ON public.community_comments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent supprimer leurs commentaires" 
  ON public.community_comments 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Fonction pour mettre à jour les compteurs
CREATE OR REPLACE FUNCTION update_content_counters()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'community_likes' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE community_content 
      SET likes_count = likes_count + 1 
      WHERE id = NEW.content_id;
      RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE community_content 
      SET likes_count = GREATEST(likes_count - 1, 0) 
      WHERE id = OLD.content_id;
      RETURN OLD;
    END IF;
  ELSIF TG_TABLE_NAME = 'community_comments' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE community_content 
      SET comments_count = comments_count + 1 
      WHERE id = NEW.content_id;
      RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE community_content 
      SET comments_count = GREATEST(comments_count - 1, 0) 
      WHERE id = OLD.content_id;
      RETURN OLD;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour mettre à jour les compteurs
CREATE TRIGGER update_likes_count
  AFTER INSERT OR DELETE ON community_likes
  FOR EACH ROW EXECUTE FUNCTION update_content_counters();

CREATE TRIGGER update_comments_count
  AFTER INSERT OR DELETE ON community_comments
  FOR EACH ROW EXECUTE FUNCTION update_content_counters();

-- Activer les mises à jour en temps réel
ALTER TABLE public.community_content REPLICA IDENTITY FULL;
ALTER TABLE public.community_notifications REPLICA IDENTITY FULL;
ALTER TABLE public.community_likes REPLICA IDENTITY FULL;
ALTER TABLE public.community_comments REPLICA IDENTITY FULL;

-- Ajouter les tables à la publication realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_content;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_comments;
