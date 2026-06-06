'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMotionTokens } from '@/lib/motion';
import { Tag } from 'lucide-react';
import { VEHICLES } from '@/lib/mock/vehicles';
import { VehicleCard } from '@/components/sections/vehicle-card';
import { cn } from '@/lib/cn';

/* ------------------------------------------------------------------ */
/*  Types & Data                                                       */
/* ------------------------------------------------------------------ */

const TABS = [
  { key: 'alle', label: 'Alle' },
  { key: 'jahreswagen', label: 'Jahreswagen' },
  { key: 'vorfuehrwagen', label: 'Vorführwagen' },
  { key: 'sondermodelle', label: 'Sondermodelle' },
  { key: 'auslaufmodelle', label: 'Auslaufmodelle' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

/* ------------------------------------------------------------------ */
/*  Animations                                                         */
/* ------------------------------------------------------------------ */


/* ------------------------------------------------------------------ */
/*  Filter logic                                                       */
/* ------------------------------------------------------------------ */

function filterByTab(tab: TabKey) {
  switch (tab) {
    case 'jahreswagen':
      return VEHICLES.filter((v) => v.km >= 5000 && v.km < 20000);
    case 'vorfuehrwagen':
      return VEHICLES.filter((v) => v.km < 5000);
    case 'sondermodelle':
      return VEHICLES.filter((v) => v.tag === 'SONDERMODELL' || v.tag === 'PREMIUM');
    case 'auslaufmodelle':
      return VEHICLES.filter((v) => v.oldPrice !== undefined);
    default:
      return VEHICLES;
  }
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AngebotePage() {
  const [activeTab, setActiveTab] = useState<TabKey>('alle');
  const filtered = filterByTab(activeTab);
  const { getDuration, getDelay, prefersReducedMotion } = useMotionTokens();

  const fadeUp: any = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const fadeUpReduced: any = {
    hidden: { opacity: 0, y: 0 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: getDuration(0), ease: [0.16, 1, 0.3, 1] as const },
    },
  };


  return (
    <main>
      {/* ============================================================ */}
      {/*  HERO                                                        */}
      {/* ============================================================ */}
      <section className="relative w-full h-[45vh] min-h-[400px] flex items-end pb-12 overflow-hidden -mt-24 lg:-mt-32">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/angebote_hero.png" 
            alt="Angebote Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-neutral-900/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-50 via-neutral-50/20 to-transparent" />
        </div>
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: getDuration(0.5), ease: "easeOut" as const }}
            className="eyebrow text-white mb-4"
          >
            {'Aktuelle Angebote · Frühjahrs-Edition 2026'}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: getDuration(0.6), delay: getDelay(0.1), ease: [0.16, 1, 0.3, 1] as const }}
            className="text-display text-white"
          >
            Sondermodelle & Preisaktionen
          </motion.h1>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FILTER TABS                                                 */}
      {/* ============================================================ */}
      <section className="sticky top-0 z-40 bg-neutral-50/80 backdrop-blur-xl border-b border-neutral-200/50 py-4 mb-12">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
          <nav className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mb-2" aria-label="Angebotsfilter">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 select-none outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2',
                  activeTab === tab.key
                    ? 'bg-neutral-900 text-white shadow-md'
                    : 'bg-transparent text-neutral-600 hover:bg-neutral-200/50 hover:text-neutral-900'
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  PROMO BANNER                                                */}
      {/* ============================================================ */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 mb-16">
        <div className="w-full h-64 md:h-80 rounded-[2rem] overflow-hidden relative group shadow-sm">
           <img src="/images/angebote_banner.png" alt="Frühjahrs-Edition" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
           <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/90 via-neutral-900/60 to-transparent" />
           <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-center max-w-2xl z-10">
             <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">Frühjahrs-Edition 2026</h2>
             <p className="text-neutral-300 text-lg md:text-xl mb-8">Sichern Sie sich jetzt unsere exklusiven Sondermodelle mit bis zu 20% Preisvorteil. Nur für kurze Zeit verfügbar.</p>
             <button className="w-fit px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors">
               Jetzt anfragen
             </button>
           </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  VEHICLE GRID                                                */}
      {/* ============================================================ */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 pb-32">
        <div>
          <motion.p
            variants={{
              ...fadeUp,
              visible: {
                ...fadeUp.visible,
                transition: { duration: getDuration(0.6), ease: [0.16, 1, 0.3, 1] as const }
              }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-sm font-semibold text-neutral-500 mb-6"
          >
            <span className="text-neutral-900">{filtered.length}</span>{' '}
            Fahrzeuge gefunden
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {filtered.map((vehicle, i) => (
              <div key={vehicle.id} className="relative group">
                <VehicleCard vehicle={vehicle} index={i} />

                {/* Discount badge overlay every 3rd card */}
                {(i + 1) % 3 === 0 && (
                  <div className="absolute top-4 right-4 z-20 pointer-events-none">
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-md">
                      <Tag size={12} />
                      Aktion
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: getDuration(0.3) }}
              className="py-32 flex flex-col items-center justify-center text-center"
            >
              <p className="text-2xl font-display font-bold text-neutral-900 mb-2">Keine Fahrzeuge gefunden</p>
              <p className="text-neutral-500 max-w-sm">
                Versuchen Sie eine andere Filtereinstellung.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
