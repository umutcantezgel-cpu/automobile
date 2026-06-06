'use client';

import { motion } from 'framer-motion';
import { useMotionTokens } from '@/lib/motion';
import {
  TrendingUp,
  Crown,
  Inbox,
  Clock,
  Activity,
  Users,
} from 'lucide-react';
import { VEHICLES } from '@/lib/mock/vehicles';
import { formatPrice, formatNumber } from '@/lib/format';
import type { Vehicle } from '@/types/inventory';
import { cn } from '@/lib/cn';

/* ─── KPI data ─── */
interface KPICard {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  trendColor?: string;
  trendIcon?: React.ReactNode;
}

const KPI_CARDS: KPICard[] = [
  {
    label: 'Aktive Inserate',
    value: '124',
    sub: '+8 vs. Vormonat',
    icon: <Activity size={18} />,
    trendColor: 'var(--color-success)',
    trendIcon: <TrendingUp size={14} />,
  },
  {
    label: 'Top-Inserate',
    value: '18',
    sub: 'Premium-Platzierung',
    icon: <Crown size={18} />,
  },
  {
    label: 'Offene Anfragen',
    value: '12',
    sub: '3 neue heute',
    icon: <Inbox size={18} />,
  },
  {
    label: 'Ø Antwortzeit',
    value: '47 Min.',
    sub: '-12% vs. Vormonat',
    icon: <Clock size={18} />,
    trendColor: 'var(--color-success)',
    trendIcon: <TrendingUp size={14} />,
  },
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

/* ─── Lead data ─── */
interface LeadItem {
  initials: string;
  name: string;
  vehicle: string;
  time: string;
  color: string;
}

const LEADS: LeadItem[] = [
  { initials: 'MH', name: 'Markus Hoffmann', vehicle: 'Anfrage zu Audi RS6 Avant', time: 'Vor 12 Min.', color: 'var(--color-info)' },
  { initials: 'SR', name: 'Dr. Sebastian Renz', vehicle: 'Anfrage zu Porsche 911 GT3', time: 'Vor 34 Min.', color: 'var(--color-success)' },
  { initials: 'CB', name: 'Christine Bauer', vehicle: 'Anfrage zu BMW M3 Competition', time: 'Vor 1 Std.', color: 'var(--color-warning)' },
  { initials: 'TW', name: 'Thomas Weber', vehicle: 'Anfrage zu Mercedes G 63 AMG', time: 'Vor 2 Std.', color: 'var(--color-destructive)' },
];

/* ─── Views mock ─── */
const VIEWS = [847, 1243, 632, 1891, 456, 712];

export default function AdminDashboardPage() {
  const { getDuration, getDelay, shouldReduceMotion } = useMotionTokens();

  const fadeUp: any = {
    hidden: { opacity: 0, y: 14 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: getDelay(i * 0.06), duration: getDuration(0.45), ease: 'easeOut' as const },
    }),
  };

  const tableVehicles = VEHICLES.slice(0, 6);

  return (
    <div className="flex flex-col gap-8">
      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {KPI_CARDS.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            className="adm-card"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={i}
          >
            <div className="p-6 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                  {kpi.label}
                </h3>
                <div className="adm-card-icon">{kpi.icon}</div>
              </div>
              <div className="font-display text-3xl font-bold tracking-tight tabular-nums">
                {kpi.value}
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                {kpi.trendIcon && (
                  <span style={{ color: kpi.trendColor }}>{kpi.trendIcon}</span>
                )}
                <span
                  style={{
                    color: kpi.trendColor || 'var(--color-muted-foreground)',
                    fontWeight: kpi.trendColor ? 600 : 400,
                  }}
                >
                  {kpi.sub}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Two-column: Activity + Leads ── */}
      <div className="grid gap-6 items-start lg:grid-cols-[1.6fr_1fr]">
        {/* Activity Table */}
        <motion.div
          className="adm-card"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={4}
        >
          <div className="adm-card-head">
            <div className="flex items-center gap-3">
              <div className="adm-card-icon">
                <Activity size={18} />
              </div>
              <div>
                <h3 className="text-base font-semibold font-display">
                  Letzte Aktivität
                </h3>
                <p className="text-xs text-neutral-500">
                  Fahrzeugübersicht
                </p>
              </div>
            </div>
          </div>

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
                  <th>Aufrufe</th>
                </tr>
              </thead>
              <tbody>
                {tableVehicles.map((v, i) => {
                  const status = getStatusForVehicle(v);
                  return (
                    <tr key={v.id}>
                      <td>
                        <input type="checkbox" className="checkbox" />
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className={cn("veh-img w-14 h-10 rounded-md shrink-0", v.imgAlt)}>
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
                        </div>
                      </td>
                      <td>
                        <span className="font-mono tabular-nums text-sm font-medium">
                          {formatPrice(v.price)}
                        </span>
                      </td>
                      <td>
                        <StatusPill status={status} />
                      </td>
                      <td className="w-16 text-center">
                        {v.isPremium && (
                          <Crown
                            size={16}
                            style={{ color: 'var(--color-premium)' }}
                            className="mx-auto"
                          />
                        )}
                      </td>
                      <td>
                        <span className="font-mono tabular-nums text-sm">
                          {formatNumber(VIEWS[i])}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Leads Card */}
        <motion.div
          className="adm-card"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={5}
        >
          <div className="adm-card-head">
            <div className="flex items-center gap-3">
              <div className="adm-card-icon">
                <Users size={18} />
              </div>
              <div>
                <h3 className="text-base font-semibold font-display">
                  Neueste Leads
                </h3>
                <p className="text-xs text-neutral-500">
                  Letzte Anfragen
                </p>
              </div>
            </div>
          </div>

          <div className="adm-card-body flex flex-col gap-1">
            {LEADS.map((lead) => (
              <div
                key={lead.name}
                className="flex items-center gap-3 rounded-lg p-3 transition-colors duration-150 ease-in-out cursor-pointer hover:bg-neutral-50"
              >
                <div
                  className="flex items-center justify-center shrink-0 w-9 h-9 rounded-lg text-white text-[11px] font-bold font-display"
                  style={{ background: lead.color }}
                >
                  {lead.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">{lead.name}</div>
                  <div className="text-xs whitespace-nowrap overflow-hidden text-ellipsis text-neutral-500">{lead.vehicle}</div>
                </div>
                <span className="text-xs font-mono tabular-nums whitespace-nowrap text-neutral-500">{lead.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
