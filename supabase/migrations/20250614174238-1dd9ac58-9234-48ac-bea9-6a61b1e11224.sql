
-- Add theme_mode column to user_preferences table
ALTER TABLE public.user_preferences 
ADD COLUMN theme_mode character varying DEFAULT 'light';

-- Update existing records to have the default theme_mode
UPDATE public.user_preferences 
SET theme_mode = 'light' 
WHERE theme_mode IS NULL;
