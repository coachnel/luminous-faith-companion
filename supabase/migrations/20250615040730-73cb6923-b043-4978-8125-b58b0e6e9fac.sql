
-- Table pour stocker les dernières visites des utilisateurs (pour l'indicateur "Nouveautés")
CREATE TABLE user_last_visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  last_visit_discover TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les statistiques de progression des plans de lecture
CREATE TABLE reading_plan_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_name TEXT NOT NULL,
  total_days INTEGER NOT NULL,
  completed_days INTEGER DEFAULT 0,
  completion_percentage DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les achievements/badges
CREATE TABLE user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_type TEXT NOT NULL, -- 'top_contributor', 'challenge_master', 'week_highlight', etc.
  achievement_name TEXT NOT NULL,
  description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_visible BOOLEAN DEFAULT true
);

-- Table pour le leaderboard des défis
CREATE TABLE challenge_leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  total_challenges_completed INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_days_completed INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les statistiques communautaires mensuelles
CREATE TABLE community_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  month_year TEXT NOT NULL, -- Format: 'YYYY-MM'
  total_prayers INTEGER DEFAULT 0,
  total_notes INTEGER DEFAULT 0,
  total_challenges INTEGER DEFAULT 0,
  total_plans_completed INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activer RLS sur toutes les tables
ALTER TABLE user_last_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_plan_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_stats ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour user_last_visits
CREATE POLICY "Users can view their own last visits" ON user_last_visits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own last visits" ON user_last_visits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own last visits" ON user_last_visits FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques RLS pour reading_plan_progress
CREATE POLICY "Users can view their own progress" ON reading_plan_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON reading_plan_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress" ON reading_plan_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques RLS pour user_achievements
CREATE POLICY "Users can view their own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public can view visible achievements" ON user_achievements FOR SELECT USING (is_visible = true);

-- Politiques RLS pour challenge_leaderboard
CREATE POLICY "Everyone can view leaderboard" ON challenge_leaderboard FOR SELECT TO authenticated;
CREATE POLICY "Users can update their own leaderboard entry" ON challenge_leaderboard FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own leaderboard entry" ON challenge_leaderboard FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques RLS pour community_stats
CREATE POLICY "Everyone can view community stats" ON community_stats FOR SELECT TO authenticated;

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_last_visits_updated_at BEFORE UPDATE ON user_last_visits FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_reading_plan_progress_updated_at BEFORE UPDATE ON reading_plan_progress FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_challenge_leaderboard_updated_at BEFORE UPDATE ON challenge_leaderboard FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
