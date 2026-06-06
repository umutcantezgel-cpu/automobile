'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useMotionTokens } from '@/lib/motion';
import { X, Trophy, Plus, ArrowRight, CarFront, Banknote, Calendar, Route, Gauge, Zap, Wind, Shield, Fuel, Cog, Navigation, Info, Palette, DoorOpen, MapPin } from 'lucide-react';
import { useCompareStore } from '@/lib/store/compare';
import { VEHICLES } from '@/lib/mock/vehicles';
import { Vehicle } from '@/types/inventory';
import { cn } from '@/lib/cn';
import {
  formatPrice,
  formatMonthly,
  formatKm,
  formatPower,
  formatAccel,
  formatTopSpeed,
  formatConsumption,
  formatCO2,
  formatDisplacement,
} from '@/lib/format';

const DEFAULT_IDS = ['v1', 'v3', 'v5', 'v7'];

type BestTarget = 'low' | 'high' | 'none';

interface RowDef {
  label: string;
  icon: React.ReactNode;
  getValue: (v: Vehicle) => string | number;
  getRaw: (v: Vehicle) => number;
  best: BestTarget;
}

const ROWS: RowDef[] = [
  {
    label: 'Preis',
    icon: <Banknote size={16} />,
    getValue: (v) => formatPrice(v.price),
    getRaw: (v) => v.price,
    best: 'low',
  },
  {
    label: 'Monatsrate',
    icon: <Banknote size={16} />,
    getValue: (v) => (v.monthly ? formatMonthly(v.monthly) : '-'),
    getRaw: (v) => v.monthly || 999999,
    best: 'low',
  },
  {
    label: 'Erstzulassung',
    icon: <Calendar size={16} />,
    getValue: (v) => v.year,
    getRaw: (v) => parseInt(v.year.split('/')[1] || v.year, 10),
    best: 'high',
  },
  {
    label: 'Kilometerstand',
    icon: <Route size={16} />,
    getValue: (v) => formatKm(v.km),
    getRaw: (v) => v.km,
    best: 'low',
  },
  {
    label: 'Leistung',
    icon: <Zap size={16} />,
    getValue: (v) => formatPower(v.kw, v.hp),
    getRaw: (v) => v.hp,
    best: 'high',
  },
  {
    label: '0-100 km/h',
    icon: <Gauge size={16} />,
    getValue: (v) => formatAccel(v.accel),
    getRaw: (v) => v.accel,
    best: 'low',
  },
  {
    label: 'Höchstgeschw.',
    icon: <Wind size={16} />,
    getValue: (v) => formatTopSpeed(v.top),
    getRaw: (v) => v.top,
    best: 'high',
  },
  {
    label: 'Verbrauch',
    icon: <Fuel size={16} />,
    getValue: (v) => formatConsumption(v.consumption),
    getRaw: (v) => v.consumption,
    best: 'low',
  },
  {
    label: 'CO₂-Emission',
    icon: <Wind size={16} />,
    getValue: (v) => formatCO2(v.co2),
    getRaw: (v) => v.co2,
    best: 'low',
  },
  {
    label: 'Treibstoff',
    icon: <Fuel size={16} />,
    getValue: (v) => v.fuel,
    getRaw: () => 0,
    best: 'none',
  },
  {
    label: 'Getriebe',
    icon: <Cog size={16} />,
    getValue: (v) => v.gear,
    getRaw: () => 0,
    best: 'none',
  },
  {
    label: 'Antrieb',
    icon: <Navigation size={16} />,
    getValue: (v) => v.drive,
    getRaw: () => 0,
    best: 'none',
  },
  {
    label: 'Hubraum',
    icon: <Info size={16} />,
    getValue: (v) => formatDisplacement(v.ccm),
    getRaw: (v) => v.ccm,
    best: 'high',
  },
  {
    label: 'Farbe',
    icon: <Palette size={16} />,
    getValue: (v) => v.color,
    getRaw: () => 0,
    best: 'none',
  },
  {
    label: 'Türen',
    icon: <DoorOpen size={16} />,
    getValue: (v) => v.doors.toString(),
    getRaw: (v) => v.doors,
    best: 'none',
  },
  {
    label: 'Standort',
    icon: <MapPin size={16} />,
    getValue: (v) => v.location,
    getRaw: () => 0,
    best: 'none',
  },
];

export default function ComparePage() {
  const { getDuration, getDelay, prefersReducedMotion } = useMotionTokens();
  const store = useCompareStore();

  const activeIds = store.ids.length > 0 ? store.ids : DEFAULT_IDS;

  const vehicles = useMemo(
    () =>
      activeIds
        .map((id) => VEHICLES.find((v) => v.id === id))
        .filter((v): v is Vehicle => v !== undefined),
    [activeIds]
  );

  const bestMap = useMemo(() => {
    const map = new Map<number, Set<string>>();
    ROWS.forEach((row, ri) => {
      if (row.best === 'none' || vehicles.length < 2) {
        map.set(ri, new Set());
        return;
      }
      const entries = vehicles.map((v) => ({
        id: v.id,
        val: row.getRaw(v),
      }));
      const target =
        row.best === 'low'
          ? Math.min(...entries.map((e) => e.val))
          : Math.max(...entries.map((e) => e.val));
      const winners = new Set(
        entries.filter((e) => e.val === target).map((e) => e.id)
      );
      map.set(ri, winners);
    });
    return map;
  }, [vehicles]);

  const handleRemove = (id: string) => {
    if (store.ids.length > 0) {
      store.remove(id);
    } else {
      DEFAULT_IDS.filter((d) => d !== id).forEach((d) => store.add(d));
    }
  };

  const handleAddDefault = () => {
    const nextAvailable = VEHICLES.find((v) => !activeIds.includes(v.id));
    if (nextAvailable) {
      if (store.ids.length === 0) {
        DEFAULT_IDS.forEach((d) => store.add(d));
      }
      store.add(nextAvailable.id);
    }
  };

  const canAdd = vehicles.length < 4;

  return (
    <main>
      <section className="shell-container">
        <motion.div
          className="mb-12 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: getDuration(0.5), ease: "easeOut" as const }}
        >
          <p className="eyebrow mb-4">{'// Vergleich'}</p>
          <h1 className="text-h1 mb-4">
            Fahrzeuge im Vergleich
          </h1>
          <p className="text-lg text-neutral-500">
            Vergleichen Sie bis zu 4 Modelle direkt. Beste Werte werden automatisch markiert.
          </p>
        </motion.div>

        <motion.div
          className="overflow-x-auto -mx-4 px-4 pb-8 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: getDuration(0.5), delay: getDelay(0.15), ease: "easeOut" as const }}
        >
          <div className="min-w-[64rem]">
            <div
              className="grid gap-4 mb-2"
              style={{
                gridTemplateColumns: `12.5rem repeat(${canAdd ? vehicles.length + 1 : vehicles.length}, 1fr)`,
              }}
            >
              <div />

              <AnimatePresence mode="popLayout">
                {vehicles.map((v, i) => (
                  <motion.div
                    key={v.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: getDuration(0.3), ease: [0.16, 1, 0.3, 1]  }}
                    className="relative rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow duration-150 hover:shadow-md"
                  >
                    <button
                      onClick={() => handleRemove(v.id)}
                      className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-neutral-500 backdrop-blur-md transition-all duration-150 hover:scale-105 hover:bg-red-500/10 hover:text-red-500"
                      aria-label="Entfernen"
                    >
                      <X size={16} />
                    </button>

                    <div className={cn("veh-img mb-4 aspect-[16/10] w-full rounded-xl", v.imgAlt)}>
                      <div className="veh-img-grid" />
                      <div className="veh-img-shape" />
                      {v.tag && <span className="veh-img-tag">{v.tag}</span>}
                    </div>

                    <div className="mb-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 whitespace-nowrap overflow-hidden text-ellipsis">
                        {v.make}
                      </p>
                      <h3 className="font-display text-lg font-semibold leading-tight whitespace-nowrap overflow-hidden text-ellipsis mt-1">
                        {v.model}
                      </h3>
                      <p className="text-sm text-neutral-500 whitespace-nowrap overflow-hidden text-ellipsis mt-1">
                        {v.variant}
                      </p>
                    </div>

                    <Link
                      href={`/probefahrt?id=${v.id}`}
                      className="flex min-h-[2.5rem] w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition-all duration-150 hover:opacity-90 active:scale-95"
                    >
                      <CarFront size={16} />
                      Probefahrt
                    </Link>
                  </motion.div>
                ))}

                {canAdd && (
                  <motion.button
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleAddDefault}
                    className="group flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-neutral-200 bg-white/30 p-6 text-neutral-500 transition-all duration-150 hover:border-black/40 hover:bg-black/5 hover:text-black cursor-pointer"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-current transition-transform duration-150 group-hover:scale-110">
                      <Plus size={24} />
                    </div>
                    <span className="text-sm font-semibold tracking-wider uppercase">
                      + Fahrzeug hinzufügen
                    </span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-4 rounded-2xl border border-neutral-200 bg-white overflow-hidden">
              {ROWS.map((row, ri) => {
                const isBest = bestMap.get(ri);
                return (
                  <div
                    key={row.label}
                    className={cn(
                      "grid items-center gap-4 border-b border-neutral-200 py-4 transition-colors duration-150",
                      ri % 2 === 0 ? "bg-neutral-50" : "",
                      ri === ROWS.length - 1 && "border-b-0"
                    )}
                    style={{
                      gridTemplateColumns: `12.5rem repeat(${canAdd ? vehicles.length + 1 : vehicles.length}, 1fr)`,
                    }}
                  >
                    <div className="flex items-center gap-3 pl-5 text-sm font-medium text-neutral-500">
                      <span className="text-black/70">{row.icon}</span>
                      <span>{row.label}</span>
                    </div>

                    <AnimatePresence mode="popLayout">
                      {vehicles.map((v) => {
                        const isWinner = isBest?.has(v.id) ?? false;
                        return (
                          <motion.div
                            layout
                            key={v.id}
                            className={cn(
                              "flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-sm tabular-nums transition-all duration-150 mx-2",
                              isWinner && "bg-black/10 text-black font-semibold ring-1 ring-black/20"
                            )}
                          >
                            {isWinner && (
                              <Trophy className="shrink-0 text-black drop-shadow-sm w-4 h-4" />
                            )}
                            <span>{row.getValue(v)}</span>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>

                    {canAdd && <div />}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
