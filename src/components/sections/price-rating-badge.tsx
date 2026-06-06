'use client';

import type { PriceRating, PriceRatingLevel } from '@/types/inventory';
import { cn } from '@/lib/cn';

interface PriceRatingBadgeProps {
  rating: PriceRating;
  compact?: boolean;
  className?: string;
}

const LEVEL_CSS_MAP: Record<PriceRatingLevel, string> = {
  'sehr-gut': 'bg-green-100 text-green-800 border-green-200',
  'gut': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'fair': 'bg-blue-50 text-blue-700 border-blue-100',
  'erhoeht': 'bg-orange-50 text-orange-700 border-orange-100',
  'hoch': 'bg-red-50 text-red-700 border-red-100',
};

export function PriceRatingBadge({ rating, compact, className }: PriceRatingBadgeProps) {
  const cssModifier = LEVEL_CSS_MAP[rating.level];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold tracking-wide shadow-sm',
        compact ? 'px-2 py-0.5 text-[10px] uppercase' : 'px-3 py-1 text-xs',
        cssModifier,
        className
      )}
    >
      <span>{rating.label}</span>
      {rating.deltaPct !== 0 && (
        <span className="font-mono text-[0.9em] opacity-80">
          {rating.deltaPct > 0 ? '+' : ''}
          {rating.deltaPct}%
        </span>
      )}
    </span>
  );
}
