// API Service with Smart Rate Limiting & Caching
import { createClient } from './supabase';

const supabase = createClient();

// =============================================
// RATE LIMITING
// =============================================

interface ApiUsage {
  api_name: string;
  date: string;
  call_count: number;
  daily_limit: number;
  monthly_count: number;
  monthly_limit: number;
}

async function checkRateLimit(apiName: string): Promise<boolean> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('api_usage')
    .select('*')
    .eq('api_name', apiName)
    .eq('date', today)
    .single();

  if (error || !data) {
    // Create new entry for today
    await supabase.from('api_usage').upsert({
      api_name: apiName,
      date: today,
      call_count: 0,
      daily_limit: 100,
      monthly_count: 0,
      monthly_limit: 3000
    });
    return true;
  }

  const usage = data as ApiUsage;

  // Check limits
  if (usage.call_count >= usage.daily_limit) {
    console.warn(`${apiName}: Daily limit reached (${usage.call_count}/${usage.daily_limit})`);
    return false;
  }

  if (usage.monthly_count >= usage.monthly_limit) {
    console.warn(`${apiName}: Monthly limit reached (${usage.monthly_count}/${usage.monthly_limit})`);
    return false;
  }

  return true;
}

async function incrementApiUsage(apiName: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0];

  try {
    await supabase.rpc('increment_api_usage', {
      p_api_name: apiName,
      p_date: today
    });
  } catch {
    // Fallback: manual increment if RPC doesn't exist
    const { data } = await supabase
      .from('api_usage')
      .select('call_count, monthly_count')
      .eq('api_name', apiName)
      .eq('date', today)
      .single();

    if (data) {
      await supabase
        .from('api_usage')
        .update({
          call_count: (data.call_count || 0) + 1,
          monthly_count: (data.monthly_count || 0) + 1,
          last_call_at: new Date().toISOString()
        })
        .eq('api_name', apiName)
        .eq('date', today);
    }
  }
}

// =============================================
// CACHING
// =============================================

interface CacheEntry {
  response: unknown;
  expires_at: string;
}

async function getFromCache(apiName: string, cacheKey: string): Promise<unknown | null> {
  const { data, error } = await supabase
    .from('api_cache')
    .select('response, expires_at')
    .eq('api_name', apiName)
    .eq('cache_key', cacheKey)
    .single();

  if (error || !data) return null;

  const cache = data as CacheEntry;

  // Check if expired
  if (new Date(cache.expires_at) < new Date()) {
    // Delete expired cache
    await supabase
      .from('api_cache')
      .delete()
      .eq('api_name', apiName)
      .eq('cache_key', cacheKey);
    return null;
  }

  return cache.response;
}

async function saveToCache(
  apiName: string,
  cacheKey: string,
  response: unknown,
  ttlMinutes: number
): Promise<void> {
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString();

  await supabase
    .from('api_cache')
    .upsert({
      api_name: apiName,
      cache_key: cacheKey,
      response,
      created_at: new Date().toISOString(),
      expires_at: expiresAt
    }, {
      onConflict: 'api_name,cache_key'
    });
}

// =============================================
// OPENWEATHERMAP API
// =============================================

export interface WeatherData {
  temp: number;
  feels_like: number;
  description: string;
  icon: string;
  humidity: number;
  wind_speed: number;
  city: string;
}

export interface ForecastDay {
  date: string;
  temp_min: number;
  temp_max: number;
  description: string;
  icon: string;
}

const HAMBURG_LAT = 53.5511;
const HAMBURG_LON = 9.9937;

export async function getCurrentWeather(): Promise<WeatherData | null> {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  if (!apiKey) {
    console.error('OpenWeatherMap API key not configured');
    return null;
  }

  const cacheKey = `weather_current_hamburg`;

  // Check cache first (1 hour TTL)
  const cached = await getFromCache('openweathermap', cacheKey);
  if (cached) {
    console.log('Weather: Using cached data');
    return cached as WeatherData;
  }

  // Check rate limit
  if (!await checkRateLimit('openweathermap')) {
    console.warn('Weather: Rate limit exceeded');
    return null;
  }

  try {
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${HAMBURG_LAT}&lon=${HAMBURG_LON}&exclude=minutely,hourly,alerts&units=metric&lang=de&appid=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    // Increment usage counter
    await incrementApiUsage('openweathermap');

    const weather: WeatherData = {
      temp: Math.round(data.current.temp),
      feels_like: Math.round(data.current.feels_like),
      description: data.current.weather[0].description,
      icon: data.current.weather[0].icon,
      humidity: data.current.humidity,
      wind_speed: Math.round(data.current.wind_speed * 3.6), // m/s to km/h
      city: 'Hamburg'
    };

    // Cache for 1 hour
    await saveToCache('openweathermap', cacheKey, weather, 60);

    return weather;
  } catch (error) {
    console.error('Weather API error:', error);
    return null;
  }
}

export async function getWeatherForecast(): Promise<ForecastDay[] | null> {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  if (!apiKey) return null;

  const cacheKey = `weather_forecast_hamburg`;

  // Check cache first (6 hours TTL)
  const cached = await getFromCache('openweathermap', cacheKey);
  if (cached) {
    console.log('Forecast: Using cached data');
    return cached as ForecastDay[];
  }

  // Check rate limit
  if (!await checkRateLimit('openweathermap')) {
    return null;
  }

  try {
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${HAMBURG_LAT}&lon=${HAMBURG_LON}&exclude=minutely,hourly,current,alerts&units=metric&lang=de&appid=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Forecast API error: ${response.status}`);
    }

    const data = await response.json();

    await incrementApiUsage('openweathermap');

    const forecast: ForecastDay[] = data.daily.slice(0, 7).map((day: {
      dt: number;
      temp: { min: number; max: number };
      weather: Array<{ description: string; icon: string }>;
    }) => ({
      date: new Date(day.dt * 1000).toISOString().split('T')[0],
      temp_min: Math.round(day.temp.min),
      temp_max: Math.round(day.temp.max),
      description: day.weather[0].description,
      icon: day.weather[0].icon
    }));

    // Cache for 6 hours
    await saveToCache('openweathermap', cacheKey, forecast, 360);

    return forecast;
  } catch (error) {
    console.error('Forecast API error:', error);
    return null;
  }
}

// =============================================
// TICKETMASTER API
// =============================================

export interface TicketmasterEvent {
  id: string;
  name: string;
  date: string;
  time?: string;
  venue: string;
  address?: string;
  image?: string;
  url: string;
  priceRange?: string;
  category: string;
}

export async function searchEvents(options?: {
  keyword?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
  size?: number;
}): Promise<TicketmasterEvent[]> {
  const apiKey = process.env.NEXT_PUBLIC_TICKETMASTER_API_KEY;
  if (!apiKey) {
    console.error('Ticketmaster API key not configured');
    return [];
  }

  const {
    keyword = '',
    startDate,
    endDate,
    category,
    size = 20
  } = options || {};

  // Build cache key
  const cacheKey = `events_${keyword}_${startDate}_${endDate}_${category}_${size}`;

  // Check cache first (24 hours TTL)
  const cached = await getFromCache('ticketmaster', cacheKey);
  if (cached) {
    console.log('Ticketmaster: Using cached data');
    return cached as TicketmasterEvent[];
  }

  // Check rate limit
  if (!await checkRateLimit('ticketmaster')) {
    console.warn('Ticketmaster: Rate limit exceeded');
    return [];
  }

  try {
    const params = new URLSearchParams({
      apikey: apiKey,
      city: 'Hamburg',
      countryCode: 'DE',
      size: size.toString(),
      sort: 'date,asc'
    });

    if (keyword) params.append('keyword', keyword);
    if (startDate) params.append('startDateTime', `${startDate}T00:00:00Z`);
    if (endDate) params.append('endDateTime', `${endDate}T23:59:59Z`);
    if (category) params.append('classificationName', category);

    const url = `https://app.ticketmaster.com/discovery/v2/events.json?${params}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Ticketmaster API error: ${response.status}`);
    }

    const data = await response.json();

    await incrementApiUsage('ticketmaster');

    if (!data._embedded?.events) {
      return [];
    }

    const events: TicketmasterEvent[] = data._embedded.events.map((event: {
      id: string;
      name: string;
      dates: { start: { localDate: string; localTime?: string } };
      _embedded?: { venues?: Array<{ name: string; address?: { line1: string } }> };
      images?: Array<{ url: string; ratio?: string }>;
      url: string;
      priceRanges?: Array<{ min: number; max: number; currency: string }>;
      classifications?: Array<{ segment?: { name: string } }>;
    }) => {
      const venue = event._embedded?.venues?.[0];
      const image = event.images?.find(img => img.ratio === '16_9') || event.images?.[0];
      const price = event.priceRanges?.[0];

      return {
        id: event.id,
        name: event.name,
        date: event.dates.start.localDate,
        time: event.dates.start.localTime,
        venue: venue?.name || 'TBA',
        address: venue?.address?.line1,
        image: image?.url,
        url: event.url,
        priceRange: price ? `${price.min}-${price.max} ${price.currency}` : undefined,
        category: event.classifications?.[0]?.segment?.name || 'Event'
      };
    });

    // Cache for 24 hours
    await saveToCache('ticketmaster', cacheKey, events, 1440);

    return events;
  } catch (error) {
    console.error('Ticketmaster API error:', error);
    return [];
  }
}

// Get upcoming concerts in Hamburg
export async function getUpcomingConcerts(): Promise<TicketmasterEvent[]> {
  const today = new Date().toISOString().split('T')[0];
  const threeMonthsLater = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    .toISOString().split('T')[0];

  return searchEvents({
    startDate: today,
    endDate: threeMonthsLater,
    category: 'Music',
    size: 50
  });
}

// Get upcoming shows (theater, comedy, etc.)
export async function getUpcomingShows(): Promise<TicketmasterEvent[]> {
  const today = new Date().toISOString().split('T')[0];
  const threeMonthsLater = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    .toISOString().split('T')[0];

  return searchEvents({
    startDate: today,
    endDate: threeMonthsLater,
    category: 'Arts & Theatre',
    size: 50
  });
}

// =============================================
// API STATUS CHECK
// =============================================

export async function getApiStatus(): Promise<{
  ticketmaster: { calls: number; limit: number; percentage: number };
  openweathermap: { calls: number; limit: number; percentage: number };
}> {
  const today = new Date().toISOString().split('T')[0];

  const { data } = await supabase
    .from('api_usage')
    .select('api_name, call_count, daily_limit')
    .eq('date', today);

  const status = {
    ticketmaster: { calls: 0, limit: 100, percentage: 0 },
    openweathermap: { calls: 0, limit: 100, percentage: 0 }
  };

  data?.forEach((row: { api_name: string; call_count: number; daily_limit: number }) => {
    if (row.api_name === 'ticketmaster') {
      status.ticketmaster = {
        calls: row.call_count,
        limit: row.daily_limit,
        percentage: Math.round((row.call_count / row.daily_limit) * 100)
      };
    } else if (row.api_name === 'openweathermap') {
      status.openweathermap = {
        calls: row.call_count,
        limit: row.daily_limit,
        percentage: Math.round((row.call_count / row.daily_limit) * 100)
      };
    }
  });

  return status;
}
