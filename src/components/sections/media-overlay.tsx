'use client';

import { Camera, RotateCw, Play } from 'lucide-react';
import type { VehicleMedia } from '@/types/inventory';
import { cn } from '@/lib/cn';

interface MediaOverlayProps {
  media: VehicleMedia;
  className?: string;
}

export function MediaOverlay({ media, className }: MediaOverlayProps) {
  return (
    <div className={cn("flex flex-col gap-1.5 pointer-events-none", className)}>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm ring-1 ring-white/10">
        <Camera size={12} className="opacity-80" />
        <span className="font-mono tracking-wider">{media.photoCount}</span>
      </span>
      {media.has360 && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-neutral-900 shadow-sm ring-1 ring-black/5">
          <RotateCw size={12} className="text-red-600" />
          360°
        </span>
      )}
      {media.hasVideo && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm ring-1 ring-white/10">
          <Play size={12} className="opacity-80" />
          Video
        </span>
      )}
    </div>
  );
}
