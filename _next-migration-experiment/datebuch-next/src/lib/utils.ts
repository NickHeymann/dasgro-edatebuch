import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Event, EventCategory, Countdown } from '@/types';

// Tailwind Class Merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Event Helpers
export function isPastEvent(event: Event): boolean {
  if (!event.date || event.date === 'dauerhaft') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (event.endDate) {
    const endDate = new Date(event.endDate);
    endDate.setHours(0, 0, 0, 0);
    return endDate < today;
  }

  const eventDate = new Date(event.date);
  eventDate.setHours(0, 0, 0, 0);
  return eventDate < today;
}

export function getCountdown(dateStr: string): Countdown | null {
  if (!dateStr || dateStr === 'dauerhaft') return null;
  const eventDate = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);

  const diffTime = eventDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { text: 'Vorbei', class: 'past', days: diffDays };
  if (diffDays === 0) return { text: 'Heute!', class: 'today', days: 0 };
  if (diffDays === 1) return { text: 'Morgen!', class: 'soon', days: 1 };
  if (diffDays <= 7) return { text: `In ${diffDays} Tagen`, class: 'soon', days: diffDays };
  if (diffDays <= 30) return { text: `In ${diffDays} Tagen`, class: 'upcoming', days: diffDays };
  return { text: `${diffDays} Tage`, class: 'future', days: diffDays };
}

export function getCategoryName(category: EventCategory): string {
  const names: Record<EventCategory, string> = {
    shows: 'Shows & Konzerte',
    musical: 'Musical',
    variete: 'Varieté',
    theater: 'Theater',
    musik: 'Musik',
    comedy: 'Comedy',
    wellness: 'Wellness',
    aktiv: 'Aktiv',
    handwerk: 'Handwerk',
    essen: 'Essen',
  };
  return names[category] || category;
}

export function getCategoryEmoji(category: EventCategory): string {
  const emojis: Record<EventCategory, string> = {
    shows: '🎭',
    musical: '🎭',
    variete: '🎪',
    theater: '🎬',
    musik: '🎵',
    comedy: '😂',
    wellness: '💆',
    aktiv: '🏃',
    handwerk: '🔨',
    essen: '🍽️',
  };
  return emojis[category] || '📅';
}

export function getCategoryColor(category: EventCategory): string {
  const colors: Record<EventCategory, string> = {
    shows: 'bg-purple-500',
    musical: 'bg-purple-500',
    variete: 'bg-pink-500',
    theater: 'bg-indigo-500',
    musik: 'bg-blue-500',
    comedy: 'bg-yellow-500',
    wellness: 'bg-teal-500',
    aktiv: 'bg-green-500',
    handwerk: 'bg-orange-500',
    essen: 'bg-red-500',
  };
  return colors[category] || 'bg-gray-500';
}

// Date Formatting
export function formatDate(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
  if (!dateStr || dateStr === 'dauerhaft') return 'Dauerhaft';
  const date = new Date(dateStr);
  return date.toLocaleDateString('de-DE', options || {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function formatDateTime(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Price Parsing
export function parsePrice(priceStr: string): { min: number; max: number } {
  if (!priceStr) return { min: 0, max: 0 };
  const cleaned = priceStr.replace(/[^0-9-]/g, '');
  const parts = cleaned.split('-').map(p => parseInt(p) || 0);
  return {
    min: parts[0] || 0,
    max: parts[1] || parts[0] || 0,
  };
}

// Budget Calculation
export function calculateBudget(
  event: Event | null,
  hasRestaurant: boolean,
  barCount: number
): { activity: number; food: number; drinks: number; min: number; max: number } {
  let activityMin = 0, activityMax = 0;
  let foodMin = 0, foodMax = 0;
  let drinksMin = 0, drinksMax = 0;

  if (event?.price) {
    const { min, max } = parsePrice(event.price);
    activityMin = min * 2;
    activityMax = max * 2;
  }

  if (hasRestaurant) {
    foodMin = 40;
    foodMax = 80;
  }

  if (barCount > 0) {
    drinksMin = barCount * 20;
    drinksMax = barCount * 40;
  }

  return {
    activity: Math.round((activityMin + activityMax) / 2),
    food: Math.round((foodMin + foodMax) / 2),
    drinks: Math.round((drinksMin + drinksMax) / 2),
    min: activityMin + foodMin + drinksMin,
    max: activityMax + foodMax + drinksMax,
  };
}

// Random Selection
export function getRandomItem<T>(items: T[]): T | null {
  if (items.length === 0) return null;
  return items[Math.floor(Math.random() * items.length)];
}

// ÖPNV Route
export function openTransitRoute(destination: string): void {
  const start = encodeURIComponent('Stadtdeich 5, 20097 Hamburg');
  const dest = encodeURIComponent(destination);
  const url = `https://www.google.com/maps/dir/${start}/${dest}/?travelmode=transit`;
  window.open(url, '_blank');
}

// WhatsApp Share
export function shareViaWhatsApp(text: string): void {
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

// Calendar Export (ICS)
export function generateICS(event: Event): string {
  const startDate = new Date(event.date);
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 3);

  const formatICSDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Datebuch//DE
BEGIN:VEVENT
UID:${event.id}@datebuch
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:${event.emoji} ${event.title}
DESCRIPTION:${event.description || ''}
LOCATION:${event.address || event.location || ''}
URL:${event.link || ''}
END:VEVENT
END:VCALENDAR`;
}

export function downloadICS(event: Event): void {
  const ics = generateICS(event);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}
