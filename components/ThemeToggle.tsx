'use client';

import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};
