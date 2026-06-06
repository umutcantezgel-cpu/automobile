'use client';

import { formatPrice } from '@/lib/format';
import { PRICE_RATING_MAP } from '@/lib/mock/vehicles';
import type { PriceRating } from '@/types/inventory';
import { cn } from '@/lib/cn';

interface MarketPriceMeterProps {
  price: number;
  rating: PriceRating;
  className?: string;
}

interface ZoneConfig {
  key: string;
  label: string;
  cssClass: string;
}

const ZONES: ZoneConfig[] = [
  {
    key: 'good',
    label: 'Günstig',
    cssClass: 'bg-green-500',
  },
  {
    key: 'fair',
    label: 'Fair',
    cssClass: 'bg-blue-500',
  },
  {
    key: 'high',
    label: 'Hoch',
    cssClass: 'bg-red-500',
  },
];

export function MarketPriceMeter({
  price,
  rating,
  className,
}: MarketPriceMeterProps) {
  const meta = PRICE_RATING_MAP[rating.level];
  const thumbPosition = meta?.meter ?? 50;

  const difference = price - rating.marketAvg;
  const absDifference = Math.abs(difference);

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      {/* Meter Track */}
      <div className="relative pt-10 pb-4">
        <div className="relative h-3 w-full rounded-full overflow-hidden flex bg-neutral-100">
          <div className="h-full flex-1 bg-green-400" />
          <div className="h-full w-0.5 bg-white" />
          <div className="h-full flex-1 bg-blue-400" />
          <div className="h-full w-0.5 bg-white" />
          <div className="h-full flex-1 bg-red-400" />
        </div>

        {/* Thumb */}
        <div
          className="absolute top-0 bottom-0 w-px z-10 transition-all duration-700 ease-out"
          style={{ left: `${thumbPosition}%` }}
        >
          {/* Thumb Line */}
          <div className="absolute top-10 bottom-4 w-0.5 bg-neutral-900 -translate-x-1/2 rounded-full shadow-sm" />
          
          {/* Flag */}
          <div className="absolute top-0 -translate-x-1/2 -translate-y-2 flex flex-col items-center">
            <div className="bg-neutral-900 text-white text-[13px] font-bold font-mono px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap">
              {formatPrice(price)}
            </div>
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-neutral-900" />
          </div>
        </div>
      </div>

      {/* Zone Legend */}
      <div className="flex items-center justify-between px-4">
        {ZONES.map((zone) => (
          <div key={zone.key} className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", zone.cssClass)} />
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              {zone.label}
            </span>
          </div>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Rating Card */}
        <div className="flex flex-col gap-1 p-4 rounded-xl bg-neutral-50 border border-neutral-100">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Bewertung</span>
          <span className="font-semibold text-[15px]" style={{ color: meta?.accent }}>
            {rating.label}
          </span>
        </div>

        {/* Market Average Card */}
        <div className="flex flex-col gap-1 p-4 rounded-xl bg-neutral-50 border border-neutral-100">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Marktdurchschnitt</span>
          <span className="font-mono font-semibold text-[15px] text-neutral-900">
            {formatPrice(rating.marketAvg)}
          </span>
        </div>

        {/* Difference Card */}
        <div className="flex flex-col gap-1 p-4 rounded-xl bg-neutral-50 border border-neutral-100">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Differenz</span>
          <span
            className={cn(
              "font-mono font-semibold text-[15px]",
              difference < 0 ? "text-green-600" : difference > 0 ? "text-red-600" : "text-neutral-900"
            )}
          >
            {difference < 0 ? '−' : difference > 0 ? '+' : ''}
            {formatPrice(absDifference)}
            <span className="text-xs font-medium opacity-80 ml-1.5">
              ({rating.deltaPct > 0 ? '+' : ''}{rating.deltaPct}%)
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
