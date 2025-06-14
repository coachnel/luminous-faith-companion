
-- Ajouter des colonnes pour le partage communautaire dans la table notes
ALTER TABLE public.notes 
ADD COLUMN is_public boolean DEFAULT false,
ADD COLUMN shared_at timestamp with time zone,
ADD COLUMN links text[] DEFAULT '{}';

-- Ajouter des colonnes pour le partage communautaire dans la table challenges (si elle existe)
-- Si la table challenges n'existe pas encore, la créer
CREATE TABLE IF NOT EXISTS public.challenges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  description text,
  target_days integer DEFAULT 30,
  is_public boolean DEFAULT false,
  shared_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Ajouter les politiques RLS pour les défis
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own challenges" 
  ON public.challenges 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own challenges" 
  ON public.challenges 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own challenges" 
  ON public.challenges 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own challenges" 
  ON public.challenges 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Permettre à tous de voir les défis publics
CREATE POLICY "Anyone can view public challenges" 
  ON public.challenges 
  FOR SELECT 
  USING (is_public = true);

-- Permettre à tous de voir les notes publiques
CREATE POLICY "Anyone can view public notes" 
  ON public.notes 
  FOR SELECT 
  USING (is_public = true);

-- Mettre à jour la fonction de trigger pour gérer les timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Ajouter le trigger pour la table challenges
DROP TRIGGER IF EXISTS update_challenges_updated_at ON public.challenges;
CREATE TRIGGER update_challenges_updated_at 
    BEFORE UPDATE ON public.challenges 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Ajouter le trigger pour la table notes
DROP TRIGGER IF EXISTS update_notes_updated_at ON public.notes;
CREATE TRIGGER update_notes_updated_at 
    BEFORE UPDATE ON public.notes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
