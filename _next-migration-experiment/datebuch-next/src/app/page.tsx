'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Search, Heart, Calendar, Settings,
  Sparkles, MapPin, Clock, ChevronRight,
  RefreshCw, Star, Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Location, DatePlan } from '@/types';
import { getLocations, getSuggestedDate, smartSearch } from '@/lib/location-service';
import { getCurrentWeather, type WeatherData } from '@/lib/api-service';

// =============================================
// MAIN APP
// =============================================

export default function DatebuchApp() {
  const [activeTab, setActiveTab] = useState<'home' | 'plan' | 'discover' | 'collection' | 'calendar'>('home');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [suggestion, setSuggestion] = useState<{
    restaurant?: Location;
    activity?: Location;
    bar?: Location;
    reason: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        // Get weather
        const weatherData = await getCurrentWeather();
        setWeather(weatherData);

        // Get suggestion based on context
        const now = new Date();
        const suggestionData = await getSuggestedDate({
          dayOfWeek: now.getDay(),
          hour: now.getHours(),
          weather: weatherData ? {
            temp: weatherData.temp,
            isRainy: weatherData.description.toLowerCase().includes('regen'),
          } : undefined,
        });
        setSuggestion(suggestionData);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const refreshSuggestion = async () => {
    setLoading(true);
    const now = new Date();
    const suggestionData = await getSuggestedDate({
      dayOfWeek: now.getDay(),
      hour: now.getHours(),
      weather: weather ? {
        temp: weather.temp,
        isRainy: weather.description.toLowerCase().includes('regen'),
      } : undefined,
    });
    setSuggestion(suggestionData);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <Header weather={weather} />

      {/* Main Content */}
      <main className="pb-24">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <HomeTab
              key="home"
              suggestion={suggestion}
              weather={weather}
              loading={loading}
              onRefresh={refreshSuggestion}
              onPlan={() => setActiveTab('plan')}
            />
          )}
          {activeTab === 'plan' && (
            <PlanTab key="plan" />
          )}
          {activeTab === 'discover' && (
            <DiscoverTab key="discover" />
          )}
          {activeTab === 'collection' && (
            <CollectionTab key="collection" />
          )}
          {activeTab === 'calendar' && (
            <CalendarTab key="calendar" />
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

// =============================================
// HEADER
// =============================================

function Header({ weather }: { weather: WeatherData | null }) {
  const greeting = getGreeting();
  const dayInfo = getDayInfo();

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50">
      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Datebuch
              </span>
            </h1>
            <p className="text-sm text-slate-400">{greeting}</p>
          </div>
          <div className="flex items-center gap-3">
            {weather && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/50 rounded-full text-sm">
                <span>{getWeatherEmoji(weather.icon)}</span>
                <span className="font-medium">{weather.temp}°</span>
              </div>
            )}
            <button className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </div>
        <p className="mt-2 text-slate-500 text-sm">{dayInfo}</p>
      </div>
    </header>
  );
}

// =============================================
// HOME TAB - "Heute für euch"
// =============================================

function HomeTab({
  suggestion,
  weather,
  loading,
  onRefresh,
  onPlan
}: {
  suggestion: {
    restaurant?: Location;
    activity?: Location;
    bar?: Location;
    reason: string;
  } | null;
  weather: WeatherData | null;
  loading: boolean;
  onRefresh: () => void;
  onPlan: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-lg mx-auto px-4 py-6"
    >
      {/* Context Badge */}
      <div className="flex items-center gap-2 mb-6">
        <div className="px-3 py-1.5 bg-gradient-to-r from-rose-500/20 to-purple-500/20 rounded-full border border-rose-500/30">
          <span className="text-sm text-rose-300">
            {weather && weather.temp < 10
              ? '❄️ Gemütlich drinnen'
              : weather && weather.temp > 20
                ? '☀️ Perfekt für draußen'
                : '✨ Schöner Abend'}
          </span>
        </div>
      </div>

      {/* Main Suggestion Card */}
      <div className="relative">
        <motion.div
          className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-3xl border border-slate-700/50 overflow-hidden"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          {/* Gradient Accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500" />

          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="text-rose-400" size={20} />
                <h2 className="text-lg font-semibold text-white">Unser Vorschlag</h2>
              </div>
              <button
                onClick={onRefresh}
                disabled={loading}
                className="p-2 rounded-full hover:bg-slate-700/50 transition-colors"
              >
                <RefreshCw size={18} className={cn("text-slate-400", loading && "animate-spin")} />
              </button>
            </div>

            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                <p className="mt-4 text-sm text-slate-500">Suche perfektes Date...</p>
              </div>
            ) : suggestion ? (
              <div className="space-y-4">
                {/* Timeline */}
                <div className="relative pl-6 border-l-2 border-slate-700 space-y-6">
                  {suggestion.restaurant && (
                    <SuggestionItem
                      time="18:30"
                      location={suggestion.restaurant}
                      type="Essen"
                      emoji="🍽️"
                    />
                  )}
                  {suggestion.activity && (
                    <SuggestionItem
                      time="20:00"
                      location={suggestion.activity}
                      type="Aktivität"
                      emoji="🎭"
                    />
                  )}
                  {suggestion.bar && (
                    <SuggestionItem
                      time="22:30"
                      location={suggestion.bar}
                      type="Absacker"
                      emoji="🍸"
                    />
                  )}
                </div>

                {/* Reason */}
                <p className="text-sm text-slate-500 italic mt-4">
                  {suggestion.reason}
                </p>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button className="flex-1 py-3 px-4 bg-gradient-to-r from-rose-500 to-purple-500 rounded-xl font-medium text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                    <Heart size={18} />
                    Das machen wir!
                  </button>
                  <button
                    onClick={onRefresh}
                    className="py-3 px-4 bg-slate-700/50 rounded-xl font-medium text-slate-300 hover:bg-slate-700 transition-colors"
                  >
                    Neu
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-slate-500">
                  Noch keine Locations vorhanden.<br />
                  Importiere zuerst Hamburg-Daten!
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Links */}
      <div className="mt-8 grid grid-cols-2 gap-3">
        <QuickLinkCard
          emoji="✨"
          title="Selbst planen"
          subtitle="Date Builder"
          onClick={onPlan}
          gradient="from-purple-500/20 to-indigo-500/20"
        />
        <QuickLinkCard
          emoji="🎲"
          title="Überrasch mich"
          subtitle="Zufälliges Date"
          onClick={onRefresh}
          gradient="from-rose-500/20 to-pink-500/20"
        />
      </div>

      {/* Recent Dates */}
      <section className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Letzte Dates</h3>
          <button className="text-sm text-rose-400 flex items-center gap-1">
            Alle <ChevronRight size={16} />
          </button>
        </div>
        <div className="text-center py-8 text-slate-500 border border-dashed border-slate-700 rounded-xl">
          <p>Noch keine Dates geplant</p>
          <p className="text-sm mt-1">Plant euer erstes Date!</p>
        </div>
      </section>
    </motion.div>
  );
}

function SuggestionItem({
  time,
  location,
  type,
  emoji
}: {
  time: string;
  location: Location;
  type: string;
  emoji: string;
}) {
  const tags = location.tags?.slice(0, 2).map(t => t.tag) || [];

  return (
    <div className="relative">
      {/* Timeline Dot */}
      <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-gradient-to-r from-rose-500 to-purple-500" />

      <div className="flex items-start gap-3">
        <div className="text-sm text-slate-500 font-medium w-12">{time}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">{emoji}</span>
            <h4 className="font-medium text-white">{location.name}</h4>
          </div>
          <p className="text-sm text-slate-400 mt-0.5">
            {type} {location.district && `• ${location.district}`}
          </p>
          {tags.length > 0 && (
            <div className="flex gap-1.5 mt-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs bg-slate-700/50 rounded-full text-slate-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickLinkCard({
  emoji,
  title,
  subtitle,
  onClick,
  gradient
}: {
  emoji: string;
  title: string;
  subtitle: string;
  onClick: () => void;
  gradient: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "p-4 rounded-2xl border border-slate-700/50 text-left transition-all",
        `bg-gradient-to-br ${gradient}`
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="text-2xl">{emoji}</span>
      <h4 className="font-medium text-white mt-2">{title}</h4>
      <p className="text-sm text-slate-400">{subtitle}</p>
    </motion.button>
  );
}

// =============================================
// PLAN TAB - "Date Builder"
// =============================================

function PlanTab() {
  const [step, setStep] = useState(1);
  const [occasion, setOccasion] = useState<string | null>(null);
  const [activity, setActivity] = useState<string | null>(null);

  const occasions = [
    { id: 'normal', emoji: '✨', label: 'Normaler Abend' },
    { id: 'special', emoji: '🎉', label: 'Etwas Besonderes' },
    { id: 'spontan', emoji: '⚡', label: 'Spontan' },
    { id: 'relax', emoji: '💆', label: 'Entspannen' },
  ];

  const activities = [
    { id: 'essen', emoji: '🍽️', label: 'Essen gehen' },
    { id: 'kultur', emoji: '🎭', label: 'Kultur' },
    { id: 'aktiv', emoji: '🏃', label: 'Aktivität' },
    { id: 'ausgehen', emoji: '🍸', label: 'Ausgehen' },
    { id: 'draussen', emoji: '🌳', label: 'Draußen' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-lg mx-auto px-4 py-6"
    >
      <h2 className="text-2xl font-bold text-white mb-2">Date Builder</h2>
      <p className="text-slate-400 mb-8">Baut euer perfektes Date zusammen</p>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map(s => (
          <div
            key={s}
            className={cn(
              "flex-1 h-1 rounded-full transition-colors",
              s <= step ? "bg-gradient-to-r from-rose-500 to-purple-500" : "bg-slate-700"
            )}
          />
        ))}
      </div>

      {/* Step 1: Occasion */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Was ist der Anlass?</h3>
          <div className="grid grid-cols-2 gap-3">
            {occasions.map(o => (
              <button
                key={o.id}
                onClick={() => { setOccasion(o.id); setStep(2); }}
                className={cn(
                  "p-4 rounded-xl border text-left transition-all",
                  occasion === o.id
                    ? "border-rose-500 bg-rose-500/10"
                    : "border-slate-700 hover:border-slate-600"
                )}
              >
                <span className="text-2xl">{o.emoji}</span>
                <p className="font-medium text-white mt-2">{o.label}</p>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Step 2: Core Activity */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Was ist der Kern?</h3>
          <div className="grid grid-cols-2 gap-3">
            {activities.map(a => (
              <button
                key={a.id}
                onClick={() => { setActivity(a.id); setStep(3); }}
                className={cn(
                  "p-4 rounded-xl border text-left transition-all",
                  activity === a.id
                    ? "border-rose-500 bg-rose-500/10"
                    : "border-slate-700 hover:border-slate-600"
                )}
              >
                <span className="text-2xl">{a.emoji}</span>
                <p className="font-medium text-white mt-2">{a.label}</p>
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep(1)}
            className="mt-4 text-sm text-slate-400 hover:text-white"
          >
            ← Zurück
          </button>
        </motion.div>
      )}

      {/* Step 3: Suggestions */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Unsere Vorschläge</h3>
          <div className="text-center py-12 border border-dashed border-slate-700 rounded-xl">
            <p className="text-slate-500">
              Location-Vorschläge werden geladen...<br />
              <span className="text-sm">Importiere zuerst Hamburg-Daten!</span>
            </p>
          </div>
          <button
            onClick={() => setStep(2)}
            className="mt-4 text-sm text-slate-400 hover:text-white"
          >
            ← Zurück
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

// =============================================
// DISCOVER TAB - "Was gibt's?"
// =============================================

function DiscoverTab() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const locations = await smartSearch(query);
    setResults(locations);
    setLoading(false);
  };

  const suggestions = [
    'Beste Carbonara',
    'Bar mit Flipper',
    'Romantisches Restaurant',
    'Veganes Frühstück',
    'Cocktailbar Schanze',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-lg mx-auto px-4 py-6"
    >
      <h2 className="text-2xl font-bold text-white mb-2">Entdecken</h2>
      <p className="text-slate-400 mb-6">Finde den perfekten Ort</p>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="z.B. 'Beste Carbonara' oder 'Bar mit Kicker'"
          className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
        />
      </div>

      {/* Quick Suggestions */}
      <div className="flex flex-wrap gap-2 mt-4">
        {suggestions.map(s => (
          <button
            key={s}
            onClick={() => { setQuery(s); }}
            className="px-3 py-1.5 bg-slate-800/50 rounded-full text-sm text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="mt-8 flex justify-center">
          <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : results.length > 0 ? (
        <div className="mt-8 space-y-3">
          {results.map(loc => (
            <LocationCard key={loc.id} location={loc} />
          ))}
        </div>
      ) : query && !loading ? (
        <div className="mt-12 text-center text-slate-500">
          <p>Keine Ergebnisse für "{query}"</p>
          <p className="text-sm mt-1">Versuche eine andere Suche</p>
        </div>
      ) : (
        <div className="mt-12 text-center text-slate-500">
          <Search size={48} className="mx-auto mb-4 opacity-30" />
          <p>Suche nach Orten, Tags oder Gerichten</p>
        </div>
      )}
    </motion.div>
  );
}

function LocationCard({ location }: { location: Location }) {
  const tags = location.tags?.slice(0, 3).map(t => t.tag) || [];
  const typeEmoji: Record<string, string> = {
    restaurant: '🍽️',
    bar: '🍸',
    cafe: '☕',
    club: '🎵',
    venue: '🎭',
    activity: '🎯',
  };

  return (
    <motion.div
      className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{typeEmoji[location.type] || '📍'}</span>
          <div>
            <h4 className="font-medium text-white">{location.name}</h4>
            <p className="text-sm text-slate-400">
              {location.district || location.city}
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
          <Heart size={18} className="text-slate-500" />
        </button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs bg-slate-700/50 rounded-full text-slate-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// =============================================
// COLLECTION TAB - "Unsere Orte"
// =============================================

function CollectionTab() {
  const tabs = [
    { id: 'favorites', emoji: '❤️', label: 'Favoriten', count: 0 },
    { id: 'visited', emoji: '✓', label: 'Waren wir', count: 0 },
    { id: 'wishlist', emoji: '📌', label: 'Wollen wir', count: 0 },
  ];
  const [activeSection, setActiveSection] = useState('favorites');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-lg mx-auto px-4 py-6"
    >
      <h2 className="text-2xl font-bold text-white mb-2">Sammlung</h2>
      <p className="text-slate-400 mb-6">Eure gemerkten Orte</p>

      {/* Section Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={cn(
              "px-4 py-2 rounded-full whitespace-nowrap transition-colors flex items-center gap-2",
              activeSection === tab.id
                ? "bg-gradient-to-r from-rose-500 to-purple-500 text-white"
                : "bg-slate-800/50 text-slate-400 hover:text-white"
            )}
          >
            <span>{tab.emoji}</span>
            {tab.label}
            {tab.count > 0 && (
              <span className="px-1.5 py-0.5 text-xs bg-white/20 rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Empty State */}
      <div className="text-center py-16 border border-dashed border-slate-700 rounded-xl">
        <Heart size={48} className="mx-auto mb-4 text-slate-600" />
        <p className="text-slate-500">Noch keine Orte gespeichert</p>
        <p className="text-sm text-slate-600 mt-1">
          Markiert Orte mit ❤️ um sie hier zu sehen
        </p>
      </div>
    </motion.div>
  );
}

// =============================================
// CALENDAR TAB
// =============================================

function CalendarTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-lg mx-auto px-4 py-6"
    >
      <h2 className="text-2xl font-bold text-white mb-2">Kalender</h2>
      <p className="text-slate-400 mb-6">Eure geplanten Dates</p>

      {/* Month Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Dezember 2024</h3>
        <div className="flex gap-2">
          <button className="p-2 bg-slate-800/50 rounded-lg text-slate-400 hover:text-white">
            ←
          </button>
          <button className="p-2 bg-slate-800/50 rounded-lg text-slate-400 hover:text-white">
            →
          </button>
        </div>
      </div>

      {/* Empty State */}
      <div className="text-center py-16 border border-dashed border-slate-700 rounded-xl">
        <Calendar size={48} className="mx-auto mb-4 text-slate-600" />
        <p className="text-slate-500">Noch keine Dates geplant</p>
        <p className="text-sm text-slate-600 mt-1">
          Plant euer erstes Date!
        </p>
        <button className="mt-4 px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-500 rounded-lg text-white flex items-center gap-2 mx-auto">
          <Plus size={18} />
          Date planen
        </button>
      </div>
    </motion.div>
  );
}

// =============================================
// BOTTOM NAVIGATION
// =============================================

function BottomNav({
  activeTab,
  onTabChange
}: {
  activeTab: string;
  onTabChange: (tab: 'home' | 'plan' | 'discover' | 'collection' | 'calendar') => void;
}) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'plan', icon: Sparkles, label: 'Planen' },
    { id: 'discover', icon: Search, label: 'Entdecken' },
    { id: 'collection', icon: Heart, label: 'Sammlung' },
    { id: 'calendar', icon: Calendar, label: 'Kalender' },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/50 pb-safe">
      <div className="max-w-lg mx-auto flex justify-around py-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all",
                isActive ? "text-rose-400" : "text-slate-500 hover:text-slate-300"
              )}
            >
              <Icon size={22} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// =============================================
// HELPERS
// =============================================

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Guten Morgen! ☀️';
  if (hour < 17) return 'Guten Tag! 👋';
  if (hour < 21) return 'Guten Abend! 🌙';
  return 'Gute Nacht! 🌟';
}

function getDayInfo(): string {
  const now = new Date();
  const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  const day = days[now.getDay()];
  const date = now.toLocaleDateString('de-DE', { day: 'numeric', month: 'long' });
  return `${day}, ${date}`;
}

function getWeatherEmoji(icon: string): string {
  const iconMap: Record<string, string> = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️',
  };
  return iconMap[icon] || '🌤️';
}
