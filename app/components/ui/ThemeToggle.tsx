'use client';

import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Moon, Sun } from 'lucide-react';
import { useState } from 'react';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted] = useState(true);

  if (!mounted) {
    return <div className="w-[72px] h-[24px]" />;
  }

  return (
    <div className="flex items-center space-x-2">
      <Sun className={`h-5 w-5 transition-opacity duration-300 ${resolvedTheme === 'dark' ? 'opacity-50' : 'opacity-100'}`} />
      <Switch
        id="theme-mode"
        checked={resolvedTheme === 'dark'}
        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
      />
      <Moon className={`h-5 w-5 transition-opacity duration-300 ${resolvedTheme === 'dark' ? 'opacity-100' : 'opacity-50'}`} />
      <Label htmlFor="theme-mode" className="sr-only">
        ダークモード切り替え
      </Label>
    </div>
  );
}
