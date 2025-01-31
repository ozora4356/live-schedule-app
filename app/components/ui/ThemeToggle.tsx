'use client';

import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[72px] h-[24px]" />;
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex items-center space-x-2">
      <Sun
        className={`h-5 w-5 transition-opacity duration-300 cursor-pointer ${
          resolvedTheme === 'dark' ? 'opacity-50' : 'opacity-100'
        }`}
        onClick={toggleTheme}
      />
      <Switch
        id="theme-mode"
        checked={resolvedTheme === 'dark'}
        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
      />
      <Moon
        className={`h-5 w-5 transition-opacity duration-300 cursor-pointer ${
          resolvedTheme === 'dark' ? 'opacity-100' : 'opacity-50'
        }`}
        onClick={toggleTheme}
      />
      <Label htmlFor="theme-mode" className="sr-only">
        ダークモード切り替え
      </Label>
    </div>
  );
}
