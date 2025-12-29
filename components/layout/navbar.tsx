'use client';

import { Bell, Search, Plus, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeSwitcher } from '@/components/theme-switcher';

interface NavbarProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function Navbar({ title, subtitle, actions }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 lg:px-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
      {/* Left - Title */}
      <div className="flex items-center gap-4">
        <div className="hidden lg:block">
          {title && (
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-xl mx-4 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search leads, contacts, deals..."
            className="pl-10 pr-20 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-900 transition-colors"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-gray-400">
            <kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 font-mono">
              <Command className="w-3 h-3 inline" />
            </kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 font-mono">K</kbd>
          </div>
        </div>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-2">
        {actions}
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </Button>
        
        <ThemeSwitcher />
        
        <Button className="hidden sm:flex gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25">
          <Plus className="w-4 h-4" />
          <span>New</span>
        </Button>

        {/* User Avatar */}
        <div className="ml-2 w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-medium text-sm shadow-lg">
          U
        </div>
      </div>
    </header>
  );
}
