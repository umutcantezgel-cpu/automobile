'use client';

import { ShieldCheck, BookOpen, Wind, Zap } from 'lucide-react';
import type { VehicleTrust } from '@/types/inventory';
import { cn } from '@/lib/cn';

interface TrustChipsProps {
  trust: VehicleTrust;
  max?: number;
  className?: string;
}

interface ChipData {
  icon: React.ReactNode;
  label: string;
}

export function TrustChips({ trust, max = 3, className }: TrustChipsProps) {
  const chips: ChipData[] = [];

  if (trust.unfallfrei) {
    chips.push({
      icon: <ShieldCheck size={12} className="text-green-600" />,
      label: 'Unfallfrei',
    });
  }

  if (trust.scheckheft) {
    chips.push({
      icon: <BookOpen size={12} className="text-blue-600" />,
      label: 'Scheckheft',
    });
  }

  if (trust.garantie) {
    chips.push({
      icon: <Wind size={12} className="text-amber-500" />,
      label: trust.garantie,
    });
  }

  if (trust.sofortVerfuegbar) {
    chips.push({
      icon: <Zap size={12} className="text-red-500" />,
      label: 'Sofort verfügbar',
    });
  }

  const visible = chips.slice(0, max);
  const remaining = chips.length - max;

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {visible.map((chip, i) => (
        <span 
          key={i} 
          className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2 py-1 text-[11px] font-medium text-neutral-600 whitespace-nowrap"
        >
          {chip.icon}
          {chip.label}
        </span>
      ))}
      {remaining > 0 && (
        <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-1 text-[11px] font-medium text-neutral-500">
          +{remaining}
        </span>
      )}
    </div>
  );
}
