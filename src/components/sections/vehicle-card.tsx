'use client';

import { motion } from 'framer-motion';
import { Calendar, Gauge, Activity, Fuel, Heart, Award } from 'lucide-react';
import Link from 'next/link';
import { formatPrice, formatKm, formatPower } from '@/lib/format';
import { useFavoritesStore } from '@/lib/store/favorites';
import { TrustChips } from '@/components/sections/trust-chips';
import { MediaOverlay } from '@/components/sections/media-overlay';
import { PriceRatingBadge } from '@/components/sections/price-rating-badge';
import type { Vehicle, VehicleBadge } from '@/types/inventory';
import { cn } from '@/lib/cn';

interface VehicleCardProps {
  vehicle: Vehicle;
  index?: number;
  variant?: 'grid' | 'list';
  className?: string;
}

const BADGE_CLASS_MAP: Record<VehicleBadge, string> = {
  'NEU': 'bg-blue-600 text-white',
  'RESERVIERT': 'bg-amber-500 text-white',
  'PREIS GESENKT': 'bg-green-600 text-white',
  'PREMIUM': 'bg-neutral-900 text-white',
  'SONDERMODELL': 'bg-red-600 text-white',
  '': '',
};

const FUEL_SHORT: Record<string, string> = {
  'Benzin': 'Benzin',
  'Diesel': 'Diesel',
  'Hybrid': 'Hybrid',
  'Elektro': 'Elektro',
};

function VehicleBadgeTag({ tag }: { tag: VehicleBadge }) {
  if (!tag) return null;

  const isTopListing = tag === 'PREMIUM';

  if (isTopListing) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-3 py-1 text-[11px] font-semibold tracking-wider uppercase text-white shadow-sm">
        <Award size={12} className="text-amber-400" />
        Top-Inserat
      </span>
    );
  }

  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-wider uppercase shadow-sm",
      BADGE_CLASS_MAP[tag]
    )}>
      {tag}
    </span>
  );
}

export function VehicleCard({ vehicle, index = 0, variant = 'grid', className }: VehicleCardProps) {
  const toggleFav = useFavoritesStore((s) => s.toggle);
  const hasFav = useFavoritesStore((s) => s.has(vehicle.id));

  const cardVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  if (variant === 'list') {
    return (
      <motion.article
        custom={index}
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className={cn(
          "group relative flex flex-col md:flex-row overflow-hidden rounded-2xl bg-white border border-neutral-200/60 shadow-sm transition-all hover:shadow-xl hover:shadow-neutral-200/50 hover:-translate-y-0.5",
          vehicle.isPremium && "ring-1 ring-neutral-900",
          className
        )}
      >
        <Link href={`/fahrzeuge/${vehicle.id}`} className="flex flex-col md:flex-row w-full">
          {/* Image */}
          <div className="relative w-full md:w-80 h-56 md:h-auto overflow-hidden bg-neutral-100 flex-shrink-0">
            {vehicle.images && vehicle.images.length > 0 ? (
              <img
                src={vehicle.images[0]}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className={cn("veh-img absolute inset-0 transition-transform duration-700 group-hover:scale-105", vehicle.imgAlt)}>
                <div className="veh-img-shape" />
                <div className="veh-img-grid" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />
            
            {vehicle.images && vehicle.images.length > 1 && (
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
                {vehicle.images.map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "h-1.5 rounded-full shadow-sm transition-all duration-300", 
                      i === 0 ? "w-4 bg-white" : "w-1.5 bg-white/50"
                    )} 
                  />
                ))}
              </div>
            )}
            
            {vehicle.tag && (
              <div className="absolute top-3 left-3">
                <VehicleBadgeTag tag={vehicle.tag} />
              </div>
            )}
            <div className="absolute bottom-3 right-3">
              <MediaOverlay media={vehicle.media} />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col justify-between p-5 w-full">
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <TrustChips trust={vehicle.trust} max={3} />
                  <h3 className="font-display text-xl font-bold text-neutral-900 mt-2">
                    {vehicle.make} {vehicle.model}
                  </h3>
                  <p className="text-sm text-neutral-500 line-clamp-1 mt-1">
                    {vehicle.variant}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFav(vehicle.id); }}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm border transition-all hover:scale-110",
                    hasFav ? "border-red-100 text-red-600 bg-red-50" : "border-neutral-200 text-neutral-400 hover:text-red-600"
                  )}
                >
                  <Heart size={16} className={cn(hasFav && "fill-current")} />
                </button>
              </div>

              {/* Specs */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4">
                <div className="flex items-center gap-1.5 text-[13px] font-medium text-neutral-600">
                  <Calendar size={14} className="text-neutral-400" /> {vehicle.year}
                </div>
                <div className="flex items-center gap-1.5 text-[13px] font-medium text-neutral-600">
                  <Gauge size={14} className="text-neutral-400" /> {formatKm(vehicle.km)}
                </div>
                <div className="flex items-center gap-1.5 text-[13px] font-medium text-neutral-600">
                  <Activity size={14} className="text-neutral-400" /> {formatPower(vehicle.kw, vehicle.hp)}
                </div>
                <div className="flex items-center gap-1.5 text-[13px] font-medium text-neutral-600">
                  <Fuel size={14} className="text-neutral-400" /> {FUEL_SHORT[vehicle.fuel] ?? vehicle.fuel}
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="mt-6 flex items-end justify-between border-t border-neutral-100 pt-4">
              <div>
                {vehicle.oldPrice && (
                  <div className="text-xs text-neutral-400 line-through mb-0.5">
                    {formatPrice(vehicle.oldPrice)}
                  </div>
                )}
                <div className="font-display text-2xl font-bold text-neutral-900">
                  {formatPrice(vehicle.price)}
                </div>
                {vehicle.monthly && (
                  <div className="text-xs font-medium text-neutral-500 mt-0.5">
                    ab {formatPrice(vehicle.monthly)} mtl.
                  </div>
                )}
              </div>
              <PriceRatingBadge rating={vehicle.priceRating} compact />
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  /* ===== Grid Variant ===== */
  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-neutral-200/60 shadow-sm transition-all hover:shadow-xl hover:shadow-neutral-200/50 hover:-translate-y-1 h-full",
        vehicle.isPremium && "ring-1 ring-neutral-900",
        className
      )}
    >
      <Link href={`/fahrzeuge/${vehicle.id}`} className="flex flex-col h-full">
        {/* Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 flex-shrink-0">
          {vehicle.images && vehicle.images.length > 0 ? (
            <img
              src={vehicle.images[0]}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className={cn("veh-img absolute inset-0 transition-transform duration-700 group-hover:scale-105", vehicle.imgAlt)}>
              <div className="veh-img-shape" />
              <div className="veh-img-grid" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />
          
          {vehicle.images && vehicle.images.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
              {vehicle.images.map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "h-1.5 rounded-full shadow-sm transition-all duration-300", 
                    i === 0 ? "w-4 bg-white" : "w-1.5 bg-white/50"
                  )} 
                />
              ))}
            </div>
          )}
          
          {vehicle.tag && (
            <div className="absolute top-3 left-3">
              <VehicleBadgeTag tag={vehicle.tag} />
            </div>
          )}
          
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFav(vehicle.id); }}
            className={cn(
              "absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-md transition-all hover:scale-110",
              hasFav ? "text-red-600" : "text-neutral-500 hover:text-red-600"
            )}
          >
            <Heart size={14} className={cn(hasFav && "fill-current")} />
          </button>

          <div className="absolute bottom-3 right-3">
            <MediaOverlay media={vehicle.media} />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5">
          <TrustChips trust={vehicle.trust} max={3} />
          
          <div className="mt-3 mb-4">
            <h3 className="font-display text-lg font-bold text-neutral-900 leading-tight">
              {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-sm text-neutral-500 line-clamp-1 mt-1">
              {vehicle.variant}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-6">
            <div className="flex items-center gap-1.5 text-[13px] font-medium text-neutral-600">
              <Calendar size={14} className="text-neutral-400" /> {vehicle.year}
            </div>
            <div className="flex items-center gap-1.5 text-[13px] font-medium text-neutral-600">
              <Gauge size={14} className="text-neutral-400" /> {formatKm(vehicle.km)}
            </div>
            <div className="flex items-center gap-1.5 text-[13px] font-medium text-neutral-600">
              <Activity size={14} className="text-neutral-400" /> {formatPower(vehicle.kw, vehicle.hp)}
            </div>
            <div className="flex items-center gap-1.5 text-[13px] font-medium text-neutral-600">
              <Fuel size={14} className="text-neutral-400" /> {FUEL_SHORT[vehicle.fuel] ?? vehicle.fuel}
            </div>
          </div>

          {/* Price */}
          <div className="mt-auto border-t border-neutral-100 pt-4">
            <div className="flex items-end justify-between mb-1">
              <div>
                {vehicle.oldPrice && (
                  <div className="text-xs text-neutral-400 line-through mb-0.5">
                    {formatPrice(vehicle.oldPrice)}
                  </div>
                )}
                <div className="font-display text-xl font-bold text-neutral-900 leading-none">
                  {formatPrice(vehicle.price)}
                </div>
              </div>
              <PriceRatingBadge rating={vehicle.priceRating} compact />
            </div>
            {vehicle.monthly && (
              <div className="text-[13px] font-medium text-neutral-500 mt-1">
                ab {formatPrice(vehicle.monthly)} mtl.
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
