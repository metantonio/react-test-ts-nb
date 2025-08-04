import { useState, useMemo } from 'react';

// Define the shape of the application state
export interface AppState {
  theme: 'light' | 'dark';
  language: string;
}

// Define the actions that can be performed on the state
export interface AppActions {
  toggleTheme: () => void;
  setLanguage: (language: string) => void;
}

// The complete type for the app state slice
export type AppStateSlice = AppState & AppActions;

// Custom hook to manage application state
export const useAppState = (): AppStateSlice => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<string>('en');

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Memoize the context value to prevent unnecessary re-renders
  // This is crucial for performance when this is integrated into other contexts
  const value = useMemo(() => ({
    theme,
    language,
    toggleTheme,
    setLanguage,
  }), [theme, language]);

  return value;
};