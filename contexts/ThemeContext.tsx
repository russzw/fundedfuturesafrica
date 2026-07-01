import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'darker';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  // Return a safe default during SSR or if context is missing
  if (!context) {
    return { theme: 'light' as Theme, setTheme: () => {} };
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('ffa_theme') as Theme | null;
    if (stored && ['light', 'dark', 'darker'].includes(stored)) {
      setThemeState(stored);
      applyTheme(stored);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setThemeState('dark');
      applyTheme('dark');
    }
  }, []);

  const applyTheme = (t: Theme) => {
    const root = document.documentElement;
    root.classList.remove('dark', 'darker');
    if (t === 'dark') root.classList.add('dark');
    else if (t === 'darker') root.classList.add('darker');
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem('ffa_theme', t);
    applyTheme(t);
  };

  // During SSR or before hydration, render without applying theme
  if (!mounted) {
    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
