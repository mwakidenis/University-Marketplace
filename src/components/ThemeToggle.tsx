import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from 'lucide-react';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <button onClick={toggleTheme} className={`theme-toggle ${theme}`}>
      <span className="icon sun">
        <SunIcon className="w-4 h-4" />
      </span>
      <span className="icon moon">
        <MoonIcon className="w-4 h-4" />
      </span>
      <span className="dot" />
    </button>
  );
};

export default ThemeToggle;
