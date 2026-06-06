'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ArrowRight, X } from 'lucide-react';
import { BRANDS } from '@/lib/mock/vehicles';
import { cn } from '@/lib/cn';

const TABS = [
  { key: 'alle', label: 'Alle' },
  { key: 'neuwagen', label: 'Neuwagen' },
  { key: 'jahreswagen', label: 'Jahreswagen' },
  { key: 'gebrauchtwagen', label: 'Gebrauchtwagen' },
  { key: 'service', label: 'Service' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}

function SelectField({ label, value, onChange, options, placeholder }: SelectFieldProps) {
  return (
    <div className="flex flex-col">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-2">{label}</label>
      <div className="relative group">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-neutral-100 hover:bg-neutral-200/60 border-none rounded-xl px-4 py-3.5 text-[15px] font-medium text-neutral-900 focus:ring-2 focus:ring-red-600/20 focus:outline-none transition-colors cursor-pointer"
        >
          <option value="" className="text-neutral-400">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="text-neutral-900">{opt}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none group-hover:text-neutral-600 transition-colors" />
      </div>
    </div>
  );
}

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}

function InputField({ label, value, onChange, placeholder, type = 'text' }: InputFieldProps) {
  return (
    <div className="flex flex-col">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-2">{label}</label>
      <div className="relative group">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-neutral-100 hover:bg-neutral-200/60 border-none rounded-xl px-4 py-3.5 text-[15px] font-medium text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-red-600/20 focus:outline-none transition-colors"
        />
        {value && (
          <button onClick={() => onChange('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

const PRICE_OPTIONS = [
  '25.000 €',
  '50.000 €',
  '75.000 €',
  '100.000 €',
  '150.000 €',
  '200.000 €',
  '300.000 €',
];

const KM_OPTIONS = [
  '5.000 km',
  '10.000 km',
  '25.000 km',
  '50.000 km',
  '100.000 km',
  '150.000 km',
];

export function QuickSearch() {
  const [activeTab, setActiveTab] = useState<TabKey>('alle');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [kmMax, setKmMax] = useState('');

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-6 scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "relative px-5 py-2.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-colors outline-none",
              activeTab === tab.key ? "text-white" : "text-neutral-600 hover:bg-neutral-100"
            )}
          >
            {activeTab === tab.key && (
              <motion.div
                layoutId="quick-search-tab"
                className="absolute inset-0 bg-neutral-900 rounded-full"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <SelectField label="Marke" value={brand} onChange={setBrand} options={BRANDS} placeholder="Alle Marken" />
        <InputField label="Modell" value={model} onChange={setModel} placeholder="z.B. RS6, 911, M3" />
        <SelectField label="Preis bis" value={priceMax} onChange={setPriceMax} options={PRICE_OPTIONS} placeholder="Keine Begrenzung" />
        <SelectField label="Kilometer" value={kmMax} onChange={setKmMax} options={KM_OPTIONS} placeholder="Keine Begrenzung" />
      </div>

      {/* Footer */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-8 pt-6 border-t border-neutral-100">
        <p className="text-sm font-medium text-neutral-500">
          <span className="text-neutral-900 font-bold">124</span> Fahrzeuge entsprechen Ihrer Suche
        </p>
        <Link
          href="/fahrzeuge"
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-full px-8 py-4 text-[15px] font-semibold transition-all active:scale-95 hover:shadow-lg hover:shadow-red-600/20"
        >
          <Search className="w-4 h-4" />
          <span className="mx-1">124 Treffer anzeigen</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default QuickSearch;
