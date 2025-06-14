
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
    md: '0.75rem',    // 12px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    full: '9999px',
  },
  
  // Shadows
  shadows: {
    light: '0 2px 4px rgba(0, 0, 0, 0.05)',
    dark: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  
  // Light theme colors (Travel App inspiration)
  light: {
    background: {
      primary: '#FFFFFF',
      secondary: '#F5F5F7',
      card: '#F5F5F7',
    },
    text: {
      primary: '#1C1C1E',
      secondary: 'rgba(60, 60, 67, 0.6)',
      inverse: '#FFFFFF',
    },
    border: {
      default: '#E0E0E5',
    },
    accent: {
      primary: '#0066FF',
    },
    shadow: 'rgba(0, 0, 0, 0.05)',
  },
  
  // Dark theme colors (Crypto App inspiration)
  dark: {
    background: {
      primary: '#12121A',
      secondary: '#1E1E2A',
      card: '#1E1E2A',
    },
    text: {
      primary: '#F2F2F7',
      secondary: 'rgba(209, 209, 224, 0.8)',
      inverse: '#12121A',
    },
    border: {
      default: '#2A2A3F',
    },
    accent: {
      primary: '#0066FF',
    },
    shadow: 'rgba(0, 0, 0, 0.2)',
  }
};

export type ThemeMode = 'light' | 'dark';
