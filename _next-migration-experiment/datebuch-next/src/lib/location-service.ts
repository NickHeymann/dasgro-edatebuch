// Location Service - Date Concierge Database Queries
import { createClient } from './supabase';
import type {
  Location,
  LocationTag,
  LocationType,
  TagCategory,
  SearchFilters,
  DatePlan,
  DatePlanItem,
  UserPreference,
} from '@/types';

const supabase = createClient();

// =============================================
// LOCATION QUERIES
// =============================================

export async function getLocations(filters?: SearchFilters): Promise<Location[]> {
  let query = supabase
    .from('locations')
    .select(`
      *,
      location_tags (*),
      location_photos (*)
    `)
    .eq('status', 'active')
    .order('name');

  // Apply filters
  if (filters?.type?.length) {
    query = query.in('type', filters.type);
  }

  if (filters?.district?.length) {
    query = query.in('district', filters.district);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching locations:', error);
    return [];
  }

  let locations = data as Location[];

  // Filter by tags (post-query since it requires joining)
  if (filters?.tags?.length) {
    locations = locations.filter(loc =>
      loc.tags?.some(tag =>
        filters.tags!.some(f => tag.tag.toLowerCase().includes(f.toLowerCase()))
      )
    );
  }

  // Filter by dietary
  if (filters?.dietary?.length) {
    locations = locations.filter(loc =>
      loc.tags?.some(tag =>
        tag.category === 'dietary' &&
        filters.dietary!.some(d => tag.tag.toLowerCase().includes(d.toLowerCase()))
      )
    );
  }

  // Filter by vibe
  if (filters?.vibe?.length) {
    locations = locations.filter(loc =>
      loc.tags?.some(tag =>
        tag.category === 'vibe' &&
        filters.vibe!.some(v => tag.tag.toLowerCase().includes(v.toLowerCase()))
      )
    );
  }

  // Filter by text query
  if (filters?.query) {
    const q = filters.query.toLowerCase();
    locations = locations.filter(loc =>
      loc.name.toLowerCase().includes(q) ||
      loc.district?.toLowerCase().includes(q) ||
      loc.tags?.some(tag => tag.tag.toLowerCase().includes(q))
    );
  }

  return locations;
}

export async function getLocationById(id: string): Promise<Location | null> {
  const { data, error } = await supabase
    .from('locations')
    .select(`
      *,
      location_tags (*),
      location_photos (*),
      location_reviews (*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching location:', error);
    return null;
  }

  return data as Location;
}

export async function getLocationBySlug(slug: string): Promise<Location | null> {
  const { data, error } = await supabase
    .from('locations')
    .select(`
      *,
      location_tags (*),
      location_photos (*),
      location_reviews (*)
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching location by slug:', error);
    return null;
  }

  return data as Location;
}

// =============================================
// SMART SEARCH - "Beste Carbonara", "Bar mit Flipper"
// =============================================

export async function smartSearch(query: string): Promise<Location[]> {
  const q = query.toLowerCase();

  // Check for special patterns
  const patterns = {
    beste: /beste[rn]?\s+(.+)/i,
    mitActivity: /(?:bar|restaurant|cafe|ort)\s+mit\s+(.+)/i,
    woGibt: /wo\s+(?:gibt\s+es|bekomme?\s+ich)\s+(.+)/i,
    hatIngredient: /(?:wer\s+)?hat\s+(.+)/i,
  };

  let searchTags: string[] = [];
  let searchTypes: LocationType[] = [];

  // Parse query for patterns
  for (const [, regex] of Object.entries(patterns)) {
    const match = q.match(regex);
    if (match) {
      searchTags.push(match[1].trim());
    }
  }

  // Check for type hints
  if (q.includes('bar')) searchTypes.push('bar');
  if (q.includes('restaurant') || q.includes('essen')) searchTypes.push('restaurant');
  if (q.includes('café') || q.includes('cafe')) searchTypes.push('cafe');
  if (q.includes('club')) searchTypes.push('club');

  // If no patterns matched, search all fields
  if (searchTags.length === 0) {
    searchTags = [q];
  }

  // Search in tags with quality score ordering
  const { data: tagResults } = await supabase
    .from('location_tags')
    .select(`
      location_id,
      tag,
      category,
      quality_score,
      is_specialty,
      locations!inner (*)
    `)
    .or(searchTags.map(t => `tag.ilike.%${t}%`).join(','))
    .eq('locations.status', 'active')
    .order('quality_score', { ascending: false })
    .order('is_specialty', { ascending: false });

  if (!tagResults?.length) {
    // Fallback to name search
    return getLocations({ query: q });
  }

  // Deduplicate and rank
  const locationMap = new Map<string, { location: Location; score: number }>();

  for (const result of tagResults) {
    const loc = result.locations as unknown as Location;
    const existing = locationMap.get(loc.id);
    const score = (result.quality_score || 0) + (result.is_specialty ? 10 : 0);

    if (!existing || existing.score < score) {
      locationMap.set(loc.id, { location: loc, score });
    }
  }

  // Filter by type if specified
  let results = Array.from(locationMap.values())
    .sort((a, b) => b.score - a.score)
    .map(r => r.location);

  if (searchTypes.length > 0) {
    results = results.filter(loc => searchTypes.includes(loc.type));
  }

  return results;
}

// =============================================
// DISTRICT & TAG LISTINGS
// =============================================

export async function getDistricts(): Promise<string[]> {
  const { data } = await supabase
    .from('locations')
    .select('district')
    .eq('status', 'active')
    .not('district', 'is', null);

  if (!data) return [];

  const districts = [...new Set(data.map(d => d.district).filter(Boolean))];
  return districts.sort() as string[];
}

export async function getPopularTags(category?: TagCategory, limit = 20): Promise<LocationTag[]> {
  let query = supabase
    .from('location_tags')
    .select('*')
    .order('upvotes', { ascending: false })
    .limit(limit);

  if (category) {
    query = query.eq('category', category);
  }

  const { data } = await query;
  return (data as LocationTag[]) || [];
}

// =============================================
// DATE SUGGESTIONS - Kontext-basiert
// =============================================

export interface DateContext {
  dayOfWeek: number; // 0 = Sunday
  hour: number;
  weather?: { temp: number; isRainy: boolean };
  occasion?: string;
  mood?: string;
}

export async function getSuggestedDate(context: DateContext): Promise<{
  restaurant?: Location;
  activity?: Location;
  bar?: Location;
  reason: string;
}> {
  const isEvening = context.hour >= 17;
  const isWeekend = context.dayOfWeek === 0 || context.dayOfWeek === 6;
  const isCold = (context.weather?.temp ?? 10) < 10;

  // Build filter based on context
  const vibeFilters: string[] = [];
  const typeFilters: LocationType[] = [];

  if (isEvening) {
    vibeFilters.push('Romantisch', 'Gemütlich');
  } else {
    vibeFilters.push('Entspannt', 'Casual');
  }

  if (isCold || context.weather?.isRainy) {
    vibeFilters.push('Gemütlich');
  }

  // Get matching locations
  const allLocations = await getLocations({
    vibe: vibeFilters,
  });

  const restaurants = allLocations.filter(l => l.type === 'restaurant');
  const bars = allLocations.filter(l => l.type === 'bar');
  const activities = allLocations.filter(l => l.type === 'activity' || l.type === 'venue');

  // Simple random selection for now (will be enhanced with learning algorithm)
  const restaurant = restaurants[Math.floor(Math.random() * restaurants.length)];
  const bar = bars[Math.floor(Math.random() * bars.length)];
  const activity = activities[Math.floor(Math.random() * activities.length)];

  // Generate reason
  let reason = '';
  if (isWeekend && isEvening) {
    reason = 'Perfekt für einen entspannten Samstagabend';
  } else if (isEvening) {
    reason = 'Gemütlicher Feierabend-Plan';
  } else if (isWeekend) {
    reason = 'Schöner Weekend-Tipp';
  } else {
    reason = 'Für euch ausgewählt';
  }

  if (isCold) {
    reason += ' - Schön warm drinnen!';
  }

  return { restaurant, activity, bar, reason };
}

// =============================================
// LOCATION COMBINATIONS - "Theater + Essen vorher"
// =============================================

export async function getNearbyLocations(
  locationId: string,
  type?: LocationType,
  radiusKm = 1
): Promise<Location[]> {
  const base = await getLocationById(locationId);
  if (!base || !base.lat || !base.lon) return [];

  // Get all locations of type
  const { data } = await supabase
    .from('locations')
    .select('*')
    .eq('status', 'active')
    .not('id', 'eq', locationId);

  if (!data) return [];

  let locations = data as Location[];

  // Filter by type
  if (type) {
    locations = locations.filter(l => l.type === type);
  }

  // Calculate distance and filter
  locations = locations.filter(l => {
    if (!l.lat || !l.lon) return false;
    const distance = calculateDistance(base.lat!, base.lon!, l.lat, l.lon);
    return distance <= radiusKm;
  });

  // Sort by distance
  locations.sort((a, b) => {
    const distA = calculateDistance(base.lat!, base.lon!, a.lat!, a.lon!);
    const distB = calculateDistance(base.lat!, base.lon!, b.lat!, b.lon!);
    return distA - distB;
  });

  return locations;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// =============================================
// DATE PLANS - Create & Manage
// =============================================

export async function createDatePlan(
  userId: string,
  coupleId: string | null,
  title: string,
  locationIds: string[],
  plannedDate?: string,
  occasion?: string
): Promise<DatePlan | null> {
  const { data: plan, error: planError } = await supabase
    .from('date_plans')
    .insert({
      user_id: userId,
      couple_id: coupleId,
      title,
      planned_date: plannedDate,
      occasion,
      status: 'draft',
    })
    .select()
    .single();

  if (planError || !plan) {
    console.error('Error creating date plan:', planError);
    return null;
  }

  // Add items
  const items = locationIds.map((locId, index) => ({
    date_plan_id: plan.id,
    location_id: locId,
    order_index: index,
  }));

  const { error: itemsError } = await supabase
    .from('date_plan_items')
    .insert(items);

  if (itemsError) {
    console.error('Error adding plan items:', itemsError);
  }

  return plan as DatePlan;
}

export async function getDatePlans(userId: string, coupleId?: string): Promise<DatePlan[]> {
  let query = supabase
    .from('date_plans')
    .select(`
      *,
      date_plan_items (
        *,
        locations (*)
      )
    `)
    .order('created_at', { ascending: false });

  if (coupleId) {
    query = query.eq('couple_id', coupleId);
  } else {
    query = query.eq('user_id', userId);
  }

  const { data } = await query;
  return (data as DatePlan[]) || [];
}

export async function updateDatePlanStatus(
  planId: string,
  status: 'draft' | 'planned' | 'completed' | 'cancelled',
  rating?: number
): Promise<boolean> {
  const { error } = await supabase
    .from('date_plans')
    .update({ status, rating, updated_at: new Date().toISOString() })
    .eq('id', planId);

  return !error;
}

// =============================================
// USER PREFERENCES - Learning Algorithm
// =============================================

export async function recordPreference(
  userId: string,
  coupleId: string | null,
  type: UserPreference['preference_type'],
  value: string,
  weight = 1
): Promise<void> {
  await supabase.from('user_preferences').upsert({
    user_id: userId,
    couple_id: coupleId,
    preference_type: type,
    preference_value: value,
    weight,
  }, {
    onConflict: 'user_id,preference_type,preference_value',
  });
}

export async function getUserPreferences(
  userId: string,
  coupleId?: string
): Promise<UserPreference[]> {
  let query = supabase
    .from('user_preferences')
    .select('*')
    .order('weight', { ascending: false });

  if (coupleId) {
    query = query.eq('couple_id', coupleId);
  } else {
    query = query.eq('user_id', userId);
  }

  const { data } = await query;
  return (data as UserPreference[]) || [];
}

export async function resetAlgorithm(
  userId: string,
  coupleId: string | null,
  resetType: 'full' | 'partial' | 'category',
  scope?: string
): Promise<boolean> {
  // Log the reset
  await supabase.from('algorithm_resets').insert({
    user_id: userId,
    couple_id: coupleId,
    reset_type: resetType,
    reset_scope: scope,
  });

  // Delete preferences based on reset type
  let query = supabase.from('user_preferences').delete();

  if (coupleId) {
    query = query.eq('couple_id', coupleId);
  } else {
    query = query.eq('user_id', userId);
  }

  if (resetType === 'category' && scope) {
    query = query.eq('preference_type', scope);
  }

  const { error } = await query;
  return !error;
}

// =============================================
// FAVORITES & HISTORY
// =============================================

export async function getFavoriteLocations(userId: string, coupleId?: string): Promise<Location[]> {
  const prefs = await getUserPreferences(userId, coupleId);
  const likedTags = prefs
    .filter(p => p.preference_type === 'liked_tag')
    .map(p => p.preference_value);

  if (likedTags.length === 0) return [];

  return getLocations({ tags: likedTags });
}

export async function getVisitedLocations(userId: string, coupleId?: string): Promise<Location[]> {
  let query = supabase
    .from('date_plans')
    .select(`
      date_plan_items (
        locations (*)
      )
    `)
    .eq('status', 'completed');

  if (coupleId) {
    query = query.eq('couple_id', coupleId);
  } else {
    query = query.eq('user_id', userId);
  }

  const { data } = await query;

  if (!data) return [];

  // Flatten and dedupe locations
  const locationMap = new Map<string, Location>();
  for (const plan of data) {
    const planItems = (plan as unknown as { date_plan_items: { locations: Location }[] }).date_plan_items;
    for (const item of planItems || []) {
      if (item.locations) {
        locationMap.set(item.locations.id, item.locations);
      }
    }
  }

  return Array.from(locationMap.values());
}
