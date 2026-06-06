'use client';

import { motion } from 'framer-motion';
import {
  Clock,
  Wrench,
  ShieldCheck,
  FileText,
  CheckCircle,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { formatDate } from '@/lib/format';
import type { Vehicle } from '@/types/inventory';
import { cn } from '@/lib/cn';

interface DetailedTimelineProps {
  vehicle: Vehicle;
  className?: string;
}

interface TimelineEvent {
  date: string;
  formattedDate: string;
  label: string;
  isCurrent: boolean;
}

function parseHistory(history: [string, string][]): TimelineEvent[] {
  return history.map(([date, label]) => {
    const isCurrent = date === 'Aktuell';
    return {
      date,
      formattedDate: isCurrent ? 'Aktuell' : formatDate(date),
      label,
      isCurrent,
    };
  });
}

export function DetailedTimeline({ vehicle, className }: DetailedTimelineProps) {
  const events = parseHistory(vehicle.history);
  const dmg = vehicle.damageHistory;
  const trust = vehicle.trust;

  const containerVariants: any = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 },
    },
  };
  
  const eventVariants: any = {
    hidden: { opacity: 0, x: -12 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <div className={cn("flex flex-col gap-10", className)}>
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
            <ShieldCheck size={18} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-0.5">Unfälle</p>
            <p className="font-semibold text-neutral-900 text-[15px]">
              {dmg.accidents === 0 ? 'Keine' : String(dmg.accidents)}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <Wrench size={18} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-0.5">Letzte Wartung</p>
            <p className="font-semibold text-neutral-900 text-[15px] font-mono tracking-tight">
              {formatDate(dmg.lastService)}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
            <Calendar size={18} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-0.5">Nächste Wartung</p>
            <p className="font-semibold text-neutral-900 text-[15px] font-mono tracking-tight">
              {formatDate(dmg.nextService)}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <Clock size={18} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-0.5">Vorbesitzer</p>
            <p className="font-semibold text-neutral-900 text-[15px]">
              {trust.owners}. Hand
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <motion.div
        className="relative pl-6 space-y-8 before:absolute before:inset-y-2 before:left-[11px] before:w-0.5 before:bg-neutral-200"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {events.map((event, i) => {
          return (
            <motion.div
              key={i}
              className="relative"
              variants={eventVariants}
            >
              {/* Dot */}
              <div className="absolute -left-6 top-1.5 flex items-center justify-center w-6 h-6 -translate-x-1/2 bg-white">
                <div className={cn(
                  "w-2.5 h-2.5 rounded-full z-10",
                  event.isCurrent ? "bg-red-600" : "bg-green-500"
                )} />
                {event.isCurrent && (
                  <div className="absolute inset-0 rounded-full border border-red-600 animate-ping opacity-20" />
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col">
                <span className="text-[11px] font-mono font-semibold text-neutral-500 mb-0.5">
                  {event.formattedDate}
                </span>
                <span className={cn(
                  "text-[15px] leading-snug",
                  event.isCurrent ? "font-bold text-neutral-900" : "font-medium text-neutral-700"
                )}>
                  {event.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Documents & Certificates */}
      <div className="rounded-2xl bg-white border border-neutral-200/60 p-6 shadow-sm mt-4">
        <h4 className="flex items-center gap-2 font-display text-lg font-bold text-neutral-900 mb-4 tracking-tight">
          <FileText size={18} className="text-neutral-400" />
          Dokumente & Nachweise
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {trust.scheckheft && (
            <div className="flex items-start gap-2.5 text-sm font-medium text-neutral-700">
              <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
              Scheckheftgepflegt
            </div>
          )}
          {trust.unfallfrei && (
            <div className="flex items-start gap-2.5 text-sm font-medium text-neutral-700">
              <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
              Unfallfrei bestätigt
            </div>
          )}
          {dmg.repairsCertified && (
            <div className="flex items-start gap-2.5 text-sm font-medium text-neutral-700">
              <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
              Reparaturen zertifiziert
            </div>
          )}
          {trust.nichtraucher && (
            <div className="flex items-start gap-2.5 text-sm font-medium text-neutral-700">
              <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
              Nichtraucherfahrzeug
            </div>
          )}
          {trust.garantie && (
            <div className="flex items-start gap-2.5 text-sm font-medium text-neutral-700">
              <CheckCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Garantie: <span className="font-bold text-neutral-900">{trust.garantie}</span></span>
            </div>
          )}
          {trust.hu && (
            <div className="flex items-start gap-2.5 text-sm font-medium text-neutral-700">
              <CheckCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <span>HU/AU bis: <span className="font-mono font-bold text-neutral-900">{formatDate(trust.hu)}</span></span>
            </div>
          )}
          {dmg.accidents > 0 && (
            <div className="flex items-start gap-2.5 text-sm font-medium text-red-700 col-span-full mt-2 bg-red-50 p-3 rounded-xl border border-red-100">
              <AlertCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
              {dmg.accidents} Unfall(e) — Schwere: {dmg.severity ?? 'Unbekannt'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
