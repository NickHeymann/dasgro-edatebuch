'use client';

import { useState, useEffect } from 'react';
import { getUpcomingConcerts, getUpcomingShows, TicketmasterEvent } from '@/lib/api-service';

interface TicketmasterEventsProps {
  type: 'concerts' | 'shows';
  limit?: number;
}

export function TicketmasterEvents({ type, limit = 10 }: TicketmasterEventsProps) {
  const [events, setEvents] = useState<TicketmasterEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = type === 'concerts'
          ? await getUpcomingConcerts()
          : await getUpcomingShows();

        setEvents(data.slice(0, limit));
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, [type, limit]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-slate-800/50 rounded-xl p-4 animate-pulse">
            <div className="h-5 bg-slate-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-slate-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <p className="text-slate-400 text-center py-4">
        Keine {type === 'concerts' ? 'Konzerte' : 'Shows'} gefunden
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <a
          key={event.id}
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-slate-800/50 hover:bg-slate-800 rounded-xl p-4 transition-colors border border-slate-700/50 hover:border-rose-500/30"
        >
          <div className="flex gap-4">
            {event.image && (
              <img
                src={event.image}
                alt={event.name}
                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate">{event.name}</h3>
              <p className="text-sm text-slate-400">
                {new Date(event.date).toLocaleDateString('de-DE', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short'
                })}
                {event.time && ` • ${event.time.slice(0, 5)} Uhr`}
              </p>
              <p className="text-sm text-slate-500 truncate">{event.venue}</p>
              {event.priceRange && (
                <p className="text-sm text-rose-400 mt-1">{event.priceRange}</p>
              )}
            </div>
            <div className="flex-shrink-0 self-center">
              <span className="text-slate-400">→</span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}

// Section wrapper with title
export function TicketmasterSection({
  title,
  type,
  limit = 5
}: {
  title: string;
  type: 'concerts' | 'shows';
  limit?: number;
}) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
          via Ticketmaster
        </span>
      </div>
      <TicketmasterEvents type={type} limit={limit} />
    </section>
  );
}
