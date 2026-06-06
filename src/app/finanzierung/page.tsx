'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Info, ArrowRight, ShieldCheck, Banknote, Car, Percent } from 'lucide-react';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/cn';

type ModelType = 'klassisch' | '3-wege' | 'leasing';
type CreditRating = 'sehr-gut' | 'gut' | 'mittel';

const LAUFZEITEN = [24, 36, 48, 60, 72];
const ZINSEN: Record<CreditRating, number> = {
  'sehr-gut': 2.99,
  'gut': 3.99,
  'mittel': 5.99,
};

export default function FinancingPage() {
  const [vehicleValue, setVehicleValue] = useState<number>(85000);
  const [anzahlungPct, setAnzahlungPct] = useState<number>(20);
  const [laufzeit, setLaufzeit] = useState<number>(48);
  const [model, setModel] = useState<ModelType>('3-wege');
  const [schlussratePct, setSchlussratePct] = useState<number>(30);
  const [rating, setRating] = useState<CreditRating>('sehr-gut');

  const anzahlung = Math.round((vehicleValue * anzahlungPct) / 100);
  let schlussrate = 0;
  if (model === '3-wege') {
    schlussrate = Math.round((vehicleValue * schlussratePct) / 100);
  }

  const results = useMemo(() => {
    const netCredit = vehicleValue - anzahlung;
    const interestRate = ZINSEN[rating] / 100;
    const years = laufzeit / 12;

    let monthly = 0;
    let totalInterest = 0;
    let totalPaid = 0;

    if (model === 'klassisch') {
      const totalAmount = netCredit * (1 + interestRate * years);
      monthly = totalAmount / laufzeit;
      totalInterest = totalAmount - netCredit;
      totalPaid = totalAmount + anzahlung;
    } else if (model === '3-wege') {
      const financedAmount = netCredit - schlussrate;
      const totalAmount = financedAmount * (1 + interestRate * years) + schlussrate * (interestRate * years);
      monthly = totalAmount / laufzeit;
      totalInterest = totalAmount - financedAmount;
      totalPaid = totalAmount + anzahlung + schlussrate;
    } else if (model === 'leasing') {
      // Simplistic leasing calc
      const depreciation = vehicleValue * 0.15 * years;
      const baseMonthly = depreciation / laufzeit;
      const interestPortion = (vehicleValue * interestRate) / 12;
      monthly = baseMonthly + interestPortion - (anzahlung / laufzeit);
      if (monthly < 0) monthly = 0;
      totalInterest = interestPortion * laufzeit;
      totalPaid = monthly * laufzeit + anzahlung;
      schlussrate = 0; 
    }

    return {
      monthly: Math.round(monthly),
      totalInterest: Math.round(totalInterest),
      totalPaid: Math.round(totalPaid),
      netCredit,
    };
  }, [vehicleValue, anzahlung, laufzeit, model, schlussrate, rating]);

  const chartData = [
    { label: 'Anzahlung', value: anzahlung, color: '#e5e7eb' }, // neutral-200
    { label: 'Raten', value: results.monthly * laufzeit, color: '#dc2626' }, // red-600
    { label: 'Schlussrate', value: schlussrate, color: '#111827' }, // neutral-900
  ].filter(d => d.value > 0);

  const totalChartValue = chartData.reduce((acc, curr) => acc + curr.value, 0);
  let currentAngle = 0;

  return (
    <main className="min-h-screen bg-neutral-50 pb-20 pt-32">
      <section className="max-w-[1400px] mx-auto px-4 md:px-8">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-red-600 mb-3 flex items-center gap-3">
            <span className="w-8 h-[1px] bg-red-600" /> Finanzierung
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 mb-4">
            Finanzierung berechnen
          </h1>
          <p className="text-lg text-neutral-500 max-w-2xl">
            Planen Sie Ihren nächsten Fahrzeugkauf flexibel. Passen Sie die Konditionen individuell an Ihre Bedürfnisse an.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ---- Calculator Form ---- */}
          <motion.div
            className="xl:col-span-8 flex flex-col gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            {/* Models */}
            <div>
              <h3 className="flex items-center gap-2 font-display text-xl font-bold text-neutral-900 mb-4 tracking-tight">
                <Banknote className="text-neutral-400" size={22} />
                Finanzierungs-Modell
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'klassisch', label: 'Klassisch', desc: 'Konstante Raten' },
                  { id: '3-wege', label: '3-Wege', desc: 'Flexible Rückgabe', badge: 'Empfohlen' },
                  { id: 'leasing', label: 'Leasing', desc: 'Nur Nutzung zahlen' }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setModel(m.id as ModelType)}
                    className={cn(
                      "relative text-left p-5 rounded-2xl border transition-all",
                      model === m.id
                        ? "bg-white border-neutral-900 shadow-md ring-1 ring-neutral-900"
                        : "bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                    )}
                  >
                    {m.badge && (
                      <span className="absolute -top-3 left-4 px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        {m.badge}
                      </span>
                    )}
                    <div className="flex justify-between items-center mb-1">
                      <span className={cn(
                        "font-display text-lg font-bold tracking-tight",
                        model === m.id ? "text-neutral-900" : "text-neutral-700"
                      )}>{m.label}</span>
                      <div className={cn(
                        "flex items-center justify-center w-5 h-5 rounded-full border transition-all",
                        model === m.id ? "border-neutral-900 bg-neutral-900" : "border-neutral-300"
                      )}>
                        {model === m.id && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>
                    <span className="text-sm font-medium text-neutral-500">{m.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Values */}
            <div className="p-6 md:p-8 rounded-3xl bg-white border border-neutral-200/60 shadow-sm flex flex-col gap-8">
              {/* Fahrzeugwert */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <label className="text-[13px] font-bold uppercase tracking-wider text-neutral-500">Fahrzeugwert</label>
                  <span className="font-display text-2xl font-bold tracking-tight text-neutral-900">{formatPrice(vehicleValue)}</span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={300000}
                  step={1000}
                  value={vehicleValue}
                  onChange={(e) => setVehicleValue(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
                <div className="flex justify-between mt-2 text-[11px] font-bold text-neutral-400 font-mono">
                  <span>10.000 €</span>
                  <span>300.000 €</span>
                </div>
              </div>

              {/* Anzahlung */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <label className="text-[13px] font-bold uppercase tracking-wider text-neutral-500">Anzahlung</label>
                  <div className="flex items-baseline gap-2">
                    <div className="font-display text-2xl font-bold tracking-tight text-neutral-900">{formatPrice(anzahlung)}</div>
                    <div className="text-sm font-bold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-md">{anzahlungPct}%</div>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={1}
                  value={anzahlungPct}
                  onChange={(e) => setAnzahlungPct(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
              </div>

              {/* Schlussrate */}
              <AnimatePresence>
                {model === '3-wege' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2">
                      <div className="flex justify-between items-end mb-4">
                        <label className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-neutral-500">
                          Schlussrate
                          <Info size={14} className="text-neutral-400" />
                        </label>
                        <div className="flex items-baseline gap-2">
                          <div className="font-display text-2xl font-bold tracking-tight text-neutral-900">{formatPrice(schlussrate)}</div>
                          <div className="text-sm font-bold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-md">{schlussratePct}%</div>
                        </div>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={60}
                        step={1}
                        value={schlussratePct}
                        onChange={(e) => setSchlussratePct(Number(e.target.value))}
                        className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Laufzeit */}
            <div>
              <h3 className="font-display text-xl font-bold text-neutral-900 mb-4 tracking-tight">Laufzeit (Monate)</h3>
              <div className="flex flex-wrap gap-3">
                {LAUFZEITEN.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLaufzeit(l)}
                    className={cn(
                      "px-6 py-3 rounded-xl font-bold transition-all border",
                      laufzeit === l
                        ? "bg-neutral-900 text-white border-neutral-900 shadow-md"
                        : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900"
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Bonität */}
            <div>
              <h3 className="flex items-center gap-2 font-display text-xl font-bold text-neutral-900 mb-4 tracking-tight">
                <ShieldCheck className="text-neutral-400" size={22} />
                Eigene Bonität einschätzen
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'sehr-gut', label: 'Sehr gut', rate: ZINSEN['sehr-gut'] },
                  { id: 'gut', label: 'Gut', rate: ZINSEN['gut'] },
                  { id: 'mittel', label: 'Mittel', rate: ZINSEN['mittel'] }
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setRating(b.id as CreditRating)}
                    className={cn(
                      "flex flex-col items-start p-4 rounded-xl border transition-all",
                      rating === b.id
                        ? "bg-neutral-900 text-white border-neutral-900 shadow-md"
                        : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900"
                    )}
                  >
                    <span className="font-bold text-[15px] mb-1">{b.label}</span>
                    <span className={cn(
                      "text-sm font-semibold",
                      rating === b.id ? "text-neutral-400" : "text-red-600"
                    )}>{b.rate}% p.a.</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ---- Sticky Result Card ---- */}
          <motion.div
            className="xl:col-span-4 sticky top-28"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            <div className="rounded-3xl bg-white border border-neutral-200/60 shadow-xl overflow-hidden">
              <div className="p-8 bg-neutral-900 text-white text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Ihre monatliche Rate</p>
                <div className="flex items-start justify-center gap-1 mb-4">
                  <span className="font-display text-6xl font-bold tracking-tight leading-none">
                    {formatPrice(results.monthly).replace(' €', '')}
                  </span>
                  <span className="text-2xl font-bold text-neutral-400 mt-1">€</span>
                </div>
                <p className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-neutral-300">
                  <Percent size={12} />
                  Effektiver Jahreszins: <span className="text-white ml-0.5">{ZINSEN[rating]}%</span>
                </p>
              </div>

              <div className="p-8 flex flex-col items-center">
                {/* SVG Donut Chart */}
                <div className="relative w-[200px] h-[200px] mb-8">
                  <svg width="200" height="200" viewBox="0 0 200 200" className="rotate-[-90deg]">
                    {chartData.map((d, i) => {
                      if (d.value === 0) return null;
                      const fraction = d.value / totalChartValue;
                      const strokeDasharray = `${fraction * 2 * Math.PI * 80} ${2 * Math.PI * 80}`;
                      const strokeDashoffset = `-${currentAngle * 2 * Math.PI * 80}`;
                      currentAngle += fraction;
                      return (
                        <circle
                          key={i}
                          cx="100"
                          cy="100"
                          r="80"
                          fill="transparent"
                          stroke={d.color}
                          strokeWidth="16"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          className="transition-all duration-500 ease-out"
                          strokeLinecap="round"
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-900">
                    <Car size={24} className="text-neutral-400 mb-1" />
                    <span className="font-display text-3xl font-bold tracking-tight leading-none">{laufzeit}</span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Monate</span>
                  </div>
                </div>

                <div className="w-full flex flex-col gap-4 mb-8">
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2 font-medium text-neutral-600">
                      <div className="w-3 h-3 rounded-full bg-neutral-200" />
                      Anzahlung
                    </span>
                    <span className="font-bold text-neutral-900 font-mono">{formatPrice(anzahlung)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2 font-medium text-neutral-600">
                      <div className="w-3 h-3 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
                      Raten ({laufzeit}x)
                    </span>
                    <span className="font-bold text-neutral-900 font-mono">{formatPrice(results.monthly * laufzeit)}</span>
                  </div>
                  {model === '3-wege' && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-2 font-medium text-neutral-600">
                        <div className="w-3 h-3 rounded-full bg-neutral-900" />
                        Schlussrate
                      </span>
                      <span className="font-bold text-neutral-900 font-mono">{formatPrice(schlussrate)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm pt-4 border-t border-neutral-100 mt-2">
                    <span className="font-semibold text-neutral-500">Zinskosten gesamt</span>
                    <span className="font-bold text-neutral-400 font-mono">{formatPrice(results.totalInterest)}</span>
                  </div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-4 text-[15px] font-semibold text-white transition-all hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/20 active:scale-95">
                  Angebot anfordern
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ---- Info Cards ---- */}
        <motion.div
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
        >
          {[
            {
              title: 'Klassische Finanzierung',
              desc: 'Gleichbleibende Raten über die gesamte Laufzeit. Am Ende gehört das Fahrzeug Ihnen.',
              pros: ['Planungssicherheit', 'Keine Kilometerbegrenzung', 'Fahrzeugeigentum am Ende']
            },
            {
              title: '3-Wege Finanzierung',
              desc: 'Niedrige monatliche Raten dank Schlussrate. Volle Flexibilität am Vertragsende.',
              pros: ['Niedrige Raten', 'Rückgabe möglich', 'Anschlussfinanzierung']
            },
            {
              title: 'Leasing',
              desc: 'Sie zahlen nur für die tatsächliche Nutzung. Ideal, um immer das neueste Modell zu fahren.',
              pros: ['Stets aktuelles Modell', 'Oft ohne Anzahlung', 'Kein Restwertrisiko']
            }
          ].map((card, i) => (
            <div key={i} className="flex flex-col p-8 rounded-3xl bg-white border border-neutral-200/60 shadow-sm">
              <h4 className="font-display text-xl font-bold text-neutral-900 tracking-tight mb-2">{card.title}</h4>
              <p className="text-[15px] leading-relaxed text-neutral-500 mb-6">{card.desc}</p>
              <ul className="flex flex-col gap-3 mt-auto">
                {card.pros.map((pro, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm font-semibold text-neutral-700">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 mt-0.5 flex-shrink-0">
                      <Check size={12} />
                    </div>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>
      </section>
    </main>
  );
}
