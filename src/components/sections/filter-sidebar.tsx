'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
import { formatPrice, formatKm } from '@/lib/format';
import { cn } from '@/lib/cn';

interface FilterValues {
  brands: string[];
  vehicleTypes: string[];
  priceMin: number;
  priceMax: number;
  kmMax: number;
  fuels: string[];
  gears: string[];
  powerMin: number;
  powerMax: number;
  colors: string[];
}

interface FilterSidebarProps {
  filters: FilterValues;
  onChange: (filters: FilterValues) => void;
  totalResults?: number;
  className?: string;
}

const VEHICLE_TYPES = ['Limousine', 'Kombi', 'SUV', 'Coupé', 'Cabrio', 'Sportwagen'];
const FUEL_OPTIONS = ['Benzin', 'Diesel', 'Hybrid', 'Elektro'];
const GEAR_OPTIONS = ['Automatik', 'Schaltgetriebe'];
const COLOR_OPTIONS = [
  { label: 'Schwarz', value: 'black', hex: '#111827' },
  { label: 'Weiß', value: 'white', hex: '#F9FAFB' },
  { label: 'Grau', value: 'gray', hex: '#6B7280' },
  { label: 'Silber', value: 'silver', hex: '#D1D5DB' },
  { label: 'Blau', value: 'blue', hex: '#3B82F6' },
  { label: 'Rot', value: 'red', hex: '#EF4444' },
  { label: 'Grün', value: 'green', hex: '#10B981' },
  { label: 'Gelb', value: 'yellow', hex: '#F59E0B' },
];

function FilterGroup({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-neutral-100 last:border-0">
      <button
        type="button"
        className="flex w-full items-center justify-between py-4 text-left outline-none group"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="text-[13px] font-bold uppercase tracking-wider text-neutral-900 group-hover:text-red-600 transition-colors">{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-neutral-400 group-hover:text-red-600 transition-colors"
        >
          <ChevronDown size={16} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-5 pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FilterSidebar({
  filters,
  onChange,
  className,
}: FilterSidebarProps) {
  const update = <K extends keyof FilterValues>(key: K, value: FilterValues[K]) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleArrayItem = (key: keyof Pick<FilterValues, 'vehicleTypes' | 'fuels' | 'gears' | 'colors'>, item: string) => {
    const current = filters[key];
    const updated = current.includes(item)
      ? current.filter((i) => i !== item)
      : [...current, item];
    update(key, updated);
  };

  const isMobileDrawer = className?.includes('sticky-none');

  return (
    <aside className={cn(
      "flex flex-col bg-white rounded-2xl border border-neutral-200/60 shadow-sm overflow-hidden",
      !isMobileDrawer && "sticky top-28",
      className
    )}>
      <div className="p-5 bg-neutral-50/50 border-b border-neutral-200/60 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-neutral-900 tracking-tight">Filter</h3>
      </div>
      
      <div className="flex flex-col px-5 py-2">
        {/* Fahrzeugtyp */}
        <FilterGroup title="Fahrzeugtyp" defaultOpen={false}>
          <div className="flex flex-wrap gap-2">
            {VEHICLE_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => toggleArrayItem('vehicleTypes', type)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border",
                  filters.vehicleTypes.includes(type)
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </FilterGroup>

        {/* Preis */}
        <FilterGroup title="Preis">
          <div className="flex items-center justify-between mb-3 text-xs font-mono font-semibold text-neutral-700 bg-neutral-50 px-3 py-2 rounded-lg border border-neutral-100">
            <span>{formatPrice(filters.priceMin)}</span>
            <span className="text-neutral-400">-</span>
            <span>{formatPrice(filters.priceMax)}</span>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-2 block">Minimum</label>
              <input
                type="range"
                min={0}
                max={500000}
                step={5000}
                value={filters.priceMin}
                onChange={(e) => update('priceMin', Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-2 block">Maximum</label>
              <input
                type="range"
                min={0}
                max={500000}
                step={5000}
                value={filters.priceMax}
                onChange={(e) => update('priceMax', Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
            </div>
          </div>
        </FilterGroup>

        {/* Kilometerstand */}
        <FilterGroup title="Kilometerstand" defaultOpen={false}>
          <div className="flex items-center justify-between mb-4 text-xs font-mono font-semibold text-neutral-700 bg-neutral-50 px-3 py-2 rounded-lg border border-neutral-100">
            <span>0 km</span>
            <span className="text-neutral-400">-</span>
            <span>{formatKm(filters.kmMax)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={200000}
            step={5000}
            value={filters.kmMax}
            onChange={(e) => update('kmMax', Number(e.target.value))}
            className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-red-600"
          />
        </FilterGroup>

        {/* Treibstoff */}
        <FilterGroup title="Treibstoff">
          <div className="flex flex-wrap gap-2">
            {FUEL_OPTIONS.map((fuel) => (
              <button
                key={fuel}
                type="button"
                onClick={() => toggleArrayItem('fuels', fuel)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border",
                  filters.fuels.includes(fuel)
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                )}
              >
                {fuel}
              </button>
            ))}
          </div>
        </FilterGroup>

        {/* Getriebe */}
        <FilterGroup title="Getriebe" defaultOpen={false}>
          <div className="flex flex-wrap gap-2">
            {GEAR_OPTIONS.map((gear) => (
              <button
                key={gear}
                type="button"
                onClick={() => toggleArrayItem('gears', gear)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border",
                  filters.gears.includes(gear)
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                )}
              >
                {gear}
              </button>
            ))}
          </div>
        </FilterGroup>

        {/* Leistung */}
        <FilterGroup title="Leistung" defaultOpen={false}>
          <div className="flex items-center justify-between mb-3 text-xs font-mono font-semibold text-neutral-700 bg-neutral-50 px-3 py-2 rounded-lg border border-neutral-100">
            <span>{filters.powerMin} PS</span>
            <span className="text-neutral-400">-</span>
            <span>{filters.powerMax} PS</span>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-2 block">Minimum</label>
              <input
                type="range"
                min={0}
                max={1200}
                step={10}
                value={filters.powerMin}
                onChange={(e) => update('powerMin', Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-2 block">Maximum</label>
              <input
                type="range"
                min={0}
                max={1200}
                step={10}
                value={filters.powerMax}
                onChange={(e) => update('powerMax', Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
            </div>
          </div>
        </FilterGroup>

        {/* Farbe */}
        <FilterGroup title="Farbe" defaultOpen={false}>
          <div className="grid grid-cols-4 gap-3">
            {COLOR_OPTIONS.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => toggleArrayItem('colors', color.value)}
                className="flex flex-col items-center gap-1.5 outline-none group"
                aria-label={color.label}
              >
                <span
                  className={cn(
                    "block w-6 h-6 rounded-full shadow-inner ring-2 ring-offset-2 transition-all",
                    filters.colors.includes(color.value)
                      ? "ring-neutral-900 scale-110"
                      : "ring-transparent group-hover:ring-neutral-200"
                  )}
                  style={{ backgroundColor: color.hex, border: color.value === 'white' ? '1px solid #e5e7eb' : 'none' }}
                />
                <span className="text-[10px] font-medium text-neutral-500 group-hover:text-neutral-900">
                  {color.label}
                </span>
              </button>
            ))}
          </div>
        </FilterGroup>
      </div>
    </aside>
  );
}

/* ===== Mobile Filter Drawer ===== */

interface MobileFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: FilterValues;
  onChange: (filters: FilterValues) => void;
  totalResults: number;
}

export function MobileFilterDrawer({
  open,
  onClose,
  filters,
  onChange,
  totalResults,
}: MobileFilterDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-neutral-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[110] bg-white shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 pt-[max(1rem,env(safe-area-inset-top))] border-b border-neutral-200/60 bg-neutral-50/50">
              <span className="font-display text-xl font-bold tracking-tight text-neutral-900">Filter</span>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-neutral-200 text-neutral-500 hover:bg-neutral-50 transition-colors"
                aria-label="Filter schließen"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-2">
              <FilterSidebar
                filters={filters}
                onChange={onChange}
                totalResults={totalResults}
                className="sticky-none border-0 shadow-none"
              />
            </div>
            
            <div className="p-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-neutral-200/60 bg-white">
              <button
                type="button"
                onClick={onClose}
                className="w-full flex items-center justify-center rounded-xl bg-red-600 px-6 py-4 text-[15px] font-semibold text-white transition-all hover:bg-red-700 active:scale-95 shadow-sm"
              >
                <span className="font-mono mr-2 opacity-80">{totalResults}</span> Fahrzeuge anzeigen
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export type { FilterValues };
