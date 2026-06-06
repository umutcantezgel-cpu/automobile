'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Share2,
  GitCompareArrows,
  Phone,
  Mail,
  Calendar,
  ShieldCheck,
  BookOpen,
  Zap,
  Calculator,
  Crown,
  ChevronDown,
} from 'lucide-react';
import { formatPrice } from '@/lib/format';
import { useFavoritesStore } from '@/lib/store/favorites';
import { useCompareStore } from '@/lib/store/compare';
import { PriceRatingBadge } from '@/components/sections/price-rating-badge';
import type { Vehicle } from '@/types/inventory';
import { cn } from '@/lib/cn';

interface BuyingCardProps {
  vehicle: Vehicle;
  className?: string;
}

interface FinancingResult {
  monthly: number;
  totalCost: number;
  interestTotal: number;
}

function calculateFinancing(
  price: number,
  downPaymentPct: number,
  termMonths: number,
  annualRate: number
): FinancingResult {
  const downPayment = price * (downPaymentPct / 100);
  const principal = price - downPayment;
  const monthlyRate = annualRate / 100 / 12;

  if (monthlyRate === 0) {
    const monthly = principal / termMonths;
    return { monthly, totalCost: price, interestTotal: 0 };
  }

  const monthly =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);

  const totalCost = monthly * termMonths + downPayment;
  const interestTotal = totalCost - price;

  return { monthly, totalCost, interestTotal };
}

const TERM_OPTIONS = [24, 36, 48, 60, 72];
const RATE = 3.99;

export function BuyingCard({ vehicle, className }: BuyingCardProps) {
  const [downPct, setDownPct] = useState(20);
  const [termMonths, setTermMonths] = useState(48);
  const [showCalc, setShowCalc] = useState(false);

  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const hasFavorite = useFavoritesStore((s) => s.has(vehicle.id));
  const toggleCompare = useCompareStore((s) => s.toggle);
  const hasCompare = useCompareStore((s) => s.has(vehicle.id));

  const financing = useMemo(
    () => calculateFinancing(vehicle.price, downPct, termMonths, RATE),
    [vehicle.price, downPct, termMonths]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex flex-col rounded-3xl bg-white border border-neutral-200/60 shadow-lg shadow-neutral-200/40 p-6 md:p-8 relative overflow-hidden",
        vehicle.isPremium && "ring-1 ring-neutral-900",
        className
      )}
    >
      {/* Premium Badge */}
      {vehicle.isPremium && (
        <div className="absolute top-0 right-8 bg-neutral-900 text-white text-[10px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-b-lg flex items-center gap-1.5 shadow-sm">
          <Crown size={12} className="text-amber-400" />
          TOP-INSERAT
        </div>
      )}

      {/* Price Section */}
      <div className={cn("flex flex-col", vehicle.isPremium && "pt-4")}>
        {vehicle.oldPrice && (
          <div className="text-sm font-medium text-neutral-400 line-through mb-1">
            {formatPrice(vehicle.oldPrice)}
          </div>
        )}
        <div className="font-display text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight leading-none mb-2">
          {formatPrice(vehicle.price)}
        </div>
        {vehicle.monthly && (
          <p className="text-[15px] font-medium text-neutral-500">
            ab <span className="font-semibold text-neutral-900">{formatPrice(vehicle.monthly)}</span> / mtl.
          </p>
        )}
      </div>

      <div className="mt-4 mb-8">
        <PriceRatingBadge rating={vehicle.priceRating} />
      </div>

      <div className="h-px w-full bg-neutral-100 mb-6" />

      {/* Mini Financing Calculator */}
      <div className="flex flex-col gap-4 mb-6">
        <button
          type="button"
          className="flex items-center justify-between w-full rounded-xl bg-neutral-50 hover:bg-neutral-100 px-4 py-3.5 transition-colors"
          onClick={() => setShowCalc(!showCalc)}
          aria-expanded={showCalc}
        >
          <div className="flex items-center gap-2.5 text-sm font-semibold text-neutral-900">
            <Calculator size={18} className="text-neutral-500" />
            Finanzierung berechnen
          </div>
          <ChevronDown size={18} className={cn("text-neutral-400 transition-transform duration-300", showCalc && "rotate-180")} />
        </button>

        <AnimatePresence>
          {showCalc && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-6 pt-2 pb-4">
                {/* Down Payment Slider */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                      Anzahlung
                    </label>
                    <span className="text-sm font-bold text-neutral-900 font-mono">
                      {formatPrice(vehicle.price * (downPct / 100))} ({downPct}%)
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    step={5}
                    value={downPct}
                    onChange={(e) => setDownPct(Number(e.target.value))}
                    className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                    aria-label="Anzahlung in Prozent"
                  />
                </div>

                {/* Term Selection */}
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-3 block">
                    Laufzeit
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TERM_OPTIONS.map((m) => (
                      <button
                        key={m}
                        type="button"
                        className={cn(
                          "flex-1 px-2 py-2 rounded-lg text-[13px] font-semibold transition-all border",
                          termMonths === m
                            ? "bg-red-50 border-red-200 text-red-600"
                            : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300"
                        )}
                        onClick={() => setTermMonths(m)}
                      >
                        {m} M
                      </button>
                    ))}
                  </div>
                </div>

                {/* Result */}
                <div className="rounded-xl bg-neutral-900 p-5 text-white flex flex-col gap-4">
                  <div className="flex items-end justify-between">
                    <span className="text-sm font-medium text-neutral-400">
                      Monatliche Rate
                    </span>
                    <span className="font-display text-3xl font-bold">
                      {formatPrice(Math.round(financing.monthly))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-neutral-700/50 pt-4 text-xs font-medium text-neutral-400">
                    <span>
                      Zinskosten: <span className="text-white font-mono ml-1">{formatPrice(Math.round(financing.interestTotal))}</span>
                    </span>
                    <span>
                      Eff. Jahreszins: <span className="text-white font-mono ml-1">{RATE}%</span>
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-neutral-400 leading-relaxed text-center">
                  Unverbindliche Beispielrechnung. Bonität vorausgesetzt. Alle Angaben ohne Gewähr.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="h-px w-full bg-neutral-100 mb-6" />

      {/* Primary CTAs */}
      <div className="flex flex-col gap-3 mb-6">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-4 text-[15px] font-semibold text-white transition-all hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/20 active:scale-95"
        >
          <Phone size={18} />
          Jetzt anrufen
        </button>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-neutral-100 px-6 py-4 text-[15px] font-semibold text-neutral-900 transition-all hover:bg-neutral-200 active:scale-95"
        >
          <Mail size={18} />
          Anfrage senden
        </button>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-4 text-[15px] font-semibold text-neutral-600 transition-all hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 active:scale-95"
        >
          <Calendar size={18} />
          Probefahrt vereinbaren
        </button>
      </div>

      <div className="h-px w-full bg-neutral-100 mb-6" />

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => toggleFavorite(vehicle.id)}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[13px] font-semibold transition-all active:scale-95",
            hasFavorite ? "border-red-200 bg-red-50 text-red-600" : "text-neutral-600 hover:bg-neutral-50"
          )}
        >
          <Heart size={16} fill={hasFavorite ? 'currentColor' : 'none'} className={cn(hasFavorite && "text-red-600")} />
          Merken
        </button>

        <button
          type="button"
          onClick={() => toggleCompare(vehicle.id)}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[13px] font-semibold transition-all active:scale-95",
            hasCompare ? "border-blue-200 bg-blue-50 text-blue-600" : "text-neutral-600 hover:bg-neutral-50"
          )}
        >
          <GitCompareArrows size={16} />
          Vergleichen
        </button>

        <button
          type="button"
          className="flex flex-shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white p-3 text-neutral-600 transition-all hover:bg-neutral-50 active:scale-95"
          aria-label="Fahrzeug teilen"
        >
          <Share2 size={16} />
        </button>
      </div>

      <div className="h-px w-full bg-neutral-100 mb-6" />

      {/* Trust Signals */}
      <div className="flex flex-col gap-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
          Vertrauenssignale
        </p>
        <div className="flex flex-col gap-3 text-sm font-medium text-neutral-700">
          {vehicle.trust.unfallfrei && (
            <div className="flex items-center gap-3">
              <ShieldCheck size={16} className="text-green-600" />
              <span>Geprüft & unfallfrei</span>
            </div>
          )}
          {vehicle.trust.scheckheft && (
            <div className="flex items-center gap-3">
              <BookOpen size={16} className="text-green-600" />
              <span>Scheckheftgepflegt</span>
            </div>
          )}
          {vehicle.trust.sofortVerfuegbar && (
            <div className="flex items-center gap-3">
              <Zap size={16} className="text-blue-600" />
              <span>Sofort verfügbar</span>
            </div>
          )}
          {vehicle.trust.garantie && (
            <div className="flex items-center gap-3">
              <ShieldCheck size={16} className="text-blue-600" />
              <span>
                Garantie:{' '}
                <span className="font-bold text-neutral-900">
                  {vehicle.trust.garantie}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
