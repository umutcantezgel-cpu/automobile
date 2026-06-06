'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid,
  List,
  Map,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Home,
  ChevronRight as ChevronBreadcrumb,
  Car,
} from 'lucide-react';
import Link from 'next/link';
import { VEHICLES } from '@/lib/mock/vehicles';
import { VehicleCard } from '@/components/sections/vehicle-card';
import { FilterSidebar, MobileFilterDrawer } from '@/components/sections/filter-sidebar';
import { MapView } from '@/components/sections/map-view';
import type { FilterValues } from '@/components/sections/filter-sidebar';
import type { Vehicle } from '@/types/inventory';
import { cn } from '@/lib/cn';

type ViewMode = 'grid' | 'list' | 'map';
type SortKey = 'price-asc' | 'price-desc' | 'km-asc' | 'km-desc' | 'year-desc' | 'hp-desc';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'price-asc', label: 'Preis aufsteigend' },
  { key: 'price-desc', label: 'Preis absteigend' },
  { key: 'km-asc', label: 'Kilometerstand aufsteigend' },
  { key: 'km-desc', label: 'Kilometerstand absteigend' },
  { key: 'year-desc', label: 'Neueste zuerst' },
  { key: 'hp-desc', label: 'Leistung absteigend' },
];

const ITEMS_PER_PAGE = 6;

const DEFAULT_FILTERS: FilterValues = {
  brands: [],
  vehicleTypes: [],
  priceMin: 0,
  priceMax: 500000,
  kmMax: 200000,
  fuels: [],
  gears: [],
  powerMin: 0,
  powerMax: 1200,
  colors: [],
};

function sortVehicles(vehicles: Vehicle[], sortKey: SortKey): Vehicle[] {
  const sorted = [...vehicles];
  switch (sortKey) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'km-asc':
      sorted.sort((a, b) => a.km - b.km);
      break;
    case 'km-desc':
      sorted.sort((a, b) => b.km - a.km);
      break;
    case 'year-desc':
      sorted.sort((a, b) => {
        const [aM, aY] = a.year.split('/').map(Number);
        const [bM, bY] = b.year.split('/').map(Number);
        return bY - aY || bM - aM;
      });
      break;
    case 'hp-desc':
      sorted.sort((a, b) => b.hp - a.hp);
      break;
  }
  return sorted;
}

function filterVehicles(vehicles: Vehicle[], filters: FilterValues): Vehicle[] {
  return vehicles.filter((v) => {
    if (filters.brands.length > 0 && !filters.brands.includes(v.make)) return false;
    if (v.price < filters.priceMin || v.price > filters.priceMax) return false;
    if (v.km > filters.kmMax) return false;
    if (filters.fuels.length > 0 && !filters.fuels.includes(v.fuel)) return false;
    if (filters.gears.length > 0 && !filters.gears.includes(v.gear)) return false;
    if (v.hp < filters.powerMin || v.hp > filters.powerMax) return false;
    return true;
  });
}

export default function FahrzeugePage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortKey, setSortKey] = useState<SortKey>('price-asc');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterValues>(DEFAULT_FILTERS);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const filteredVehicles = useMemo(
    () => filterVehicles(VEHICLES, filters),
    [filters]
  );

  const sortedVehicles = useMemo(
    () => sortVehicles(filteredVehicles, sortKey),
    [filteredVehicles, sortKey]
  );

  const totalPages = Math.max(1, Math.ceil(sortedVehicles.length / ITEMS_PER_PAGE));
  const paginatedVehicles = useMemo(
    () => sortedVehicles.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
    [sortedVehicles, page]
  );

  const handleFilterChange = useCallback((newFilters: FilterValues) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((key: SortKey) => {
    setSortKey(key);
    setSortOpen(false);
    setPage(1);
  }, []);

  return (
    <main className="min-h-screen bg-neutral-50 pb-20">
      {/* Hero Header */}
      <section className="relative pt-32 pb-20 bg-neutral-900 border-b border-neutral-800">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/images/hero-fahrzeuge.png')] bg-cover bg-center opacity-20 mix-blend-luminosity grayscale" />
          <div className="absolute inset-0 bg-neutral-900/10 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent" />
        </div>
        <div className="relative max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col justify-end min-h-[240px]">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-[13px] font-medium text-neutral-400">
              <li>
                <Link href="/" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <Home size={14} /> Startseite
                </Link>
              </li>
              <li><ChevronBreadcrumb size={12} className="opacity-50" /></li>
              <li className="flex items-center gap-1.5 text-white">
                <Car size={14} /> Fahrzeuge
              </li>
            </ol>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-red-500 mb-4 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-red-600" /> Unser Bestand
              </p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
                Fahrzeuge
              </h1>
              <p className="text-neutral-400 text-lg leading-relaxed">
                Entdecken Sie handverlesene Premium-Fahrzeuge — jedes einzelne geprüft, garantiert und sofort verfügbar.
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end">
              <div className="text-5xl font-mono font-bold text-white tracking-tighter mb-1">
                {sortedVehicles.length}
              </div>
              <div className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
                Fahrzeuge gefunden
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <section className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-neutral-200/60 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
          
          {/* Left Controls */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm active:scale-95 transition-transform"
            >
              <SlidersHorizontal size={16} /> Filter
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setSortOpen((o) => !o)}
                className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm active:scale-95 transition-all hover:bg-neutral-50 hover:border-neutral-300"
              >
                <ArrowUpDown size={16} className="text-neutral-500" />
                <span className="hidden sm:inline">Sortierung</span>
              </button>
              
              <AnimatePresence>
                {sortOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="fixed inset-0 z-40" onClick={() => setSortOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full mt-2 w-56 z-50 rounded-xl bg-white p-1 shadow-xl ring-1 ring-black/5"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => handleSortChange(opt.key)}
                          className={cn(
                            "w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-left transition-colors",
                            sortKey === opt.key ? "bg-red-50 text-red-600" : "text-neutral-700 hover:bg-neutral-100"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center p-1 rounded-lg bg-neutral-100/80 border border-neutral-200/50">
            {(['grid', 'list', 'map'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={cn(
                  "p-2 rounded-md transition-all text-neutral-500 hover:text-neutral-900",
                  viewMode === mode && "bg-white text-neutral-900 shadow-sm"
                )}
                aria-label={`${mode} view`}
              >
                {mode === 'grid' && <LayoutGrid size={18} />}
                {mode === 'list' && <List size={18} />}
                {mode === 'map' && <Map size={18} />}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-10">
          
          {/* Sidebar */}
          <div className="hidden md:block w-72 flex-shrink-0">
            <div className="sticky top-[140px]">
              <FilterSidebar
                filters={filters}
                onChange={handleFilterChange}
                totalResults={sortedVehicles.length}
              />
            </div>
          </div>

          {/* Results Grid/List */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {viewMode === 'map' ? (
                <motion.div
                  key="map"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col gap-8"
                >
                  <MapView vehicles={sortedVehicles} />
                  <div>
                    <h2 className="font-display text-2xl font-bold text-neutral-900 mb-6">Fahrzeuge in Ihrer Nähe</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {sortedVehicles.map((v, i) => (
                        <VehicleCard key={v.id} vehicle={v} index={i} variant="grid" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : paginatedVehicles.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-32 text-center"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 text-neutral-300 mb-6">
                    <Car size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">Keine Fahrzeuge gefunden</h3>
                  <p className="text-neutral-500 max-w-sm">
                    Passen Sie Ihre Filter an oder entfernen Sie einige Einschränkungen, um passende Fahrzeuge zu finden.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={`${viewMode}-${page}`}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className={cn(
                    "grid gap-6",
                    viewMode === 'grid' ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
                  )}
                >
                  {paginatedVehicles.map((v, i) => (
                    <VehicleCard
                      key={v.id}
                      vehicle={v}
                      index={i}
                      variant={viewMode === 'list' ? 'list' : 'grid'}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {viewMode !== 'map' && totalPages > 1 && (
              <div className="mt-16 flex flex-col items-center gap-6">
                <nav aria-label="Seitennavigation" className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 transition-colors hover:bg-neutral-50 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                        p === page 
                          ? "bg-neutral-900 text-white shadow-sm" 
                          : "text-neutral-600 hover:bg-neutral-100"
                      )}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 transition-colors hover:bg-neutral-50 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <ChevronRight size={18} />
                  </button>
                </nav>

                <p className="text-[13px] text-neutral-500 font-medium">
                  Zeige {((page - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(page * ITEMS_PER_PAGE, sortedVehicles.length)} von {sortedVehicles.length} Fahrzeugen
                </p>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        filters={filters}
        onChange={handleFilterChange}
        totalResults={sortedVehicles.length}
      />
    </main>
  );
}
