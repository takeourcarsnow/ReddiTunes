'use client';

import { useEffect, useState } from 'react';
import { useThemeStore } from '@/stores';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
    }
  }, [theme, mounted]);

  // Prevent flash of unstyled content
  if (!mounted) {
    return (
      <div className="min-h-screen bg-black">
        {children}
      </div>
    );
  }

  return <>{children}</>;
}
