// Event Types
export interface Event {
  id: string;
  emoji: string;
  title: string;
  date: string;
  endDate?: string;
  category: EventCategory;
  description?: string;
  location?: string;
  address?: string;
  coords?: [number, number];
  link?: string;
  time?: string;
  price?: string;
  vorher_nachher?: 'Vorher' | 'Nachher' | 'Komplett';
  restaurant?: Restaurant;
  bar?: Bar | Bar[];
  treatment?: string;
}

export type EventCategory =
  | 'musical'
  | 'variete'
  | 'theater'
  | 'comedy'
  | 'musik'
  | 'wellness'
  | 'aktiv'
  | 'handwerk'
  | 'essen'
  | 'shows';

export interface Restaurant {
  name: string;
  type: string;
  address?: string;
  link?: string;
  empfehlung?: string;
}

export interface Bar {
  name: string;
  type: string;
  address?: string;
  link?: string;
}

// Rating Types
export interface EventRating {
  liked: boolean;
  disliked: boolean;
  rating?: number;
  notes?: string;
  ratedAt?: string;
}

// Date History
export interface DateEntry {
  id: string;
  eventId: string;
  title: string;
  emoji: string;
  category: EventCategory;
  date: string;
  rating: number;
  notes?: string;
  photos?: string[];
}

// Love Letter
export interface LoveLetter {
  id: string;
  text: string;
  from: string;
  createdAt: string;
  read: boolean;
}

// Bucket List
export interface BucketItem {
  id: string;
  emoji: string;
  text: string;
  completed: boolean;
  completedAt?: string;
}

// Budget
export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface Budget {
  monthlyBudget: number;
  expenses: Expense[];
}

// Travel Destination
export interface Destination {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  status: 'visited' | 'wishlist';
  visitDate?: string;
  diary?: string;
  photos?: string[];
}

// User Profile (Supabase)
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  partnerEmail?: string;
  partnerId?: string;
  createdAt: string;
}

// Countdown
export interface Countdown {
  text: string;
  class: 'past' | 'today' | 'soon' | 'upcoming' | 'future';
  days: number;
}

// Date Builder State
export interface DateBuilderState {
  event: Event | null;
  restaurant: Restaurant | null;
  bars: Bar[];
  wantFood: boolean | null;
  foodTiming: 'vorher' | 'nachher' | null;
}

// Budget Calculation
export interface BudgetCalculation {
  activity: number;
  food: number;
  drinks: number;
  min: number;
  max: number;
}

// Achievement
export interface Achievement {
  id: string;
  emoji: string;
  title: string;
  description: string;
  unlockedAt?: string;
}
