
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
      tertiary: '#F0F0F2',
      card: '#F5F5F7',
      overlay: 'rgba(0, 0, 0, 0.1)',
    },
    text: {
      primary: '#1C1C1E',
      secondary: 'rgba(60, 60, 67, 0.6)',
      tertiary: 'rgba(60, 60, 67, 0.4)',
      inverse: '#FFFFFF',
    },
    border: {
      default: '#E0E0E5',
      light: '#F0F0F2',
      medium: '#D1D1D6',
    },
    accent: {
      primary: '#0066FF',
      secondary: '#34C759',
      success: '#34C759',
      warning: '#FF9500',
      error: '#FF3B30',
    },
    spiritual: {
      primary: '#0066FF',
      secondary: '#F5F5F7',
      tertiary: '#E5E5EA',
      background: '#FAFAFA',
    },
    shadow: 'rgba(0, 0, 0, 0.05)',
  },
  
  // Dark theme colors (Crypto App inspiration)
  dark: {
    background: {
      primary: '#12121A',
      secondary: '#1E1E2A',
      tertiary: '#2A2A3F',
      card: '#1E1E2A',
      overlay: 'rgba(255, 255, 255, 0.1)',
    },
    text: {
      primary: '#F2F2F7',
      secondary: 'rgba(209, 209, 224, 0.8)',
      tertiary: 'rgba(209, 209, 224, 0.6)',
      inverse: '#12121A',
    },
    border: {
      default: '#2A2A3F',
      light: '#3A3A4F',
      medium: '#4A4A5F',
    },
    accent: {
      primary: '#0066FF',
      secondary: '#30D158',
      success: '#30D158',
      warning: '#FF9F0A',
      error: '#FF453A',
    },
    spiritual: {
      primary: '#0066FF',
      secondary: '#1E1E2A',
      tertiary: '#2A2A3F',
      background: '#181820',
    },
    shadow: 'rgba(0, 0, 0, 0.2)',
  }
};

export type ThemeMode = 'light' | 'dark';
