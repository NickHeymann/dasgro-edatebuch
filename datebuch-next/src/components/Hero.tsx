'use client';

import { Event, EventRating } from '@/types';
import { isPastEvent } from '@/lib/utils';

interface HeroProps {
  events: Event[];
  ratings: Record<string, EventRating>;
}

export function Hero({ events, ratings }: HeroProps) {
  const activeEvents = events.filter(e => !isPastEvent(e));
  const upcomingThisWeek = activeEvents.filter(e => {
    if (!e.date || e.date === 'dauerhaft') return false;
    const eventDate = new Date(e.date);
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return eventDate >= today && eventDate <= weekFromNow;
  });
  const favorites = Object.entries(ratings).filter(([_, r]) => r.liked).length;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 via-purple-500 to-indigo-500 p-8 mb-8">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Hey Nick & Solli! 💕
        </h1>
        <p className="text-white/80 text-lg mb-8">
          Was wollt ihr heute erleben?
        </p>

        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-white">{events.length}</div>
            <div className="text-sm text-white/70">Events</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white">{upcomingThisWeek.length}</div>
            <div className="text-sm text-white/70">Diese Woche</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white">{favorites}</div>
            <div className="text-sm text-white/70">Favoriten</div>
          </div>
        </div>
      </div>
    </div>
  );
}
