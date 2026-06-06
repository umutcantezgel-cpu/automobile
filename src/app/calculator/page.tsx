'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useMotionTokens } from '@/lib/motion';
import Link from 'next/link';
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Zap,
  Smartphone,
  Search,
  ShieldCheck,
  Clock,
  Users,
  BarChart3,
  Target,
  ChevronRight,
  Lightbulb,
  Calculator,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/cn';

/* ================================================================== */
/*  TYPES                                                              */
/* ================================================================== */

interface IndustryPreset {
  id: string;
  label: string;
  aov: number;
  traffic: number;
  leads: number;
  conversionRate: number;
}

interface SliderConfig {
  min: number;
  max: number;
  step: number;
  label: string;
  unit: string;
  formatValue?: (v: number) => string;
}

interface LossSegment {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  strokeColor: string;
}

interface QuickWin {
  icon: React.ReactNode;
  title: string;
  description: string;
  impact: string;
  badge: string;
}

/* ================================================================== */
/*  INDUSTRY PRESETS                                                    */
/* ================================================================== */

const INDUSTRY_PRESETS: IndustryPreset[] = [
  { id: 'autohandel-klein', label: 'Autohandel (klein)', aov: 18000, traffic: 1200, leads: 12, conversionRate: 1.0 },
  { id: 'autohandel-mittel', label: 'Autohandel (mittel)', aov: 28000, traffic: 3400, leads: 28, conversionRate: 0.82 },
  { id: 'autohandel-premium', label: 'Autohandel (premium)', aov: 65000, traffic: 2200, leads: 14, conversionRate: 0.64 },
  { id: 'autohandel-gruppe', label: 'Autohandel (Gruppe)', aov: 32000, traffic: 8400, leads: 78, conversionRate: 0.93 },
  { id: 'werkstatt', label: 'Werkstatt', aov: 480, traffic: 4200, leads: 142, conversionRate: 3.4 },
  { id: 'leasing', label: 'Leasing', aov: 24000, traffic: 5600, leads: 38, conversionRate: 0.68 },
];

const LOSS_SEGMENTS: LossSegment[] = [
  { id: 'load', label: 'Ladezeit', icon: <Clock className="w-5 h-5 text-neutral-400" />, color: '#dc2626', strokeColor: '#dc2626' },
  { id: 'mobile', label: 'Mobil', icon: <Smartphone className="w-5 h-5 text-neutral-400" />, color: '#ea580c', strokeColor: '#ea580c' },
  { id: 'seo', label: 'SEO', icon: <Search className="w-5 h-5 text-neutral-400" />, color: '#d97706', strokeColor: '#d97706' },
  { id: 'trust', label: 'Vertrauen', icon: <ShieldCheck className="w-5 h-5 text-neutral-400" />, color: '#2563eb', strokeColor: '#2563eb' },
];

/* Benchmark targets */
const TARGET_CONVERSION = 4.0;
const CLOSE_RATE = 0.2;

/* ================================================================== */
/*  FORMATTING HELPERS                                                 */
/* ================================================================== */

function fmtEur(n: number): string {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(Math.round(n));
}

function fmtNum(n: number): string {
  return new Intl.NumberFormat('de-DE').format(Math.round(n));
}

function fmtPct(n: number, digits = 2): string {
  return n.toFixed(digits).replace('.', ',') + ' %';
}

/* ================================================================== */
/*  RANGE SLIDER COMPONENT                                             */
/* ================================================================== */

function RangeSlider({
  config,
  value,
  onChange,
}: {
  config: SliderConfig;
  value: number;
  onChange: (v: number) => void;
}) {
  const percentage = ((value - config.min) / (config.max - config.min)) * 100;
  const displayValue = config.formatValue ? config.formatValue(value) : `${fmtNum(value)} ${config.unit}`;

  return (
    <div className="flex flex-col gap-2 relative z-0">
      <div className="flex justify-between items-end mb-1">
        <label className="text-sm font-semibold text-neutral-600 uppercase tracking-wider">{config.label}</label>
        <span className="text-lg font-bold text-neutral-900">{displayValue}</span>
      </div>
      <div className="relative h-6 flex items-center isolate">
        <input
          type="range"
          min={config.min}
          max={config.max}
          step={config.step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer z-20 m-0"
        />
        <div className="absolute inset-x-0 h-2 bg-neutral-100 rounded-full overflow-hidden pointer-events-none z-10">
          <div
            className="absolute left-0 top-0 bottom-0 bg-red-600 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {/* Custom thumb to replace the hidden input thumb, but standard input is easier without writing a custom component. The input above uses opacity-0, so we just style the track here. A fully custom range slider requires more code, but standard styling is sufficient. We will use accent-color for simplicity if we don't hide the input. Let's adjust to standard custom styling instead of opacity-0: */}
      </div>
      <div className="absolute inset-x-0 bottom-6 pointer-events-none h-6 flex items-center z-10">
        <style dangerouslySetInnerHTML={{ __html: `
          input[type=range] {
            -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
            width: 100%; /* Specific width is required for Firefox. */
            background: transparent; /* Otherwise white in Chrome */
          }
          input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 24px;
            width: 24px;
            border-radius: 50%;
            background: white;
            border: 2px solid #dc2626;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            position: relative;
            z-index: 30;
          }
          input[type=range]::-moz-range-thumb {
            height: 24px;
            width: 24px;
            border-radius: 50%;
            background: white;
            border: 2px solid #dc2626;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            position: relative;
            z-index: 30;
          }
        `}} />
      </div>
      <div className="flex justify-between items-center mt-1 text-[11px] font-medium text-neutral-400">
        <span>
          {config.formatValue ? config.formatValue(config.min) : `${fmtNum(config.min)}`}
        </span>
        <span>
          {config.formatValue ? config.formatValue(config.max) : `${fmtNum(config.max)}`}
        </span>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  DONUT CHART COMPONENT (SVG)                                        */
/* ================================================================== */

function DonutChart({
  segments,
}: {
  segments: { label: string; value: number; color: string }[];
}) {
  const total = segments.reduce((acc, s) => acc + s.value, 0);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  let cumulativeOffset = 0;

  return (
    <div className="relative w-[200px] h-[200px] flex items-center justify-center shrink-0">
      <svg width="200" height="200" viewBox="0 0 200 200" className="-rotate-90">
        {/* Background circle */}
        <circle cx="100" cy="100" r={radius} fill="none" stroke="#f5f5f5" strokeWidth="24" />
        {/* Segments */}
        {segments.map((seg) => {
          const segLength = total > 0 ? (seg.value / total) * circumference : 0;
          const offset = cumulativeOffset;
          cumulativeOffset += segLength;
          return (
            <circle
              key={seg.label}
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth="24"
              strokeDasharray={`${segLength} ${circumference - segLength}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-display font-bold text-neutral-900">
          {total > 0 ? fmtPct(Math.min(total, 100), 0).replace(',00', '') : '0 %'}
        </span>
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Gesamtverlust</span>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  BAR CHART COMPONENT                                                */
/* ================================================================== */

function BarComparison({

  label1,
  value1,
  label2,
  value2,
  unit,
}: {
  label1: string;
  value1: number;
  label2: string;
  value2: number;
  unit?: string;
}) {
  const { getDuration, getDelay } = useMotionTokens();
  const maxVal = Math.max(value1, value2, 1);

  return (
    <div className="flex flex-col gap-5 mt-6">
      {/* Current */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-end mb-1">
          <span className="text-sm font-semibold text-neutral-500">{label1}</span>
          <span className="text-lg font-bold text-neutral-900">{unit === '€' ? fmtEur(value1) : fmtNum(value1)}</span>
        </div>
        <div className="h-8 bg-neutral-100 rounded-r-lg rounded-l-sm overflow-hidden flex w-full relative">
          <motion.div
            className="h-full bg-neutral-300 rounded-r-lg"
            initial={{ width: 0 }}
            animate={{ width: `${(value1 / maxVal) * 100}%` }}
            transition={{ duration: getDuration(0.8), ease: "easeOut" as const }}
          />
        </div>
      </div>
      {/* Possible */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-end mb-1">
          <span className="text-sm font-semibold text-neutral-900">{label2}</span>
          <span className="text-2xl font-bold text-green-600">{unit === '€' ? fmtEur(value2) : fmtNum(value2)}</span>
        </div>
        <div className="h-8 bg-neutral-100 rounded-r-lg rounded-l-sm overflow-hidden flex w-full relative">
          <motion.div
            className="h-full bg-green-500 rounded-r-lg relative overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: `${(value2 / maxVal) * 100}%` }}
            transition={{ duration: getDuration(0.8), ease: "easeOut" as const, delay: getDelay(0.15) }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem]" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  5-YEAR PROJECTION CHART                                            */
/* ================================================================== */

function ProjectionChart({ yearlyDiff }: { yearlyDiff: number }) {
  const { getDuration, getDelay } = useMotionTokens();
  const years = [1, 2, 3, 4, 5];
  const values = years.map((y) => yearlyDiff * y);
  const maxVal = Math.max(...values, 1);

  return (
    <div className="flex items-end justify-between h-[240px] pt-12 pb-8 mt-6 border-b border-neutral-100">
      {years.map((y, i) => (
        <div key={y} className="flex flex-col items-center flex-1 h-full relative group">
          <span className="absolute -top-8 text-sm font-bold text-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity">
            {values[i] >= 1000000
              ? `${(values[i] / 1000000).toFixed(1).replace('.', ',')} M€`
              : values[i] >= 1000
              ? `${Math.round(values[i] / 1000)}k€`
              : fmtEur(values[i])}
          </span>
          <motion.div
            className="w-12 sm:w-16 md:w-20 bg-red-600 rounded-t-lg relative overflow-hidden group-hover:bg-red-500 transition-colors cursor-crosshair mt-auto"
            initial={{ height: 0 }}
            animate={{ height: `${(values[i] / maxVal) * 100}%` }}
            transition={{ duration: getDuration(0.6), delay: getDelay(i * 0.1), ease: "easeOut" as const }}
            style={{ maxHeight: '100%' }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem]" />
          </motion.div>
          <span className="absolute -bottom-8 text-sm font-semibold text-neutral-500">
            J{y}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ================================================================== */
/*  SECTION HEADER                                                     */
/* ================================================================== */

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-100 text-neutral-500 text-xs font-bold font-mono">
        {number}
      </span>
      <h3 className="font-display text-xl font-bold text-neutral-900 m-0">{title}</h3>
    </div>
  );
}

/* ================================================================== */
/*  MAIN PAGE COMPONENT                                                */
/* ================================================================== */

export default function CalculatorPage() {
  const { getDuration, getDelay } = useMotionTokens();
  const [revenue, setRevenue] = useState(5000000);
  /* ── Inputs ──────────────────────────────────────────────────────── */
  const [presetId, setPresetId] = useState<string>('autohandel-mittel');
  const [aov, setAov] = useState<number>(28000);
  const [visitors, setVisitors] = useState<number>(3400);
  const [inquiries, setInquiries] = useState<number>(28);
  const [loadTime, setLoadTime] = useState<number>(4.2);
  const [mobileScore, setMobileScore] = useState<number>(45);
  const [googlePosition, setGooglePosition] = useState<number>(14);
  const [trustSignals, setTrustSignals] = useState<number>(2);

  /* ── Apply preset ────────────────────────────────────────────────── */
  const applyPreset = useCallback((id: string) => {
    const preset = INDUSTRY_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setPresetId(id);
    setAov(preset.aov);
    setVisitors(preset.traffic);
    setInquiries(preset.leads);
  }, []);

  /* ── Derived current conversion ─────────────────────────────────── */
  const currentConversion = useMemo(() => {
    if (visitors === 0) return 0;
    return (inquiries / visitors) * 100;
  }, [visitors, inquiries]);

  /* ── Loss factor calculations ───────────────────────────────────── */
  const lossFactors = useMemo(() => {
    // Load time loss: every second above 2s = ~7% conversion loss
    const loadLoss = Math.max(0, (loadTime - 2) * 7);
    // Mobile score loss: (100 - score) * 0.35
    const mobileLoss = Math.max(0, (100 - mobileScore) * 0.35);
    // SEO position loss: positions beyond 3 lose ~5% click-through each
    const seoLoss = Math.max(0, (googlePosition - 3) * 5);
    // Trust loss: lacking signals from max 8, each missing = ~4%
    const trustLoss = Math.max(0, (8 - trustSignals) * 4);

    const totalLoss = Math.min(loadLoss + mobileLoss + seoLoss + trustLoss, 95);

    return { loadLoss, mobileLoss, seoLoss, trustLoss, totalLoss };
  }, [loadTime, mobileScore, googlePosition, trustSignals]);

  /* ── Revenue calculations ───────────────────────────────────────── */
  const calculations = useMemo(() => {
    const currentLeadsPerMonth = inquiries;
    const currentRevenuePerMonth = currentLeadsPerMonth * CLOSE_RATE * aov;
    const currentRevenuePerYear = currentRevenuePerMonth * 12;

    // Target scenario: 4% conversion rate
    const targetLeadsPerMonth = (visitors * TARGET_CONVERSION) / 100;
    const targetRevenuePerMonth = targetLeadsPerMonth * CLOSE_RATE * aov;
    const targetRevenuePerYear = targetRevenuePerMonth * 12;

    const lostLeadsPerMonth = Math.max(0, targetLeadsPerMonth - currentLeadsPerMonth);
    const monthlyLoss = Math.max(0, targetRevenuePerMonth - currentRevenuePerMonth);
    const yearlyLoss = monthlyLoss * 12;

    const growthFactor = currentRevenuePerMonth > 0
      ? targetRevenuePerMonth / currentRevenuePerMonth
      : 0;

    return {
      currentLeadsPerMonth,
      currentRevenuePerMonth,
      currentRevenuePerYear,
      targetLeadsPerMonth,
      targetRevenuePerMonth,
      targetRevenuePerYear,
      lostLeadsPerMonth,
      monthlyLoss,
      yearlyLoss,
      growthFactor,
    };
  }, [visitors, inquiries, aov]);

  /* ── Donut segments ─────────────────────────────────────────────── */
  const donutSegments = useMemo(() => {
    const { loadLoss, mobileLoss, seoLoss, trustLoss } = lossFactors;
    return [
      { label: 'Ladezeit', value: loadLoss, color: LOSS_SEGMENTS[0].color },
      { label: 'Mobil', value: mobileLoss, color: LOSS_SEGMENTS[1].color },
      { label: 'SEO', value: seoLoss, color: LOSS_SEGMENTS[2].color },
      { label: 'Vertrauen', value: trustLoss, color: LOSS_SEGMENTS[3].color },
    ];
  }, [lossFactors]);

  /* ── Quick wins ─────────────────────────────────────────────────── */
  const quickWins = useMemo((): QuickWin[] => {
    const wins: QuickWin[] = [];

    if (loadTime > 3) {
      wins.push({
        icon: <Zap className="w-5 h-5 text-red-600" />,
        title: 'Ladezeit optimieren',
        description: `Ihre Ladezeit von ${loadTime.toFixed(1).replace('.', ',')}s kostet Sie ca. ${fmtPct(lossFactors.loadLoss, 0)} Conversion. Ziel: unter 2s.`,
        impact: `+${Math.round(lossFactors.loadLoss)}% Conv.`,
        badge: 'Hoch',
      });
    }

    if (mobileScore < 70) {
      wins.push({
        icon: <Smartphone className="w-5 h-5 text-red-600" />,
        title: 'Mobile Experience verbessern',
        description: `Ein Mobile-Score von ${mobileScore}/100 bedeutet, dass über 60% Ihrer Besucher eine schlechte Erfahrung haben.`,
        impact: `+${Math.round(lossFactors.mobileLoss)}% Conv.`,
        badge: 'Kritisch',
      });
    }

    if (googlePosition > 5) {
      wins.push({
        icon: <Search className="w-5 h-5 text-red-600" />,
        title: 'SEO-Position verbessern',
        description: `Position ${googlePosition} auf Google bedeutet, dass nur ~${Math.max(1, Math.round(30 / googlePosition))}% der Suchenden Ihre Seite sehen.`,
        impact: `+${Math.round(lossFactors.seoLoss)}% Sichtbarkeit`,
        badge: 'Mittel',
      });
    }

    if (trustSignals < 5) {
      wins.push({
        icon: <ShieldCheck className="w-5 h-5 text-red-600" />,
        title: 'Vertrauenssignale hinzufügen',
        description: `Sie nutzen nur ${trustSignals} von 8 möglichen Trust-Elementen. Bewertungen, Zertifikate und Garantien steigern die Conversion.`,
        impact: `+${Math.round(lossFactors.trustLoss)}% Vertrauen`,
        badge: 'Einfach',
      });
    }

    if (currentConversion < 2) {
      wins.push({
        icon: <Target className="w-5 h-5 text-red-600" />,
        title: 'Conversion-Rate verdoppeln',
        description: `Ihre aktuelle Rate von ${fmtPct(currentConversion)} liegt deutlich unter dem Branchendurchschnitt von 4%. Gezielte CTA-Optimierung kann das ändern.`,
        impact: `${fmtEur(calculations.monthlyLoss)}/Mon.`,
        badge: 'ROI',
      });
    }

    return wins.slice(0, 3);
  }, [loadTime, mobileScore, googlePosition, trustSignals, lossFactors, currentConversion, calculations.monthlyLoss]);

  /* ── SLIDER CONFIGS ─────────────────────────────────────────────── */
  const aovSlider: SliderConfig = {
    min: 200,
    max: 120000,
    step: 100,
    label: 'Ø Auftragswert',
    unit: '€',
    formatValue: (v) => fmtEur(v),
  };

  const visitorsSlider: SliderConfig = {
    min: 100,
    max: 20000,
    step: 50,
    label: 'Besucher / Monat',
    unit: '',
    formatValue: (v) => fmtNum(v),
  };

  const inquiriesSlider: SliderConfig = {
    min: 0,
    max: 500,
    step: 1,
    label: 'Anfragen / Monat',
    unit: '',
    formatValue: (v) => fmtNum(v),
  };

  const loadTimeSlider: SliderConfig = {
    min: 0.5,
    max: 12,
    step: 0.1,
    label: 'Ladezeit (Sekunden)',
    unit: 's',
    formatValue: (v) => `${v.toFixed(1).replace('.', ',')} s`,
  };

  const mobileScoreSlider: SliderConfig = {
    min: 0,
    max: 100,
    step: 1,
    label: 'Mobile Score',
    unit: '/100',
    formatValue: (v) => `${v}/100`,
  };

  const googlePosSlider: SliderConfig = {
    min: 1,
    max: 100,
    step: 1,
    label: 'Google-Position (Hauptkeyword)',
    unit: '',
    formatValue: (v) => `Position ${v}`,
  };

  const trustSlider: SliderConfig = {
    min: 0,
    max: 8,
    step: 1,
    label: 'Vertrauenssignale',
    unit: '/8',
    formatValue: (v) => `${v} von 8`,
  };

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* ============================================================ */}
      {/*  HERO                                                         */}
      {/* ============================================================ */}
      <section className="relative w-full overflow-hidden bg-neutral-900 text-white pb-32 pt-32 lg:pt-40 lg:pb-48 -mt-24 clip-path-[polygon(0_0,100%_0,100%_calc(100%-4rem),0_100%)]">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('/images/calculator_hero.png')] bg-cover bg-center mix-blend-overlay" />
          <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-600/10 via-transparent to-transparent blur-3xl" />
        </div>
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: getDuration(0.6) }}
            className="flex flex-col gap-6 max-w-3xl items-center"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-red-500">// Umsatzverlust-Rechner · für Autohäuser</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white m-0">
              Wie viel verlieren Sie jeden Monat
              <br />
              <span className="text-red-500">durch Ihre Website?</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-300 m-0 max-w-2xl leading-relaxed">
              Geben Sie Ihre aktuellen Zahlen ein und sehen Sie sofort,
              welches Umsatzpotenzial Sie ungenutzt lassen.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CALCULATOR                                                   */}
      {/* ============================================================ */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-16 -mt-24 lg:-mt-32 relative z-20 mb-24">
        <div className="w-full">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            {/* ──────────────────────────────────────────────────────── */}
            {/*  LEFT: INPUT PANEL                                       */}
            {/* ──────────────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: getDuration(0.5), delay: getDelay(0.1) }}
              className="w-full lg:w-[420px] shrink-0 flex flex-col gap-6"
            >
              {/* Section 01: Unternehmens-Profil */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-neutral-200/50">
                <SectionHeader number="01" title="Unternehmens-Profil" />

                {/* Preset select */}
                <div className="flex flex-col gap-2 mb-8">
                  <label className="text-sm font-semibold text-neutral-600 uppercase tracking-wider">Branche & Größe</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
                    <select
                      value={presetId}
                      onChange={(e) => applyPreset(e.target.value)}
                      className="w-full pl-12 pr-10 py-4 bg-neutral-50 border border-neutral-200 rounded-xl appearance-none font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all cursor-pointer text-[15px]"
                    >
                      {INDUSTRY_PRESETS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none rotate-90" />
                  </div>
                </div>

                <RangeSlider config={aovSlider} value={aov} onChange={setAov} />
              </div>

              {/* Section 02: Online-Aktivität */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-neutral-200/50">
                <SectionHeader number="02" title="Online-Aktivität" />

                <div className="flex flex-col gap-8">
                  <RangeSlider config={visitorsSlider} value={visitors} onChange={setVisitors} />
                  <RangeSlider config={inquiriesSlider} value={inquiries} onChange={setInquiries} />

                  {/* Derived conversion display */}
                  <div className="bg-neutral-50 rounded-xl p-5 border border-neutral-100 flex flex-col gap-4 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-neutral-600">Aktuelle Conversion-Rate</span>
                      <span className={cn("text-xl font-bold px-3 py-1 rounded-md", currentConversion >= TARGET_CONVERSION ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                        {fmtPct(currentConversion)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-neutral-200/50">
                      <span className="text-sm font-semibold text-neutral-500">Branchen-Benchmark</span>
                      <span className="text-sm font-bold text-neutral-700">{fmtPct(TARGET_CONVERSION)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 03: Website-Qualität */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-neutral-200/50">
                <SectionHeader number="03" title="Website-Qualität" />

                <div className="flex flex-col gap-8">
                  <RangeSlider config={loadTimeSlider} value={loadTime} onChange={setLoadTime} />
                  <RangeSlider config={mobileScoreSlider} value={mobileScore} onChange={setMobileScore} />
                  <RangeSlider config={googlePosSlider} value={googlePosition} onChange={setGooglePosition} />
                  <RangeSlider config={trustSlider} value={trustSignals} onChange={setTrustSignals} />
                </div>
              </div>
            </motion.div>

            {/* ──────────────────────────────────────────────────────── */}
            {/*  RIGHT: DASHBOARD                                        */}
            {/* ──────────────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: getDuration(0.5), delay: getDelay(0.2) }}
              className="flex-1 flex flex-col gap-6 lg:gap-8 min-w-0"
            >
              {/* KPI Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                {/* Current conversion */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 flex flex-col items-center text-center">
                  <div className="flex flex-col items-center gap-2 mb-3">
                    <span className={cn("w-12 h-12 rounded-full flex items-center justify-center border-4", currentConversion >= TARGET_CONVERSION ? "bg-green-100 text-green-600 border-white" : "bg-red-100 text-red-600 border-white shadow-sm")}>
                      {currentConversion >= TARGET_CONVERSION
                        ? <TrendingUp className="w-6 h-6" />
                        : <TrendingDown className="w-6 h-6" />}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Conversion</span>
                  </div>
                  <p className={cn("text-3xl font-display font-bold m-0", currentConversion >= TARGET_CONVERSION ? "text-green-600" : "text-red-600")}>
                    {fmtPct(currentConversion)}
                  </p>
                  <p className="text-xs text-neutral-400 font-medium m-0 mt-2">
                    Ziel: <span className="text-neutral-900 font-bold">{fmtPct(TARGET_CONVERSION)}</span>
                  </p>
                </div>

                {/* Lost leads */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 flex flex-col items-center text-center">
                  <div className="flex flex-col items-center gap-2 mb-3">
                    <span className="w-12 h-12 rounded-full flex items-center justify-center bg-orange-100 text-orange-600 border-4 border-white shadow-sm">
                      <AlertTriangle className="w-6 h-6" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Verlorene Leads/Mon.</span>
                  </div>
                  <p className="text-3xl font-display font-bold text-neutral-900 m-0">
                    {fmtNum(calculations.lostLeadsPerMonth)}
                  </p>
                  <p className="text-xs text-neutral-400 font-medium m-0 mt-2">
                    Möglich: <span className="text-neutral-900 font-bold">{fmtNum(calculations.targetLeadsPerMonth)}</span>/Mon.
                  </p>
                </div>

                {/* Growth factor */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 flex flex-col items-center text-center">
                  <div className="flex flex-col items-center gap-2 mb-3">
                    <span className="w-12 h-12 rounded-full flex items-center justify-center bg-neutral-100 text-red-600 border-4 border-white shadow-sm">
                      <BarChart3 className="w-6 h-6" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Wachstumsfaktor</span>
                  </div>
                  <p className="text-3xl font-display font-bold text-red-600 m-0">
                    {calculations.growthFactor > 0 ? `${calculations.growthFactor.toFixed(1).replace('.', ',')}x` : '–'}
                  </p>
                  <p className="text-xs text-neutral-400 font-medium m-0 mt-2">
                    Potenzieller Multiplikator
                  </p>
                </div>
              </div>

              {/* Revenue comparison */}
              <div className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-sm border border-neutral-200/50">
                <h3 className="font-display text-2xl font-bold text-neutral-900 flex items-center gap-3 m-0">
                  <BarChart3 className="w-6 h-6 text-red-600" />
                  Umsatzvergleich (monatlich)
                </h3>
                <BarComparison 
                  label1="Aktueller Umsatz"
                  value1={calculations.currentRevenuePerMonth}
                  label2="Möglicher Umsatz"
                  value2={calculations.targetRevenuePerMonth}
                  unit="€"
                />
                {calculations.monthlyLoss > 0 && (
                  <div className="mt-8 p-6 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-4">
                    <div className="w-10 h-10 shrink-0 bg-red-100 rounded-full flex items-center justify-center text-red-600 border-4 border-white shadow-sm">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-red-800">Monatlicher Umsatzverlust:</span>
                      <span className="text-3xl font-display font-bold text-red-600 tracking-tight">{fmtEur(calculations.monthlyLoss)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Loss donut */}
              <div className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-sm border border-neutral-200/50">
                <h3 className="font-display text-2xl font-bold text-neutral-900 flex items-center gap-3 mb-8">
                  <Target className="w-6 h-6 text-red-600" />
                  Verlustquellen-Analyse
                </h3>
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-16">
                  <DonutChart segments={donutSegments} />
                  <div className="flex-1 flex flex-col gap-4 w-full">
                    {LOSS_SEGMENTS.map((seg, i) => {
                      const values = [lossFactors.loadLoss, lossFactors.mobileLoss, lossFactors.seoLoss, lossFactors.trustLoss];
                      const val = values[i];
                      return (
                        <div key={seg.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                          <div className="flex items-center gap-3">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: seg.color }}
                            />
                            <div className="flex items-center gap-2">
                              {seg.icon}
                              <span className="font-semibold text-neutral-900">{seg.label}</span>
                            </div>
                          </div>
                          <span className="font-bold text-neutral-900">
                            {fmtPct(val, 0)}
                          </span>
                        </div>
                      );
                    })}
                    <div className="mt-2 pt-4 border-t border-neutral-200 flex justify-between items-center px-4">
                      <span className="font-bold text-neutral-900">Gesamt</span>
                      <span className="text-xl font-bold text-red-600">
                        {fmtPct(lossFactors.totalLoss, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Side Panels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mt-4">
                <div className="rounded-[2rem] overflow-hidden h-48 md:h-64 shadow-sm relative group">
                  <img src="/images/calculator_side1.png" alt="Consulting" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 to-transparent flex flex-col justify-end p-6">
                    <span className="text-white font-bold text-lg">Datengetriebene Analyse</span>
                  </div>
                </div>
                <div className="rounded-[2rem] overflow-hidden h-48 md:h-64 shadow-sm relative group">
                  <img src="/images/calculator_side2.png" alt="Showroom" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 to-transparent flex flex-col justify-end p-6">
                    <span className="text-white font-bold text-lg">Mehr Besucher im Autohaus</span>
                  </div>
                </div>
              </div>

              {/* 5-year projection */}
              <div className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-sm border border-neutral-200/50">
                <h3 className="font-display text-2xl font-bold text-neutral-900 flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-red-600" />
                  5-Jahres-Projektion (kumulierter Umsatzverlust)
                </h3>
                <ProjectionChart  yearlyDiff={calculations.yearlyLoss} />
                <p className="mt-8 text-center text-neutral-500 font-medium">
                  In 5 Jahren verlieren Sie potenziell{' '}
                  <span className="text-red-600 font-bold px-2 py-1 bg-red-50 rounded-md">
                    {fmtEur(calculations.yearlyLoss * 5)}
                  </span>{' '}
                  an entgangenem Umsatz.
                </p>
              </div>

              {/* Quick wins */}
              {quickWins.length > 0 && (
                <div className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-sm border border-neutral-200/50">
                  <h3 className="font-display text-2xl font-bold text-neutral-900 flex items-center gap-3 mb-8">
                    <Lightbulb className="w-6 h-6 text-yellow-500" />
                    Sofort-Empfehlungen
                  </h3>
                  <div className="flex flex-col gap-4">
                    {quickWins.map((win) => (
                      <div
                        key={win.title}
                        className="flex flex-col sm:flex-row sm:items-start gap-4 p-5 bg-neutral-50 rounded-xl border border-neutral-100"
                      >
                        <div className="w-12 h-12 shrink-0 bg-white rounded-xl shadow-sm border border-neutral-200 flex items-center justify-center">
                          {win.icon}
                        </div>
                        <div className="flex-1 flex flex-col gap-2 min-w-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <h4 className="font-bold text-neutral-900 m-0">{win.title}</h4>
                            <span className={cn(
                              "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                              win.badge === 'Kritisch' ? 'bg-red-50 text-red-700 border-red-200' :
                              win.badge === 'Hoch' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                              'bg-neutral-100 text-neutral-600 border-neutral-200'
                            )}>
                              {win.badge}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-500 leading-relaxed m-0">{win.description}</p>
                        </div>
                        <div className="sm:self-center shrink-0 mt-2 sm:mt-0 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-bold text-center">
                          {win.impact}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Final CTA */}
              <div className="bg-neutral-900 text-white rounded-[2rem] p-8 lg:p-12 overflow-hidden relative shadow-lg mt-4">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 lg:gap-12">
                  <div className="flex-1 flex flex-col gap-4">
                    <Calculator className="w-8 h-8 text-red-500 mb-2" />
                    <h3 className="font-display text-3xl font-bold m-0">Ihr jährliches Potenzial:</h3>
                    <p className="text-5xl lg:text-6xl font-display font-bold text-white tracking-tight m-0">
                      {fmtEur(calculations.yearlyLoss)}
                    </p>
                    <p className="text-neutral-400 text-lg m-0 max-w-md leading-relaxed">
                      entgangener Umsatz pro Jahr — bei einer Conversion-Optimierung auf{' '}
                      <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded ml-1">{fmtPct(TARGET_CONVERSION)}</span>.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
                    <Link href="/preise" className="w-full">
                      <Button className="w-full h-14 bg-red-600 hover:bg-red-700 text-white text-[15px] rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-sm">
                        Lösung ansehen
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full h-14 bg-transparent border-white/20 text-white hover:bg-white/10 text-[15px] rounded-xl flex items-center justify-center gap-2 font-bold transition-all">
                      Kostenlose Beratung
                      <Users className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
