
import React, { createContext, useContext, useEffect } from 'react';
import { useUserPreferences } from '@/hooks/useSupabaseData';
import { designTokens, ThemeMode } from '@/styles/designTokens';

interface ThemeContextType {
  theme: ThemeMode;
  colors: typeof designTokens.light;
  tokens: typeof designTokens;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { preferences, updatePreferences } = useUserPreferences();
  
  const theme: ThemeMode = preferences?.theme_mode === 'dark' ? 'dark' : 'light';
  const colors = theme === 'dark' ? designTokens.dark : designTokens.light;

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    try {
      await updatePreferences({ 
        theme_mode: newTheme === 'dark' ? 'dark' : 'light' 
      });
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  };

  const setTheme = async (newTheme: ThemeMode) => {
    try {
      await updatePreferences({ 
        theme_mode: newTheme === 'dark' ? 'dark' : 'light' 
      });
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  };

  // Appliquer les CSS variables au document avec contraste garanti
  useEffect(() => {
    const root = document.documentElement;
    
    // Supprimer les anciennes classes
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    const currentColors = colors;
    
    // Variables CSS pour couleurs principales avec contraste WCAG AA
    root.style.setProperty('--bg-primary', currentColors.background.primary);
    root.style.setProperty('--bg-secondary', currentColors.background.secondary);
    root.style.setProperty('--bg-tertiary', currentColors.background.tertiary);
    root.style.setProperty('--bg-card', currentColors.background.card);
    root.style.setProperty('--bg-overlay', currentColors.background.overlay);
    
    // Textes avec contraste optimal
    root.style.setProperty('--text-primary', currentColors.text.primary);
    root.style.setProperty('--text-secondary', currentColors.text.secondary);
    root.style.setProperty('--text-tertiary', currentColors.text.tertiary);
    root.style.setProperty('--text-inverse', currentColors.text.inverse);
    
    // Bordures et séparateurs
    root.style.setProperty('--border-default', currentColors.border.default);
    root.style.setProperty('--border-light', currentColors.border.light);
    root.style.setProperty('--border-medium', currentColors.border.medium);
    
    // Couleurs d'accent (bleu #0066FF uniquement)
    root.style.setProperty('--accent-primary', currentColors.accent.primary);
    root.style.setProperty('--accent-secondary', currentColors.accent.secondary);
    root.style.setProperty('--accent-success', currentColors.accent.success);
    root.style.setProperty('--accent-warning', currentColors.accent.warning);
    root.style.setProperty('--accent-error', currentColors.accent.error);
    
    // Variables spirituelles spécifiques
    root.style.setProperty('--spiritual-primary', currentColors.spiritual.primary);
    root.style.setProperty('--spiritual-secondary', currentColors.spiritual.secondary);
    root.style.setProperty('--spiritual-tertiary', currentColors.spiritual.tertiary);
    root.style.setProperty('--spiritual-background', currentColors.spiritual.background);
    
    // Ombres adaptatives
    root.style.setProperty('--shadow', currentColors.shadow);
    
  }, [theme, colors]);

  return (
    <ThemeContext.Provider value={{ theme, colors, tokens: designTokens, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
