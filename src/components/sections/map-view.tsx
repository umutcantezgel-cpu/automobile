'use client';

import { formatPrice } from '@/lib/format';
import { MapPin, Plus, Minus } from 'lucide-react';
import type { Vehicle } from '@/types/inventory';
import { cn } from '@/lib/cn';

interface MapViewProps {
  vehicles: Vehicle[];
  className?: string;
}

interface PinPosition {
  x: number;
  y: number;
}

/**
 * Deterministic pseudo-random pin placement based on vehicle index
 * to simulate map spread around Wetzlar area.
 */
function getPinPosition(index: number, total: number): PinPosition {
  const seed = (index * 2654435761) >>> 0;
  const x = 12 + ((seed % 76) * (76 / 76));
  const y = 15 + (((seed >> 8) % 70) * (70 / 70));
  return { x: Math.min(x, 88), y: Math.min(y, 85) };
}

export function MapView({ vehicles, className }: MapViewProps) {
  return (
    <div
      className={cn(
        "relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden bg-neutral-900",
        className
      )}
    >
      {/* Dark map background layers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle grid lines simulating map roads */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
        {/* Diagonal roads */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(45deg, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(-45deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '96px 96px',
          }}
        />
        {/* Radial glow for center */}
        <div className="absolute inset-0 bg-radial-gradient from-neutral-800/40 via-transparent to-neutral-900/90" />
      </div>

      {/* City label */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/90 text-xs font-semibold shadow-lg">
          <MapPin size={12} className="text-red-500" />
          Wetzlar & Umgebung
        </div>
      </div>

      {/* Vehicle price pins */}
      {vehicles.map((vehicle, i) => {
        const pos = getPinPosition(i, vehicles.length);
        return (
          <div
            key={vehicle.id}
            className="absolute z-20 group"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            {/* Pin body */}
            <div
              className={cn(
                "relative flex items-center justify-center px-3 py-1.5 rounded-lg text-[13px] font-bold shadow-xl transition-all cursor-pointer group-hover:-translate-y-1 group-hover:scale-105",
                vehicle.isPremium
                  ? "bg-red-600 text-white border border-red-500 z-30"
                  : "bg-white text-neutral-900 border border-neutral-200"
              )}
            >
              {formatPrice(vehicle.price)}
              {/* Arrow */}
              <div
                className={cn(
                  "absolute -bottom-[5px] left-1/2 w-0 h-0 -translate-x-1/2 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px]",
                  vehicle.isPremium ? "border-t-red-600" : "border-t-white"
                )}
              />
            </div>

            {/* Tooltip on hover */}
            <div className="absolute left-1/2 bottom-full mb-3 -translate-x-1/2 opacity-0 scale-95 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 z-40 w-max">
              <div className="bg-black/90 backdrop-blur-md text-white rounded-xl p-3 shadow-2xl border border-white/10 flex flex-col items-center">
                <p className="font-semibold text-sm whitespace-nowrap">
                  {vehicle.make} {vehicle.model}
                </p>
                <p className="text-[11px] text-white/70 mt-0.5">
                  {vehicle.year} · <span className="font-mono text-white/90">{vehicle.hp}</span> PS
                </p>
              </div>
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wider uppercase text-white/60">
          <span className="w-3 h-3 rounded-full bg-white border border-white/20" />
          Standard
        </div>
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wider uppercase text-white/60">
          <span className="w-3 h-3 rounded-full bg-red-600 border border-red-500 shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
          Premium
        </div>
      </div>

      {/* Zoom controls (decorative) */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col bg-white/10 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-xl">
        <button
          type="button"
          className="p-2.5 text-white hover:bg-white/20 transition-colors border-b border-white/10"
          aria-label="Vergrößern"
        >
          <Plus size={16} />
        </button>
        <button
          type="button"
          className="p-2.5 text-white hover:bg-white/20 transition-colors"
          aria-label="Verkleinern"
        >
          <Minus size={16} />
        </button>
      </div>
    </div>
  );
}
