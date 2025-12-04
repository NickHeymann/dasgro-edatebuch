'use client';

import { cn } from '@/lib/utils';

interface QuickActionsProps {
  onRandomDate: () => void;
  onMysteryDate: () => void;
  onLoveLetter: () => void;
  onTabChange: (tab: string) => void;
}

const actions = [
  { id: 'random', label: 'Zufälliges Date', emoji: '🎲', color: 'from-amber-500 to-orange-500' },
  { id: 'mystery', label: 'Mystery Date', emoji: '🎁', color: 'from-purple-500 to-indigo-500' },
  { id: 'wellness', label: 'Wellness', emoji: '💆', color: 'from-teal-500 to-cyan-500' },
  { id: 'shows', label: 'Shows', emoji: '🎭', color: 'from-rose-500 to-pink-500' },
  { id: 'love', label: 'Liebesbrief', emoji: '💌', color: 'from-red-500 to-rose-500' },
  { id: 'essen', label: 'Essen gehen', emoji: '🍽️', color: 'from-green-500 to-emerald-500' },
];

export function QuickActions({ onRandomDate, onMysteryDate, onLoveLetter, onTabChange }: QuickActionsProps) {
  const handleClick = (actionId: string) => {
    switch (actionId) {
      case 'random':
        onRandomDate();
        break;
      case 'mystery':
        onMysteryDate();
        break;
      case 'love':
        onLoveLetter();
        break;
      case 'wellness':
      case 'shows':
      case 'essen':
        onTabChange(actionId);
        break;
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleClick(action.id)}
            className={cn(
              'relative overflow-hidden rounded-2xl p-5 text-center transition-all',
              'bg-slate-800/50 border border-slate-700/50',
              'hover:scale-105 hover:shadow-lg hover:shadow-rose-500/10',
              'group'
            )}
          >
            {/* Gradient overlay on hover */}
            <div
              className={cn(
                'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity',
                `bg-gradient-to-br ${action.color}`
              )}
              style={{ opacity: 0.1 }}
            />

            <div className="relative">
              <div className="text-3xl mb-2">{action.emoji}</div>
              <div className="text-sm font-medium text-slate-300 group-hover:text-white">
                {action.label}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
