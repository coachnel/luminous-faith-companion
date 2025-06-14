
export const designTokens = {
  // Spacing
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '0.75rem',    // 12px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    '2xl': '2rem',    // 32px
    '3xl': '3rem',    // 48px
  },
  
  // Border radius
  radius: {
    sm: '0.375rem',   // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  
  // Light theme colors (Travel App inspiration)
  light: {
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
      card: '#ffffff',
      overlay: 'rgba(255, 255, 255, 0.95)',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      tertiary: '#64748b',
      inverse: '#ffffff',
    },
    border: {
      default: '#e2e8f0',
      light: '#f1f5f9',
      medium: '#cbd5e1',
    },
    accent: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    spiritual: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      tertiary: '#a78bfa',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }
  },
  
  // Dark theme colors (Crypto App inspiration) - CORRIGÉ pour lisibilité
  dark: {
    background: {
      primary: '#0a0e1a',        // Noir profond mais pas total
      secondary: '#1a1f35',      // Bleu très foncé
      tertiary: '#252b47',       // Bleu foncé plus clair
      card: '#1e2642',           // Cartes en bleu foncé
      overlay: 'rgba(10, 14, 26, 0.95)',
    },
    text: {
      primary: '#f8fafc',        // Blanc presque pur
      secondary: '#e2e8f0',      // Gris très clair
      tertiary: '#cbd5e1',       // Gris clair
      inverse: '#0a0e1a',
    },
    border: {
      default: '#334155',
      light: '#475569',
      medium: '#64748b',
    },
    accent: {
      primary: '#60a5fa',        // Bleu électrique plus visible
      secondary: '#a78bfa',      // Violet électrique
      success: '#34d399',        // Vert crypto
      warning: '#fbbf24',        // Orange électrique
      error: '#f87171',          // Rouge électrique
    },
    spiritual: {
      primary: '#818cf8',        // Indigo électrique
      secondary: '#a78bfa',      // Violet électrique
      tertiary: '#c4b5fd',       // Violet clair
      background: 'linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)',
    }
  }
};

export type ThemeMode = 'light' | 'dark';
