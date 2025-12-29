'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Building2,
  Calendar,
  Kanban,
  CheckSquare,
  BarChart3,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const mainNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Leads', href: '/leads', icon: Sparkles, badge: 'AI' },
  { title: 'Appointments', href: '/appointments', icon: Calendar },
  { title: 'Contacts', href: '/contacts', icon: UserCircle },
  { title: 'Companies', href: '/companies', icon: Building2 },
  { title: 'Pipeline', href: '/pipeline', icon: Kanban },
  { title: 'Tasks', href: '/tasks', icon: CheckSquare },
  { title: 'Analytics', href: '/analytics', icon: BarChart3 },
];

const bottomNavItems: NavItem[] = [
  { title: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
    
    return (
      <Link
        href={item.href}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
          'hover:bg-gradient-to-r hover:from-indigo-500/10 hover:to-purple-500/10',
          isActive
            ? 'bg-gradient-to-r from-indigo-500/15 to-purple-500/15 text-indigo-600 dark:text-indigo-400 shadow-sm'
            : 'text-gray-600 dark:text-gray-400',
          collapsed && 'justify-center'
        )}
        onClick={() => setMobileOpen(false)}
      >
        <item.icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-indigo-500')} />
        {!collapsed && (
          <>
            <span className="flex-1">{item.title}</span>
            {item.badge && (
              <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                {item.badge}
              </span>
            )}
          </>
        )}
      </Link>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn('flex items-center gap-3 px-4 py-5 border-b border-gray-200 dark:border-gray-800', collapsed && 'justify-center px-2')}>
        <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
          <Sparkles className="w-5 h-5 text-white" />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              CRM AI
            </h1>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 -mt-0.5">AI-Powered CRM</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {mainNavItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-800 space-y-1">
        {bottomNavItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
        
        <button
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
            'text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>

      {/* Collapse Toggle (desktop only) */}
      <div className="hidden lg:block px-3 pb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-center"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-900 shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'lg:hidden fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300',
          collapsed ? 'w-[72px]' : 'w-64'
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
