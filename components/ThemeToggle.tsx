import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Eclipse } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="theme-toggle-pill">
      <button
        onClick={() => setTheme('light')}
        className={`theme-toggle-btn ${theme === 'light' ? 'active' : ''}`}
        aria-label="Light mode"
        title="Light"
      >
        <Sun size={16} />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`theme-toggle-btn ${theme === 'dark' ? 'active' : ''}`}
        aria-label="Dark mode"
        title="Dark"
      >
        <Moon size={16} />
      </button>
      <button
        onClick={() => setTheme('darker')}
        className={`theme-toggle-btn ${theme === 'darker' ? 'active' : ''}`}
        aria-label="Darker mode"
        title="Darker"
      >
        <Eclipse size={16} />
      </button>
    </div>
  );
};
