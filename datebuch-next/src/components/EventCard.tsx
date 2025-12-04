'use client';

import { Event, EventRating } from '@/types';
import { getCountdown, formatDate, cn, getCategoryColor } from '@/lib/utils';
import { Heart, Calendar, MapPin, Clock, ExternalLink } from 'lucide-react';

interface EventCardProps {
  event: Event;
  rating?: EventRating;
  onLike?: (eventId: string) => void;
  onDislike?: (eventId: string) => void;
  onClick?: (event: Event) => void;
  compact?: boolean;
}

export function EventCard({
  event,
  rating,
  onLike,
  onDislike,
  onClick,
  compact = false,
}: EventCardProps) {
  const countdown = getCountdown(event.date);
  const isLiked = rating?.liked;
  const isDisliked = rating?.disliked;

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike?.(event.id);
  };

  const handleDislike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDislike?.(event.id);
  };

  return (
    <div
      onClick={() => onClick?.(event)}
      className={cn(
        'group relative bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden',
        'transition-all duration-300 hover:border-rose-500/30 hover:shadow-lg hover:shadow-rose-500/10',
        'cursor-pointer',
        compact ? 'p-4' : 'p-5'
      )}
    >
      {/* Countdown Badge */}
      {countdown && countdown.class !== 'past' && (
        <div
          className={cn(
            'absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium',
            countdown.class === 'today' && 'bg-green-500 text-white',
            countdown.class === 'soon' && 'bg-amber-500 text-white',
            countdown.class === 'upcoming' && 'bg-blue-500/20 text-blue-400',
            countdown.class === 'future' && 'bg-slate-700 text-slate-400'
          )}
        >
          {countdown.text}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-2xl',
            'bg-gradient-to-br from-slate-700 to-slate-800'
          )}
        >
          {event.emoji || '📅'}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate group-hover:text-rose-400 transition-colors">
            {event.title}
          </h3>

          <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-slate-400">
            {event.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {event.location}
              </span>
            )}
            {event.date && event.date !== 'dauerhaft' && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(event.date)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {!compact && event.description && (
        <p className="mt-3 text-sm text-slate-400 line-clamp-2">
          {event.description}
        </p>
      )}

      {/* Meta Tags */}
      <div className="flex flex-wrap gap-2 mt-4">
        <span
          className={cn(
            'px-2.5 py-1 rounded-full text-xs font-medium',
            getCategoryColor(event.category),
            'bg-opacity-20 text-white'
          )}
        >
          {event.category}
        </span>
        {event.price && (
          <span className="px-2.5 py-1 rounded-full text-xs bg-slate-700 text-slate-300">
            {event.price}
          </span>
        )}
        {event.time && (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-slate-700 text-slate-300">
            <Clock className="w-3 h-3" />
            {event.time}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-700/50">
        <button
          onClick={handleLike}
          className={cn(
            'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all',
            isLiked
              ? 'bg-rose-500 text-white'
              : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white'
          )}
        >
          <Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
          {isLiked ? 'Favorit' : 'Merken'}
        </button>

        <button
          onClick={handleDislike}
          className={cn(
            'px-3 py-2 rounded-lg text-sm transition-all',
            isDisliked
              ? 'bg-slate-600 text-slate-300'
              : 'bg-slate-700/50 text-slate-500 hover:bg-slate-700 hover:text-slate-300'
          )}
        >
          👎
        </button>

        {event.link && (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="ml-auto flex items-center gap-1 px-3 py-2 rounded-lg text-sm bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            Tickets
          </a>
        )}
      </div>
    </div>
  );
}
