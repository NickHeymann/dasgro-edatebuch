'use client';

import { useState, useEffect } from 'react';
import { getCurrentWeather, getWeatherForecast, WeatherData, ForecastDay } from '@/lib/api-service';

// Weather icon mapping
const getWeatherEmoji = (icon: string): string => {
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
  return iconMap[icon] || '🌡️';
};

// Format date to German weekday
const formatWeekday = (dateStr: string): string => {
  const date = new Date(dateStr);
  const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  return days[date.getDay()];
};

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadWeather() {
      try {
        const [currentData, forecastData] = await Promise.all([
          getCurrentWeather(),
          getWeatherForecast()
        ]);

        setWeather(currentData);
        setForecast(forecastData);
      } catch (err) {
        setError('Wetter konnte nicht geladen werden');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadWeather();
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-800/50 rounded-2xl p-4 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-24 mb-2"></div>
        <div className="h-10 bg-slate-700 rounded w-16"></div>
      </div>
    );
  }

  if (error || !weather) {
    return null; // Silently fail - weather is not critical
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-4 backdrop-blur-sm border border-slate-700/50">
      {/* Current Weather */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-slate-400 text-sm">{weather.city}</p>
          <div className="flex items-center gap-2">
            <span className="text-4xl">{getWeatherEmoji(weather.icon)}</span>
            <span className="text-3xl font-bold">{weather.temp}°</span>
          </div>
          <p className="text-slate-300 text-sm capitalize">{weather.description}</p>
        </div>
        <div className="text-right text-sm text-slate-400">
          <p>Gefühlt: {weather.feels_like}°</p>
          <p>Wind: {weather.wind_speed} km/h</p>
          <p>Feuchte: {weather.humidity}%</p>
        </div>
      </div>

      {/* Forecast */}
      {forecast && forecast.length > 0 && (
        <div className="border-t border-slate-700/50 pt-3 mt-3">
          <div className="flex justify-between gap-1">
            {forecast.slice(1, 6).map((day) => (
              <div key={day.date} className="text-center flex-1">
                <p className="text-xs text-slate-400">{formatWeekday(day.date)}</p>
                <p className="text-lg">{getWeatherEmoji(day.icon)}</p>
                <p className="text-xs">
                  <span className="text-slate-300">{day.temp_max}°</span>
                  <span className="text-slate-500"> {day.temp_min}°</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Compact version for event cards
export function WeatherBadge({ date }: { date: string }) {
  const [forecast, setForecast] = useState<ForecastDay | null>(null);

  useEffect(() => {
    async function loadForecast() {
      const data = await getWeatherForecast();
      if (data) {
        const dayForecast = data.find(d => d.date === date);
        setForecast(dayForecast || null);
      }
    }
    loadForecast();
  }, [date]);

  if (!forecast) return null;

  return (
    <span className="inline-flex items-center gap-1 text-sm bg-slate-700/50 px-2 py-1 rounded-full">
      <span>{getWeatherEmoji(forecast.icon)}</span>
      <span>{forecast.temp_max}°</span>
    </span>
  );
}
