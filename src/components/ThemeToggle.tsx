'use client';

import { useTheme } from 'next-themes';
import { Button } from './ui/Button';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <Button variant="secondary" size="sm" className="w-10 px-0">.</Button>;
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      className="w-10 px-0"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      title="Toggle theme"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </Button>
  );
}
