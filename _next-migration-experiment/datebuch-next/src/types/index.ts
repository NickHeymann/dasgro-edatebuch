// =============================================
// LOCATION TYPES (Date Concierge System)
// =============================================

export type LocationType = 'restaurant' | 'bar' | 'cafe' | 'club' | 'venue' | 'activity';

export type TagCategory =
  | 'food'       // Carbonara, Pizza, Burger
  | 'drink'      // Moscow Mule, Aperol Spritz
  | 'ingredient' // Frangelico, Mezcal
  | 'activity'   // Flipper, Dart, Kicker
  | 'vibe'       // Romantisch, Gemütlich, Hip
  | 'feature'    // Terrasse, Kamin, Live Musik
  | 'price'      // €, €€, €€€, €€€€
  | 'dietary'    // Vegan, Vegetarisch, Glutenfrei
  | 'best_for';  // Date Night, Feierabend

export interface Location {
  id: string;
  name: string;
  slug: string;
  type: LocationType;
  address?: string;
  district?: string;
  city: string;
  postal_code?: string;
  lat?: number;
  lon?: number;
  phone?: string;
  website?: string;
  instagram?: string;
  opening_hours?: Record<string, string>;
  status: 'active' | 'closed' | 'temporarily_closed' | 'unverified';
  verified_at?: string;
  created_at: string;
  updated_at: string;
  foursquare_id?: string;
  google_place_id?: string;
  // Joined data
  tags?: LocationTag[];
  photos?: LocationPhoto[];
  avg_rating?: number;
  review_count?: number;
}

export interface LocationTag {
  id: string;
  location_id: string;
  category: TagCategory;
  tag: string;
  is_specialty: boolean;
  quality_score: number;
  upvotes: number;
  downvotes: number;
  created_at: string;
}

export interface LocationPhoto {
  id: string;
  location_id: string;
  url: string;
  caption?: string;
  photo_type: 'interior' | 'exterior' | 'food' | 'drink' | 'menu' | 'vibe';
  uploaded_by?: string;
  created_at: string;
}

export interface LocationReview {
  id: string;
  location_id: string;
  user_id: string;
  overall_rating: number;
  date_rating: number;
  review_text?: string;
  items_tried?: string[];
  visit_date?: string;
  created_at: string;
}

export interface MenuItem {
  id: string;
  location_id: string;
  name: string;
  category?: string;
  description?: string;
  price?: number;
  price_range?: '€' | '€€' | '€€€' | '€€€€';
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_signature: boolean;
  avg_rating?: number;
  rating_count: number;
  last_verified?: string;
  created_at: string;
}

// =============================================
// DATE PLAN TYPES
// =============================================

export interface DatePlan {
  id: string;
  couple_id?: string;
  user_id: string;
  title: string;
  planned_date?: string;
  occasion?: string;
  mood?: string;
  status: 'draft' | 'planned' | 'completed' | 'cancelled';
  notes?: string;
  rating?: number;
  created_at: string;
  updated_at: string;
  // Joined data
  items?: DatePlanItem[];
}

export interface DatePlanItem {
  id: string;
  date_plan_id: string;
  location_id: string;
  order_index: number;
  timing?: string;
  notes?: string;
  created_at: string;
  // Joined data
  location?: Location;
}

// =============================================
// USER & COUPLE TYPES
// =============================================

export interface UserProfile {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  couple_id?: string;
  is_solo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Couple {
  id: string;
  name?: string;
  invite_code: string;
  user1_id: string;
  user2_id?: string;
  created_at: string;
  // Joined data
  user1?: UserProfile;
  user2?: UserProfile;
}

export interface UserPreference {
  id: string;
  user_id: string;
  couple_id?: string;
  preference_type: 'liked_tag' | 'disliked_tag' | 'favorite_district' | 'dietary' | 'price_range';
  preference_value: string;
  weight: number;
  created_at: string;
}

export interface AlgorithmReset {
  id: string;
  user_id: string;
  couple_id?: string;
  reset_type: 'full' | 'partial' | 'category';
  reset_scope?: string;
  created_at: string;
}

// =============================================
// LEGACY EVENT TYPES (für Migration)
// =============================================

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
  restaurant?: LegacyRestaurant;
  bar?: LegacyBar | LegacyBar[];
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

export interface LegacyRestaurant {
  name: string;
  type: string;
  address?: string;
  link?: string;
  empfehlung?: string;
}

export interface LegacyBar {
  name: string;
  type: string;
  address?: string;
  link?: string;
}

export interface EventRating {
  liked: boolean;
  disliked: boolean;
  rating?: number;
  notes?: string;
  ratedAt?: string;
}

// =============================================
// UI STATE TYPES
// =============================================

export interface DateSuggestion {
  id: string;
  locations: Location[];
  occasion?: string;
  mood?: string;
  totalDuration?: number;
  estimatedCost?: { min: number; max: number };
  reason: string;
}

export interface WeatherContext {
  temp: number;
  description: string;
  icon: string;
  isGoodForOutdoor: boolean;
  suggestion: string;
}

export interface TimeContext {
  dayOfWeek: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  isWeekend: boolean;
  suggestion: string;
}

export interface SearchFilters {
  query?: string;
  type?: LocationType[];
  district?: string[];
  tags?: string[];
  dietary?: string[];
  priceRange?: string[];
  vibe?: string[];
  openNow?: boolean;
}

export interface Countdown {
  text: string;
  class: 'past' | 'today' | 'soon' | 'upcoming' | 'future';
  days: number;
}
