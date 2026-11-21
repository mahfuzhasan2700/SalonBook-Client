'use client';

import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
}

export default function ThemeToggle({ showLabel = true, className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-180 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        isDark
          ? 'bg-[#241E23] text-[#F8F1ED] border-[#382E36] hover:bg-[#2d252c] focus:ring-roseDust'
          : 'bg-white text-[#291F26] border-[#EAE3DB] hover:bg-stone-50 focus:ring-[#80405A]'
      } ${className}`}
    >
      {isDark ? (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-300 transition-transform duration-180" />
          {showLabel && <span>Light Mode</span>}
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-[#80405A] transition-transform duration-180" />
          {showLabel && <span>Dark Mode</span>}
        </>
      )}
    </button>
  );
}
