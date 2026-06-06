'use client';

import {
  Store,
  Check,
  Star,
  Clock,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Users,
  ExternalLink,
} from 'lucide-react';
import { formatNumber } from '@/lib/format';
import type { Dealer } from '@/types/inventory';
import { cn } from '@/lib/cn';

interface DealerSignalsProps {
  dealer: Dealer;
  className?: string;
}

export function DealerSignals({ dealer, className }: DealerSignalsProps) {
  return (
    <div className={cn("flex flex-col gap-8 rounded-2xl bg-white border border-neutral-200/60 p-6 md:p-8 shadow-sm", className)}>
      {/* Dealer Identity */}
      <div className="flex items-start gap-4">
        <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 shadow-sm" aria-hidden="true">
          <Store size={24} />
          <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white ring-2 ring-white">
            <Check size={12} strokeWidth={3} />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-display text-xl font-bold text-neutral-900 leading-none">
              {dealer.name}
            </h4>
            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-700">
              Verifiziert
            </span>
          </div>
          <p className="flex items-center gap-1.5 text-sm font-medium text-neutral-500">
            <MapPin size={14} className="text-neutral-400" />
            {dealer.location}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 rounded-xl bg-neutral-50 p-4 border border-neutral-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <Star size={18} className="fill-current" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-0.5">Bewertung</p>
            <p className="text-sm font-bold text-neutral-900">
              <span className="font-mono">{dealer.rating}</span>
              <span className="text-neutral-400 font-medium ml-1">
                (<span className="font-mono">{formatNumber(dealer.reviews)}</span>)
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-neutral-50 p-4 border border-neutral-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <Clock size={18} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-0.5">Antwortzeit</p>
            <p className="text-sm font-bold text-neutral-900">{dealer.responseTime}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-neutral-50 p-4 border border-neutral-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
            <MessageCircle size={18} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-0.5">Antwortrate</p>
            <p className="text-sm font-bold font-mono text-neutral-900">
              {dealer.responseRate}%
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-neutral-50 p-4 border border-neutral-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 text-neutral-600">
            <Users size={18} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-0.5">Seit</p>
            <p className="text-sm font-bold font-mono text-neutral-900">
              {dealer.established}
            </p>
          </div>
        </div>
      </div>

      {/* Hours */}
      <div className="flex items-center justify-center gap-2 rounded-xl bg-green-50 py-3 text-sm font-medium text-green-700 border border-green-100/50">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        {dealer.hoursToday}
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-4 text-[15px] font-semibold text-white transition-all hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/20 active:scale-95"
        >
          <Phone size={18} />
          Anrufen
        </button>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-neutral-100 px-6 py-4 text-[15px] font-semibold text-neutral-900 transition-all hover:bg-neutral-200 active:scale-95"
        >
          <Mail size={18} />
          Nachricht senden
        </button>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-4 text-[15px] font-semibold text-neutral-600 transition-all hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 active:scale-95"
        >
          <ExternalLink size={18} />
          Alle Fahrzeuge des Händlers
        </button>
      </div>
    </div>
  );
}
