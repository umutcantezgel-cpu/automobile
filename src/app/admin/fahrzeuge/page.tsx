'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useMotionTokens } from '@/lib/motion';
import {
  Plus,
  Download,
  Search,
  Crown,
  MoreHorizontal,
} from 'lucide-react';
import { VEHICLES } from '@/lib/mock/vehicles';
import { formatPrice, formatNumber } from '@/lib/format';
import type { Vehicle } from '@/types/inventory';
import { cn } from '@/lib/cn';

/* ─── Tab data ─── */
interface FilterTab {
  key: string;
  label: string;
  count: number;
}

const TABS: FilterTab[] = [
  { key: 'alle', label: 'Alle', count: 124 },
  { key: 'live', label: 'Live', count: 98 },
  { key: 'entwurf', label: 'Entwurf', count: 12 },
  { key: 'reserviert', label: 'Reserviert', count: 8 },
  { key: 'verkauft', label: 'Verkauft', count: 38 },
  { key: 'top', label: 'Top-Inserate', count: 18 },
];

/* ─── Status helper ─── */
type StatusKey = 'live' | 'entwurf' | 'reserviert' | 'verkauft';

interface StatusConfig {
  label: string;
  bg: string;
  text: string;
  dot?: boolean;
}

const STATUS_MAP: Record<StatusKey, StatusConfig> = {
  live: {
    label: 'Live',
    bg: 'color-mix(in srgb, var(--color-success) 12%, transparent)',
    text: 'var(--color-success)',
    dot: true,
  },
  entwurf: {
    label: 'Entwurf',
    bg: 'var(--color-muted)',
    text: 'var(--color-muted-foreground)',
  },
  reserviert: {
    label: 'Reserviert',
    bg: 'color-mix(in srgb, var(--color-warning) 12%, transparent)',
    text: 'var(--color-warning)',
  },
  verkauft: {
    label: 'Verkauft',
    bg: 'var(--color-muted)',
    text: 'var(--color-border-strong)',
  },
};

function getStatusForVehicle(v: Vehicle): StatusKey {
  if (v.tag === 'RESERVIERT') return 'reserviert';
  if (v.km > 20000) return 'verkauft';
  if (!v.tag && !v.isPremium) return 'entwurf';
  return 'live';
}

function StatusPill({ status }: { status: StatusKey }) {
  const cfg = STATUS_MAP[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap"
      style={{ background: cfg.bg, color: cfg.text }}
    >
      {cfg.dot && <span className="adm-pulse-dot" />}
      {cfg.label}
    </span>
  );
}

/* ─── Mock dates & views ─── */
const DATES = [
  'Heute, 14:23',
  'Heute, 11:05',
  'Gestern, 18:42',
  'Gestern, 09:15',
  '02.06.2026',
  '01.06.2026',
  '30.05.2026',
  '28.05.2026',
];

const VIEWS_LIST = [847, 1243, 632, 1891, 456, 712, 389, 1024];

export default function FahrzeugePage() {
  const { getDuration, getDelay, prefersReducedMotion } = useMotionTokens();

  const fadeUp: any = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: getDuration(0.4), ease: 'easeOut' as const },
    },
  };

  const [activeTab, setActiveTab] = useState('alle');
  const [search, setSearch] = useState('');

  const filteredVehicles = VEHICLES.filter((v) => {
    if (search) {
      const q = search.toLowerCase();
      return (
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.variant.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <motion.div
      className="flex flex-col gap-6"
      variants={fadeUp}
      initial="hidden"
      animate="show"
    >
      {/* ── Header Row ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="adm-filter-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={cn('adm-filter-tab', activeTab === tab.key && 'active')}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              <span className="font-mono tabular-nums text-xs opacity-70">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button className="btn btn-ghost btn-sm">
            <Download size={16} />
            Importieren
          </button>
          <Link href="/admin/fahrzeuge/new" className={cn("btn btn-primary btn-sm", "no-underline")}>
            <Plus size={16} />
            Neues Fahrzeug
          </Link>
        </div>
      </div>

      {/* ── Search ── */}
      <div className={cn("adm-search", "w-full max-w-2xl")}>
        <Search size={16} className="text-neutral-500 shrink-0" />
        <input
          type="text"
          placeholder="Marke, Modell, FIN…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ── Table ── */}
      <div className="adm-card">
        <div className="overflow-x-auto">
          <table className="adm-table">
            <thead>
              <tr>
                <th className="w-10">
                  <input type="checkbox" className="checkbox" />
                </th>
                <th>Fahrzeug</th>
                <th>Preis</th>
                <th>Status</th>
                <th className="w-16 text-center">Premium</th>
                <th>Letzte Änderung</th>
                <th>Aufrufe</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map((v, i) => {
                const status = getStatusForVehicle(v);
                return (
                  <tr key={v.id}>
                    <td>
                      <input type="checkbox" className="checkbox" />
                    </td>
                    <td>
                      <Link
                        href={`/admin/fahrzeuge/${v.id}`}
                        className="flex items-center gap-3 no-underline text-inherit"
                      >
                        <div className={cn('veh-img', v.imgAlt, "w-14 h-10 rounded-md shrink-0")}>
                          <div className="veh-img-shape" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                            {v.make} {v.model}
                          </div>
                          <div className="text-xs whitespace-nowrap overflow-hidden text-ellipsis text-neutral-500">
                            {v.variant}
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td>
                      <span className="font-mono tabular-nums text-sm font-medium">
                        {formatPrice(v.price)}
                      </span>
                    </td>
                    <td>
                      <StatusPill status={status} />
                    </td>
                    <td className="text-center">
                      {v.isPremium && (
                        <Crown
                          size={16}
                          style={{ color: 'var(--color-premium)' }}
                          className="mx-auto"
                        />
                      )}
                    </td>
                    <td>
                      <span className="font-mono tabular-nums text-sm text-neutral-500">
                        {DATES[i % DATES.length]}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono tabular-nums text-sm">
                        {formatNumber(VIEWS_LIST[i % VIEWS_LIST.length])}
                      </span>
                    </td>
                    <td>
                      <button
                        className="flex items-center justify-center w-8 h-8 rounded-md bg-transparent border-none cursor-pointer text-neutral-500"
                        aria-label="Aktionen"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
