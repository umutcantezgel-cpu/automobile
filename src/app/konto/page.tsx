'use client';

import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  Car,
  Heart,
  FileText,
  Settings,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useFavoritesStore } from '@/lib/store/favorites';
import { cn } from '@/lib/cn';

const TABS = [
  { id: 'uebersicht', label: 'Übersicht', icon: LayoutDashboard },
  { id: 'anfragen', label: 'Anfragen', icon: MessageSquare },
  { id: 'probefahrten', label: 'Probefahrten', icon: Car },
  { id: 'merkliste', label: 'Merkliste', icon: Heart },
  { id: 'dokumente', label: 'Dokumente', icon: FileText },
  { id: 'einstellungen', label: 'Einstellungen', icon: Settings },
  { id: 'hilfe', label: 'Hilfe', icon: HelpCircle },
];

const ACTIVITIES = [
  { id: 1, text: 'Neue Anfrage zu Porsche 911 gesendet', time: 'Heute, 14:30', date: '2026-05-15' },
  { id: 2, text: 'Probefahrt für Audi RS6 bestätigt', time: 'Gestern, 10:15', date: '2026-05-14' },
  { id: 3, text: 'Mercedes-AMG GT zur Merkliste hinzugefügt', time: '12.05.2026, 18:45', date: '2026-05-12' },
  { id: 4, text: 'Kaufvertrag PDF heruntergeladen', time: '10.05.2026, 09:20', date: '2026-05-10' },
  { id: 5, text: 'Konto erstellt', time: '01.05.2026, 11:00', date: '2026-05-01' },
];

const INQUIRIES = [
  { id: 1, vehicle: 'Porsche 911 GT3 RS', date: '15.05.2026', status: 'Neu', statusClass: 'bg-red-50 text-red-700 border-red-200' },
  { id: 2, vehicle: 'Audi RS6 Avant', date: '12.05.2026', status: 'Beantwortet', statusClass: 'bg-green-50 text-green-700 border-green-200' },
  { id: 3, vehicle: 'BMW M4 Competition', date: '08.05.2026', status: 'Offen', statusClass: 'bg-amber-50 text-amber-700 border-amber-200' },
];

export default function KontoPage() {
  const [activeTab, setActiveTab] = useState('uebersicht');
  const [mounted, setMounted] = useState(false);
  const favoritesCount = useFavoritesStore((state) => state.count());

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="flex justify-center items-center h-64 text-neutral-500 font-medium">Lade Konto...</div>
      </main>
    );
  }

  return (
    <main className="w-full max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 flex flex-col gap-8 md:gap-16">
      <header className="flex flex-col gap-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-red-600">
          // Mein Konto
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-neutral-900">Willkommen zurück.</h1>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide border-b border-neutral-200 lg:border-none">
          <nav className="flex lg:flex-col gap-2 min-w-max lg:min-w-0">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all w-full text-left",
                    isActive
                      ? "bg-red-50 text-red-700"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                  )}
                >
                  <tab.icon size={18} className={cn(isActive ? "text-red-600" : "text-neutral-400")} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0 w-full">
          {activeTab === 'uebersicht' ? (
            <div className="flex flex-col gap-8">
              {/* KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col gap-2 shadow-sm">
                  <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Aktive Anfragen</span>
                  <span className="text-3xl font-bold text-neutral-900">3</span>
                </div>
                <div className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col gap-2 shadow-sm">
                  <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Probefahrten</span>
                  <span className="text-3xl font-bold text-neutral-900">2</span>
                </div>
                <div className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col gap-2 shadow-sm">
                  <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Gemerkte Fahrzeuge</span>
                  <span className="text-3xl font-bold text-neutral-900">{favoritesCount}</span>
                </div>
                <div className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col gap-2 shadow-sm">
                  <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Dokumente</span>
                  <span className="text-3xl font-bold text-neutral-900">5</span>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
                {/* Inquiries Table */}
                <div className="bg-white rounded-2xl border border-neutral-200 p-6 md:p-8 shadow-sm flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-neutral-900 m-0">Aktuelle Anfragen</h2>
                    <button onClick={() => setActiveTab('anfragen')} className="text-sm font-semibold text-red-600 flex items-center gap-2 hover:text-red-700 transition-colors group">
                      Alle ansehen <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-4">
                    {INQUIRIES.map((inq) => (
                      <div key={inq.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-neutral-100 bg-neutral-50/50">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-neutral-900">{inq.vehicle}</span>
                          <span className="text-xs text-neutral-500">{inq.date}</span>
                        </div>
                        <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold self-start sm:self-auto", inq.statusClass)}>
                          {inq.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activity Timeline */}
                <div className="bg-white rounded-2xl border border-neutral-200 p-6 md:p-8 shadow-sm flex flex-col gap-6">
                  <h2 className="text-lg font-bold text-neutral-900 m-0">Letzte Aktivitäten</h2>
                  <div className="relative pl-6 flex flex-col gap-8 before:content-[''] before:absolute before:top-2 before:bottom-2 before:left-[11px] before:w-[2px] before:bg-neutral-100">
                    {ACTIVITIES.map((act) => (
                      <div key={act.id} className="relative">
                        <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-white border-[3px] border-neutral-300 ring-4 ring-white" />
                        <div className="flex flex-col gap-1.5">
                          <span className="text-sm font-medium text-neutral-900">{act.text}</span>
                          <span className="text-xs text-neutral-500 flex items-center gap-1.5">
                            <Clock size={12} /> {act.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-neutral-200 p-12 flex flex-col items-center justify-center text-center gap-4 shadow-sm min-h-[400px]">
              <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 mb-2">
                <Clock size={24} />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 m-0">In Bearbeitung</h2>
              <p className="text-neutral-500 max-w-md m-0">
                Dieser Bereich wird in Kürze verfügbar. Wir arbeiten kontinuierlich an neuen Funktionen für Ihr Konto.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
