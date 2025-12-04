'use client';

import { useState, useEffect, useCallback } from 'react';
import { Event, EventRating } from '@/types';
import { isPastEvent, getRandomItem } from '@/lib/utils';
import { TopNavigation, BottomNavigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { QuickActions } from '@/components/QuickActions';
import { Recommendations } from '@/components/Recommendations';
import { EventCard } from '@/components/EventCard';

const STORAGE_KEY = 'datebuch_next_v1';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [ratings, setRatings] = useState<Record<string, EventRating>>({});
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);

  // Load events and ratings
  useEffect(() => {
    async function loadData() {
      try {
        // Load events from JSON (später von Supabase)
        const response = await fetch('/events.json');
        const data = await response.json();
        setEvents(data.events || []);

        // Load ratings from localStorage (später von Supabase)
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setRatings(parsed.ratings || {});
        }
      } catch (err) {
        console.error('Fehler beim Laden:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Save ratings
  const saveRatings = useCallback((newRatings: Record<string, EventRating>) => {
    setRatings(newRatings);
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    saved.ratings = newRatings;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  }, []);

  // Handle like/dislike
  const handleLike = useCallback((eventId: string) => {
    const newRatings = { ...ratings };
    newRatings[eventId] = {
      ...newRatings[eventId],
      liked: !newRatings[eventId]?.liked,
      disliked: false,
    };
    saveRatings(newRatings);
  }, [ratings, saveRatings]);

  const handleDislike = useCallback((eventId: string) => {
    const newRatings = { ...ratings };
    newRatings[eventId] = {
      ...newRatings[eventId],
      liked: false,
      disliked: !newRatings[eventId]?.disliked,
    };
    saveRatings(newRatings);
  }, [ratings, saveRatings]);

  // Get active events
  const activeEvents = events.filter(e => !isPastEvent(e) && !ratings[e.id]?.disliked);

  // Get recommendations
  const getRecommendations = useCallback(() => {
    const likedCategories: Record<string, number> = {};
    events.filter(e => ratings[e.id]?.liked).forEach(e => {
      likedCategories[e.category] = (likedCategories[e.category] || 0) + 1;
    });

    return activeEvents
      .filter(e => !ratings[e.id]?.liked)
      .map(e => {
        let score = Math.random() * 10;
        if (likedCategories[e.category]) score += likedCategories[e.category] * 10;
        return { ...e, score, reason: likedCategories[e.category] ? `Ihr mögt ${e.category}` : 'Für euch ausgewählt' };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [activeEvents, events, ratings]);

  // Filter by category
  const getEventsByCategory = useCallback((categories: string[]) => {
    return activeEvents.filter(e => categories.includes(e.category));
  }, [activeEvents]);

  // Random date
  const handleRandomDate = useCallback(() => {
    const random = getRandomItem(activeEvents);
    if (random) {
      alert(`🎲 Zufälliges Date: ${random.emoji} ${random.title}\n\n${random.description || ''}\n📍 ${random.location || ''}`);
    }
  }, [activeEvents]);

  // Mystery date
  const handleMysteryDate = useCallback(() => {
    const random = getRandomItem(activeEvents);
    if (random) {
      alert(`🎁 Mystery Date Enthüllung!\n\n${random.emoji} ${random.title}\n\n${random.description || ''}`);
    }
  }, [activeEvents]);

  // Love letter (placeholder)
  const handleLoveLetter = useCallback(() => {
    const text = prompt('💌 Schreib einen Liebesbrief an Solli:');
    if (text) {
      alert('💕 Dein Brief wurde gesendet!');
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">
            Datebuch
          </h1>
          <button className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            ⚙️
          </button>
        </div>
      </header>

      {/* Top Navigation */}
      <TopNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 pb-24">
        {activeTab === 'home' && (
          <>
            <Hero events={events} ratings={ratings} />
            <QuickActions
              onRandomDate={handleRandomDate}
              onMysteryDate={handleMysteryDate}
              onLoveLetter={handleLoveLetter}
              onTabChange={setActiveTab}
            />
            <Recommendations
              recommendations={getRecommendations()}
              onRefresh={() => {}}
              onSelect={(e) => alert(`${e.emoji} ${e.title}\n\n${e.description || ''}`)}
            />

            <h2 className="text-xl font-semibold text-white mb-4">Kommende Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeEvents
                .filter(e => e.date && e.date !== 'dauerhaft')
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 6)
                .map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    rating={ratings[event.id]}
                    onLike={handleLike}
                    onDislike={handleDislike}
                    onClick={(e) => alert(`${e.emoji} ${e.title}\n\n${e.description || ''}`)}
                  />
                ))}
            </div>
          </>
        )}

        {activeTab === 'shows' && (
          <>
            <h2 className="text-2xl font-bold text-white mb-2">Shows & Konzerte</h2>
            <p className="text-slate-400 mb-6">Theater, Musik & Varieté</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getEventsByCategory(['musical', 'variete', 'theater', 'musik', 'shows']).map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  rating={ratings[event.id]}
                  onLike={handleLike}
                  onDislike={handleDislike}
                />
              ))}
            </div>
          </>
        )}

        {activeTab === 'aktiv' && (
          <>
            <h2 className="text-2xl font-bold text-white mb-2">Aktiv</h2>
            <p className="text-slate-400 mb-6">Sport & Action</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getEventsByCategory(['aktiv']).map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  rating={ratings[event.id]}
                  onLike={handleLike}
                  onDislike={handleDislike}
                />
              ))}
            </div>
          </>
        )}

        {activeTab === 'wellness' && (
          <>
            <h2 className="text-2xl font-bold text-white mb-2">Wellness & Spa</h2>
            <p className="text-slate-400 mb-6">Entspannung pur</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getEventsByCategory(['wellness']).map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  rating={ratings[event.id]}
                  onLike={handleLike}
                  onDislike={handleDislike}
                />
              ))}
            </div>
          </>
        )}

        {activeTab === 'essen' && (
          <>
            <h2 className="text-2xl font-bold text-white mb-2">Essen & Restaurants</h2>
            <p className="text-slate-400 mb-6">Kulinarische Erlebnisse</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getEventsByCategory(['essen']).map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  rating={ratings[event.id]}
                  onLike={handleLike}
                  onDislike={handleDislike}
                />
              ))}
            </div>
          </>
        )}

        {activeTab === 'handwerk' && (
          <>
            <h2 className="text-2xl font-bold text-white mb-2">Workshops & Kurse</h2>
            <p className="text-slate-400 mb-6">Kreativ werden</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getEventsByCategory(['handwerk']).map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  rating={ratings[event.id]}
                  onLike={handleLike}
                  onDislike={handleDislike}
                />
              ))}
            </div>
          </>
        )}

        {activeTab === 'calendar' && (
          <div className="text-center py-12 text-slate-400">
            <div className="text-6xl mb-4">📅</div>
            <h2 className="text-xl font-semibold text-white mb-2">Kalender</h2>
            <p>Kalender-Ansicht kommt bald!</p>
          </div>
        )}

        {activeTab === 'travel' && (
          <div className="text-center py-12 text-slate-400">
            <div className="text-6xl mb-4">🌍</div>
            <h2 className="text-xl font-semibold text-white mb-2">Reiseziele</h2>
            <p>3D-Globus mit Strava/Komoot kommt bald!</p>
          </div>
        )}

        {activeTab === 'favorites' && (
          <>
            <h2 className="text-2xl font-bold text-white mb-2">Favoriten ❤️</h2>
            <p className="text-slate-400 mb-6">Eure gemerkten Events</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.filter(e => ratings[e.id]?.liked).map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  rating={ratings[event.id]}
                  onLike={handleLike}
                  onDislike={handleDislike}
                />
              ))}
              {events.filter(e => ratings[e.id]?.liked).length === 0 && (
                <div className="col-span-full text-center py-12 text-slate-400">
                  <div className="text-6xl mb-4">💔</div>
                  <p>Noch keine Favoriten. Markiert Events mit ❤️!</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Einstellungen</h2>
            <div className="space-y-4">
              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <h3 className="font-semibold text-white mb-2">💾 Daten</h3>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-slate-700 rounded-lg text-sm text-slate-300 hover:bg-slate-600">
                    📤 Backup
                  </button>
                  <button className="px-4 py-2 bg-slate-700 rounded-lg text-sm text-slate-300 hover:bg-slate-600">
                    📥 Laden
                  </button>
                </div>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <h3 className="font-semibold text-white mb-2">💕 Couple Sync</h3>
                <p className="text-sm text-slate-400 mb-2">Synchronisiert eure Bewertungen in Echtzeit</p>
                <button className="px-4 py-2 bg-rose-500 rounded-lg text-sm text-white hover:bg-rose-600">
                  Aktivieren (bald!)
                </button>
              </div>
            </div>
            <div className="mt-8 text-center text-slate-500 text-sm">
              Datebuch Next.js v1.0<br />
              Mit 💕 für Nick & Solli
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
