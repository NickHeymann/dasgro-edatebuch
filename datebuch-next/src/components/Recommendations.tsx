'use client';

import { Event } from '@/types';
import { getCountdown, cn } from '@/lib/utils';
import { RefreshCw, Sparkles } from 'lucide-react';

interface RecommendationsProps {
  recommendations: Array<Event & { score: number; reason: string }>;
  onRefresh: () => void;
  onSelect: (event: Event) => void;
}

export function Recommendations({ recommendations, onRefresh, onSelect }: RecommendationsProps) {
  return (
    <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-rose-500/10 border border-purple-500/20">
      <div className="flex items-center justify-between mb-5">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
          <Sparkles className="w-5 h-5 text-purple-400" />
          Für euch empfohlen
        </h2>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Neu
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {recommendations.map((event) => {
          const countdown = getCountdown(event.date);
          const matchPercent = Math.round(70 + (event.score / 50) * 25);

          return (
            <div
              key={event.id}
              onClick={() => onSelect(event)}
              className={cn(
                'flex-shrink-0 w-72 p-5 rounded-xl',
                'bg-slate-800/70 border border-slate-700/50',
                'hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10',
                'cursor-pointer transition-all'
              )}
            >
              {/* Match Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                  {matchPercent}% Match
                </span>
                {countdown && countdown.class !== 'past' && (
                  <span
                    className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      countdown.class === 'today' && 'bg-green-500 text-white',
                      countdown.class === 'soon' && 'bg-amber-500/20 text-amber-400'
                    )}
                  >
                    {countdown.text}
                  </span>
                )}
              </div>

              {/* Event Info */}
              <div className="text-3xl mb-3">{event.emoji || '💕'}</div>
              <h3 className="font-semibold text-white mb-1 line-clamp-1">{event.title}</h3>
              <p className="text-sm text-purple-300 mb-2">{event.reason}</p>
              <p className="text-sm text-slate-400 line-clamp-1">{event.location}</p>
            </div>
          );
        })}

        {recommendations.length === 0 && (
          <div className="w-full text-center py-8 text-slate-400">
            <p>Bewertet mehr Events für bessere Empfehlungen! 💕</p>
          </div>
        )}
      </div>
    </div>
  );
}
