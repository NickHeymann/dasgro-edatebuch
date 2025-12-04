'use client';

import { cn } from '@/lib/utils';
import { Home, Calendar, Globe, Heart, Settings, Sparkles } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'home', label: 'Home', icon: Home, emoji: '🏠' },
  { id: 'shows', label: 'Shows', icon: Sparkles, emoji: '🎭' },
  { id: 'aktiv', label: 'Aktiv', icon: Sparkles, emoji: '🏃' },
  { id: 'wellness', label: 'Wellness', icon: Sparkles, emoji: '💆' },
  { id: 'essen', label: 'Essen', icon: Sparkles, emoji: '🍽️' },
  { id: 'handwerk', label: 'Workshops', icon: Sparkles, emoji: '🔨' },
  { id: 'calendar', label: 'Kalender', icon: Calendar, emoji: '📅' },
  { id: 'travel', label: 'Travel', icon: Globe, emoji: '🌍' },
  { id: 'favorites', label: 'Favoriten', icon: Heart, emoji: '❤️' },
];

export function TopNavigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-rose-500 to-purple-500 text-white shadow-lg shadow-rose-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              )}
            >
              <span>{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

const bottomTabs = [
  { id: 'home', label: 'Home', emoji: '🏠' },
  { id: 'calendar', label: 'Kalender', emoji: '📅' },
  { id: 'travel', label: 'Travel', emoji: '🌍' },
  { id: 'favorites', label: 'Favoriten', emoji: '❤️' },
  { id: 'settings', label: 'Settings', emoji: '⚙️' },
];

export function BottomNavigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 pb-safe">
      <div className="flex justify-around py-2">
        {bottomTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all',
              activeTab === tab.id
                ? 'text-rose-400'
                : 'text-slate-500 hover:text-slate-300'
            )}
          >
            <span className="text-xl">{tab.emoji}</span>
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
