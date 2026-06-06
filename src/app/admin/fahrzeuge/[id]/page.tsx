'use client';

import { useState, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useMotionTokens } from '@/lib/motion';
import {
  Crown,
  Eye,
  TrendingUp,
  MessageSquare,
  Images,
  RotateCw,
  Video,
  Search,
  X,
  Plus,
  Minus,
  Trash2,
  ShieldCheck,
  FileCheck,
  Check,
  Car,
} from 'lucide-react';
import { VEHICLES, BRANDS } from '@/lib/mock/vehicles';
import { formatPrice, formatKm, formatNumber } from '@/lib/format';
import type { Vehicle, FuelType, GearType, DriveType, PriceRatingLevel } from '@/types/inventory';
import { cn } from '@/lib/cn';

/* ─── Types ─── */
interface HistoryEvent {
  type: string;
  date: string;
  description: string;
  km: string;
}

interface TrustState {
  unfallfrei: boolean;
  scheckheft: boolean;
  nichtraucher: boolean;
  sofortVerfuegbar: boolean;
  vorbesitzer: number;
  docs: Record<string, boolean>;
}

/* ─── Fuel / Gear / Drive options ─── */
const FUEL_OPTIONS: FuelType[] = ['Benzin', 'Diesel', 'Hybrid', 'Elektro'];
const GEAR_OPTIONS: GearType[] = ['Manuell', 'Automatik', 'Halbautomatik'];
const DRIVE_OPTIONS: DriveType[] = ['FWD', 'RWD', 'AWD', 'Quattro', '4MATIC', 'xDrive', 'Quattro AWD'];

/* ─── Price rating ─── */
interface PriceRatingOption {
  key: string;
  label: string;
  desc: string;
  color: string;
  accent: string;
}

const PRICE_RATING_OPTIONS: PriceRatingOption[] = [
  { key: 'auto', label: 'Automatisch', desc: 'Marktdaten-basiert', color: 'var(--color-muted-foreground)', accent: 'var(--color-muted)' },
  { key: 'sehr-gut', label: 'Sehr guter Preis', desc: 'Unter Marktwert', color: 'var(--color-success)', accent: 'color-mix(in srgb, var(--color-success) 10%, transparent)' },
  { key: 'gut', label: 'Guter Preis', desc: 'Leicht unter Markt', color: 'var(--color-success)', accent: 'color-mix(in srgb, var(--color-success) 8%, transparent)' },
  { key: 'fair', label: 'Fairer Preis', desc: 'Marktkonform', color: 'var(--color-warning)', accent: 'color-mix(in srgb, var(--color-warning) 8%, transparent)' },
  { key: 'erhoeht', label: 'Erhöht / Wertstabil', desc: 'Sondermodell / Selten', color: 'var(--color-foreground)', accent: 'var(--color-muted)' },
];

/* ─── History event types ─── */
const EVENT_TYPES = ['Erstzulassung', 'Wartung', 'HU-Prüfung', 'Aktuell', 'Geplant'];

/* ─── Equipment categories ─── */
interface EqCategory {
  key: string;
  label: string;
}

const EQ_CATEGORIES: EqCategory[] = [
  { key: 'assist', label: 'Assistenz' },
  { key: 'info', label: 'Infotainment' },
  { key: 'komfort', label: 'Komfort' },
  { key: 'perf', label: 'Performance' },
];

/* ─── Document names ─── */
const DOC_NAMES = [
  'Fahrzeugbrief (Zulassung Teil II)',
  'Fahrzeugschein (Zulassung Teil I)',
  'Serviceheft / Digitales Scheckheft',
  'Hauptuntersuchung (HU/AU)',
  'Rechnungskopien Wartung',
];

/* ─── Toggle component ─── */
function Toggle({
  on,
  onToggle,
  size = 'md',
}: {
  on: boolean;
  onToggle: () => void;
  size?: 'md' | 'lg';
}) {
  return (
    <button
      type="button"
      className={cn(
        'adm-toggle',
        size === 'md' ? 'adm-toggle-md' : 'adm-toggle-lg',
        on && 'on'
      )}
      onClick={onToggle}
      role="switch"
      aria-checked={on}
    >
      <span className="adm-toggle-knob" />
    </button>
  );
}

/* ─── Main component ─── */
export default function VehicleEditorPage() {
  const { getDuration, getDelay } = useMotionTokens();

  const fadeUp: any = {
    hidden: { opacity: 0, y: 12 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: getDelay(i * 0.05), duration: getDuration(0.4), ease: 'easeOut' as const },
    }),
  };

  const params = useParams();
  const vehicleId = params.id as string;
  const existingVehicle = VEHICLES.find((v) => v.id === vehicleId);

  /* ── Form state ── */
  const [make, setMake] = useState(existingVehicle?.make ?? '');
  const [model, setModel] = useState(existingVehicle?.model ?? '');
  const [variant, setVariant] = useState(existingVehicle?.variant ?? '');
  const [year, setYear] = useState(existingVehicle?.year ?? '');
  const [km, setKm] = useState(existingVehicle?.km?.toString() ?? '');
  const [kw, setKw] = useState(existingVehicle?.kw?.toString() ?? '');
  const [fuel, setFuel] = useState<FuelType>(existingVehicle?.fuel ?? 'Benzin');
  const [gear, setGear] = useState<GearType>(existingVehicle?.gear ?? 'Automatik');
  const [drive, setDrive] = useState<DriveType>(existingVehicle?.drive ?? 'AWD');
  const [price, setPrice] = useState(existingVehicle?.price?.toString() ?? '');

  /* ── Premium ── */
  const [isPremium, setIsPremium] = useState(existingVehicle?.isPremium ?? false);

  /* ── Price rating ── */
  const [priceRatingKey, setPriceRatingKey] = useState<string>(
    existingVehicle?.priceRating?.level ?? 'auto'
  );

  /* ── Equipment ── */
  const [eqSearch, setEqSearch] = useState('');
  const [equipItems, setEquipItems] = useState<Record<string, string[]>>(() => {
    if (existingVehicle) {
      return {
        assist: [...existingVehicle.eqGroups.assist],
        info: [...existingVehicle.eqGroups.info],
        komfort: [...existingVehicle.eqGroups.komfort],
        perf: [...existingVehicle.eqGroups.perf],
      };
    }
    return { assist: [], info: [], komfort: [], perf: [] };
  });

  const addEquipItem = useCallback((category: string, item: string) => {
    setEquipItems((prev) => ({
      ...prev,
      [category]: [...(prev[category] || []), item],
    }));
  }, []);

  const removeEquipItem = useCallback((category: string, idx: number) => {
    setEquipItems((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== idx),
    }));
  }, []);

  /* ── History ── */
  const [historyEvents, setHistoryEvents] = useState<HistoryEvent[]>(() => {
    if (existingVehicle) {
      return existingVehicle.history.map(([date, desc]) => ({
        type: date === 'Aktuell' ? 'Aktuell' : 'Wartung',
        date,
        description: desc,
        km: '',
      }));
    }
    return [{ type: 'Erstzulassung', date: '', description: '', km: '' }];
  });

  const addHistoryEvent = useCallback(() => {
    setHistoryEvents((prev) => [
      ...prev,
      { type: 'Wartung', date: '', description: '', km: '' },
    ]);
  }, []);

  const removeHistoryEvent = useCallback((idx: number) => {
    setHistoryEvents((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const updateHistoryEvent = useCallback(
    (idx: number, field: keyof HistoryEvent, value: string) => {
      setHistoryEvents((prev) =>
        prev.map((ev, i) => (i === idx ? { ...ev, [field]: value } : ev))
      );
    },
    []
  );

  /* ── Trust ── */
  const [trust, setTrust] = useState<TrustState>({
    unfallfrei: existingVehicle?.trust?.unfallfrei ?? true,
    scheckheft: existingVehicle?.trust?.scheckheft ?? true,
    nichtraucher: existingVehicle?.trust?.nichtraucher ?? true,
    sofortVerfuegbar: existingVehicle?.trust?.sofortVerfuegbar ?? true,
    vorbesitzer: existingVehicle?.trust?.owners ?? 1,
    docs: DOC_NAMES.reduce<Record<string, boolean>>((acc, name) => {
      acc[name] = true;
      return acc;
    }, {}),
  });

  /* ── Computed PS ── */
  const ps = useMemo(() => {
    const kwNum = parseInt(kw, 10);
    if (isNaN(kwNum)) return 0;
    return Math.round(kwNum * 1.35962);
  }, [kw]);

  /* ── Computed price for display ── */
  const priceNum = useMemo(() => {
    const n = parseInt(price, 10);
    return isNaN(n) ? 0 : n;
  }, [price]);

  const kmNum = useMemo(() => {
    const n = parseInt(km, 10);
    return isNaN(n) ? 0 : n;
  }, [km]);

  return (
    <div className="flex flex-col gap-7 pb-28">
      {/* ═══ 1. Grunddaten ═══ */}
      <motion.div
        className="adm-card"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0}
      >
        <div className="adm-card-head">
          <div className="flex items-start gap-4">
            <div className="adm-card-icon">
              <Car size={18} />
            </div>
            <h3 className="text-base font-semibold font-display">
              Grunddaten
            </h3>
          </div>
        </div>
        <div className="adm-card-body">
          <div className="grid gap-5 grid-cols-2">
            {/* Make */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                Marke
              </label>
              <select
                className="select-field"
                value={make}
                onChange={(e) => setMake(e.target.value)}
              >
                <option value="">Marke wählen</option>
                {BRANDS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Model */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                Modell
              </label>
              <input
                className="input"
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="z. B. RS6 Avant"
              />
            </div>

            {/* Variant */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                Variante
              </label>
              <input
                className="input"
                type="text"
                value={variant}
                onChange={(e) => setVariant(e.target.value)}
                placeholder="z. B. performance · Carbon Black"
              />
            </div>

            {/* Year */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                Erstzulassung
              </label>
              <input
                className={cn("input", "font-mono tabular-nums")}
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="MM/YYYY"
              />
            </div>

            {/* KM */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                Kilometerstand
              </label>
              <input
                className={cn("input", "font-mono tabular-nums")}
                type="number"
                value={km}
                onChange={(e) => setKm(e.target.value)}
                placeholder="z. B. 8400"
              />
            </div>

            {/* kW + PS */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                Leistung (kW)
              </label>
              <div className="relative">
                <input
                  className={cn("input", "font-mono tabular-nums")}
                  type="number"
                  value={kw}
                  onChange={(e) => setKw(e.target.value)}
                  placeholder="z. B. 463"
                />
                {ps > 0 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono tabular-nums text-xs text-neutral-500">
                    ≈ {formatNumber(ps)} PS
                  </span>
                )}
              </div>
            </div>

            {/* Fuel */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                Kraftstoff
              </label>
              <select
                className="select-field"
                value={fuel}
                onChange={(e) => setFuel(e.target.value as FuelType)}
              >
                {FUEL_OPTIONS.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* Gear */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                Getriebe
              </label>
              <select
                className="select-field"
                value={gear}
                onChange={(e) => setGear(e.target.value as GearType)}
              >
                {GEAR_OPTIONS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Drive */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                Antrieb
              </label>
              <select
                className="select-field"
                value={drive}
                onChange={(e) => setDrive(e.target.value as DriveType)}
              >
                {DRIVE_OPTIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                Preis (€)
              </label>
              <input
                className={cn("input", "font-mono tabular-nums")}
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="z. B. 142500"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══ 2. Premium Toggle ═══ */}
      <motion.div
        className={cn('prem-card', isPremium && 'prem-on')}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={1}
      >
        <div className="prem-glow" />
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="prem-icon">
                <Crown size={22} />
              </div>
              <div>
                <h3 className="text-base font-semibold mb-1 font-display">
                  Top-Inserat / Premium
                </h3>
                <p className="text-sm text-neutral-500">
                  Maximale Sichtbarkeit für dieses Fahrzeug
                </p>
              </div>
            </div>
            <Toggle on={isPremium} onToggle={() => setIsPremium(!isPremium)} size="lg" />
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Eye size={15} className="text-[#d4af37]" />
              <span className="text-sm">
                <strong className="font-mono tabular-nums">3.2</strong>x Aufrufe
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={15} className="text-[#d4af37]" />
              <span className="text-sm">
                <strong className="font-mono tabular-nums">47</strong>% höhere Anfragerate
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare size={15} className="text-[#d4af37]" />
              <span className="text-sm">
                Prioritäts-Platzierung
              </span>
            </div>
          </div>

          {/* Mini preview */}
          {isPremium && (
            <div className="flex items-center gap-4 rounded-lg border border-yellow-500/30 p-4 shadow-[0_0_0_1px_rgba(234,179,8,0.3),_0_4px_12px_rgba(234,179,8,0.1)]">
              <div
                className={cn("veh-img", "alt-3", "w-20 h-12 rounded-lg shrink-0")}
              >
                <div className="veh-img-shape" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={cn("badge-top-listing", "text-[10px]")}>
                    <Crown size={10} />
                    TOP
                  </span>
                  <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                    {make || 'Marke'} {model || 'Modell'}
                  </span>
                </div>
                <span className="font-mono tabular-nums text-sm font-semibold text-black">
                  {priceNum > 0 ? formatPrice(priceNum) : '– €'}
                </span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* ═══ 3. Preisbewertung ═══ */}
      <motion.div
        className="adm-card"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={2}
      >
        <div className="adm-card-head">
          <h3 className="text-base font-semibold font-display">
            Preisbewertung
          </h3>
        </div>
        <div className={cn("adm-card-body", "flex flex-col gap-3")}>
          {PRICE_RATING_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              className={cn("flex items-center gap-4 rounded-lg border p-4 text-left transition-all duration-200 ease-in-out cursor-pointer outline-none")}
              data-active={priceRatingKey === opt.key}
              style={{
                ['--opt-bg' as string]: opt.accent,
                ['--opt-color' as string]: opt.color,
                ['--opt-border-color' as string]: priceRatingKey === opt.key ? opt.color : 'var(--color-border-strong)',
                ['--opt-fill' as string]: priceRatingKey === opt.key ? opt.color : 'transparent',
                ['--opt-text-color' as string]: priceRatingKey === opt.key ? opt.color : 'var(--color-foreground)',
                background: priceRatingKey === opt.key ? opt.accent : 'transparent',
                borderColor: priceRatingKey === opt.key ? opt.color : 'var(--color-border-strong)',
              }}
              onClick={() => setPriceRatingKey(opt.key)}
            >
              <div
                className="flex items-center justify-center shrink-0 w-5 h-5 rounded-full border-2"
                style={{ borderColor: priceRatingKey === opt.key ? opt.color : 'var(--color-border-strong)', background: priceRatingKey === opt.key ? opt.color : 'transparent' }}
              >
                {priceRatingKey === opt.key && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className="text-sm font-medium"
                  style={{ color: priceRatingKey === opt.key ? opt.color : 'var(--color-foreground)' }}
                >
                  {opt.label}
                </div>
                <div className="text-xs text-neutral-500">
                  {opt.desc}
                </div>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* ═══ 4. Medien ═══ */}
      <motion.div
        className="adm-card"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={3}
      >
        <div className="adm-card-head">
          <h3 className="text-base font-semibold font-display">
            Medien
          </h3>
        </div>
        <div className="adm-card-body">
          <div className="grid gap-5 grid-cols-2">
            {/* Standard Gallery */}
            <MediaZone
              icon={<Images size={22} />}
              title="Standard-Galerie"
              description="JPG, PNG, WebP · max. 10 MB pro Bild"
            />
            {/* 360 Outside */}
            <MediaZone
              icon={<RotateCw size={22} />}
              title="360°-Außen"
              description="36 oder 72 Einzelbilder für 360°-Ansicht"
            />
            {/* 360 Interior */}
            <MediaZone
              icon={<RotateCw size={22} />}
              title="360°-Innenraum"
              description="Panorama oder Einzelbilder"
            />
            {/* Video */}
            <MediaZone
              icon={<Video size={22} />}
              title="Video-Walkthrough"
              description="MP4, MOV · max. 200 MB"
            />
          </div>
        </div>
      </motion.div>

      {/* ═══ 5. Ausstattung ═══ */}
      <motion.div
        className="adm-card"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={4}
      >
        <div className="adm-card-head">
          <h3 className="text-base font-semibold font-display">
            Ausstattung
          </h3>
        </div>
        <div className={cn("adm-card-body", "flex flex-col gap-6")}>
          {/* Search + add */}
          <div className={cn("adm-search", "w-full max-w-full")}>
            <Search size={16} className="text-neutral-500 shrink-0" />
            <input
              type="text"
              placeholder="Ausstattung hinzufügen…"
              value={eqSearch}
              onChange={(e) => setEqSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && eqSearch.trim()) {
                  addEquipItem('komfort', eqSearch.trim());
                  setEqSearch('');
                }
              }}
            />
          </div>

          {/* Category groups */}
          {EQ_CATEGORIES.map((cat) => {
            const items = equipItems[cat.key] || [];
            if (items.length === 0) return null;
            return (
              <div key={cat.key}>
                <div className="text-xs font-semibold uppercase tracking-widest mb-3 text-neutral-500">
                  {cat.label}
                </div>
                <div className="flex flex-wrap gap-2">
                  {items.map((item, idx) => (
                    <span
                      key={`${cat.key}-${idx}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium bg-neutral-50 text-black"
                    >
                      {item}
                      <button
                        type="button"
                        className="flex items-center justify-center w-4 h-4 rounded-full bg-transparent border-none cursor-pointer text-neutral-500"
                        onClick={() => removeEquipItem(cat.key, idx)}
                        aria-label={`${item} entfernen`}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ═══ 6. Historie ═══ */}
      <motion.div
        className="adm-card"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={5}
      >
        <div className="adm-card-head">
          <h3 className="text-base font-semibold font-display">
            Historie
          </h3>
        </div>
        <div className={cn("adm-card-body", "flex flex-col gap-4")}>
          {historyEvents.map((ev, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 rounded-lg border border-neutral-200 p-4"
            >
              {/* Type select */}
              <select
                className={cn("select-field", "w-48 shrink-0")}
                value={ev.type}
                onChange={(e) => updateHistoryEvent(idx, 'type', e.target.value)}
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              {/* Date */}
              <input
                type="text"
                className={cn("input-field", "font-mono text-sm w-32 shrink-0")}
                placeholder="MM/YYYY"
                value={ev.date}
                onChange={(e) => updateHistoryEvent(idx, 'date', e.target.value)}
              />

              {/* Description */}
              <input
                className={cn("input", "flex-1 min-w-0")}
                type="text"
                placeholder="Beschreibung"
                value={ev.description}
                onChange={(e) => updateHistoryEvent(idx, 'description', e.target.value)}
              />

              {/* KM */}
              <input
                type="text"
                className={cn("input-field", "font-mono text-sm w-24 shrink-0")}
                placeholder="km"
                value={ev.km}
                onChange={(e) => updateHistoryEvent(idx, 'km', e.target.value)}
              />

              {/* Remove */}
              <button
                type="button"
                className={cn("btn btn-outline btn-icon-sm", "shrink-0 mt-1")}
                onClick={() => removeHistoryEvent(idx)}
                aria-label="Eintrag entfernen"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          <button
            type="button"
            className={cn("btn btn-ghost btn-sm", "self-start")}
            onClick={addHistoryEvent}
          >
            <Plus size={14} />
            Eintrag hinzufügen
          </button>
        </div>
      </motion.div>

      {/* ═══ 7. Trust-Signale ═══ */}
      <motion.div
        className="adm-card"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={6}
      >
        <div className="adm-card-head">
          <div className="flex items-start gap-4">
            <div className="adm-card-icon">
              <ShieldCheck size={18} />
            </div>
            <h3 className="text-base font-semibold font-display">
              Trust-Signale
            </h3>
          </div>
        </div>
        <div className={cn("adm-card-body", "flex flex-col gap-6")}>
          {/* Toggles */}
          <div className="grid gap-4 grid-cols-2">
            {(
              [
                { key: 'unfallfrei', label: 'Unfallfrei' },
                { key: 'scheckheft', label: 'Scheckheftgepflegt' },
                { key: 'nichtraucher', label: 'Nichtraucherfahrzeug' },
                { key: 'sofortVerfuegbar', label: 'Sofort verfügbar' },
              ] as const
            ).map(({ key, label }) => (
              <div
                key={key}
                className="flex items-center justify-between rounded-lg border border-neutral-200 p-4"
              >
                <span className="text-sm font-medium">{label}</span>
                <Toggle
                  on={trust[key]}
                  onToggle={() =>
                    setTrust((prev) => ({ ...prev, [key]: !prev[key] }))
                  }
                />
              </div>
            ))}
          </div>

          {/* Vorbesitzer counter */}
          <div className="flex items-center justify-between rounded-lg border border-neutral-200 p-4">
            <span className="text-sm font-medium">Vorbesitzer</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="btn btn-outline btn-icon-sm"
                onClick={() =>
                  setTrust((prev) => ({
                    ...prev,
                    vorbesitzer: Math.max(1, prev.vorbesitzer - 1),
                  }))
                }
                aria-label="Vorbesitzer verringern"
              >
                <Minus size={14} />
              </button>
              <span className="font-mono tabular-nums text-base font-semibold min-w-[2rem] text-center">
                {trust.vorbesitzer}
              </span>
              <button
                type="button"
                className="btn btn-outline btn-icon-sm"
                onClick={() =>
                  setTrust((prev) => ({
                    ...prev,
                    vorbesitzer: prev.vorbesitzer + 1,
                  }))
                }
                aria-label="Vorbesitzer erhöhen"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Verified documents */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest mb-3 text-neutral-500">
              Verifizierte Dokumente
            </div>
            <div className="flex flex-col gap-2">
              {DOC_NAMES.map((doc) => (
                <label
                  key={doc}
                  className="flex items-center gap-3 rounded-lg border border-neutral-200 p-3 cursor-pointer transition-colors duration-200 ease-in-out"
                >
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={trust.docs[doc] ?? false}
                    onChange={() =>
                      setTrust((prev) => ({
                        ...prev,
                        docs: { ...prev.docs, [doc]: !prev.docs[doc] },
                      }))
                    }
                  />
                  <FileCheck size={15} className="text-neutral-500" />
                  <span className="text-sm">{doc}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══ 8. Vorschau ═══ */}
      <motion.div
        className="adm-card"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={7}
      >
        <div className="adm-card-head">
          <div className="flex items-start gap-4">
            <div className="adm-card-icon">
              <Eye size={18} />
            </div>
            <h3 className="text-base font-semibold font-display">
              Vorschau
            </h3>
          </div>
        </div>
        <div className="adm-card-body">
          <div
            className={cn(
              'card',
              "max-w-xs overflow-hidden",
              isPremium && 'card-top-listing'
            )}
          >
            {/* Image */}
            <div className={cn("veh-img", "alt-3", "rounded-t-xl")}>
              <div className="veh-img-shape" />
              <div className="veh-img-grid" />
              {isPremium && (
                <div className="absolute left-3 top-3">
                  <span className={cn("badge-top-listing", "text-[10px]")}>
                    <Crown size={10} />
                    TOP-INSERAT
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-3 p-5">
              <div>
                <h4 className="text-base font-semibold font-display">
                  {make || 'Marke'} {model || 'Modell'}
                </h4>
                <p className="text-sm text-neutral-500">
                  {variant || 'Variante'}
                </p>
              </div>

              {/* Specs row */}
              <div className="flex items-center gap-4 flex-wrap text-xs text-neutral-500">
                {year && (
                  <span className="font-mono tabular-nums">{year}</span>
                )}
                {kmNum > 0 && (
                  <span className="font-mono tabular-nums">{formatKm(kmNum)}</span>
                )}
                {ps > 0 && (
                  <span className="font-mono tabular-nums">{formatNumber(parseInt(kw, 10))} kW ({formatNumber(ps)} PS)</span>
                )}
                {fuel && <span>{fuel}</span>}
              </div>

              {/* Price */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
                <span className="font-mono tabular-nums text-sm font-bold">
                  {priceNum > 0 ? formatPrice(priceNum) : '– €'}
                </span>
                {isPremium && (
                  <Crown size={16} className="text-[#d4af37]" />
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══ Action Bar ═══ */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-md border-t border-neutral-200 py-4 px-7 md:left-64"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: getDelay(0.5), duration: getDuration(0.35), ease: 'easeOut' as const }}
      >
        <div className="flex items-center justify-end gap-3 max-w-[1280px] mx-auto">
          <button type="button" className="btn btn-ghost">
            Entwurf speichern
          </button>
          <button type="button" className="btn btn-outline">
            <Eye size={16} />
            Vorschau
          </button>
          <button type="button" className="btn btn-primary">
            <Check size={16} />
            Fahrzeug live schalten
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── MediaZone sub-component ─── */
function MediaZone({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center shrink-0 w-10 h-10 rounded-lg bg-black/5 text-black">
          {icon}
        </div>
        <div>
          <div className={cn("text-sm", "font-medium")}>{title}</div>
          <div className="text-sm text-neutral-500">
            {description}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-200 p-8 text-center cursor-pointer transition-all duration-200 text-neutral-500 hover:border-black hover:bg-black/5">
        <Plus size={24} />
        <span className={cn("text-sm", "font-medium")}>
          Dateien hierher ziehen oder klicken
        </span>
      </div>
    </div>
  );
}
