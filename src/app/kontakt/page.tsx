'use client';

import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  Clock,
  Globe,
} from 'lucide-react';
import { cn } from '@/lib/cn';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface ContactPill {
  icon: React.ElementType;
  label: string;
  value: string;
  href: string;
}

const PILLS: ContactPill[] = [
  { icon: Phone, label: 'Anrufen', value: '0176 41195301', href: 'tel:+4917641195301' },
  { icon: Mail, label: 'Schreiben', value: 'umut@codayweb.de', href: 'mailto:umut@codayweb.de' },
  { icon: Globe, label: 'Webseite', value: 'codayweb.de', href: 'https://codayweb.de' },
];

const BETREFF_OPTIONS = [
  'Allgemeine Anfrage',
  'Fahrzeuganfrage',
  'Probefahrt',
  'Service',
  'Finanzierung',
  'Sonstiges',
] as const;

interface OpeningHour {
  day: string;
  time: string;
  closed?: boolean;
}

const HOURS: OpeningHour[] = [
  { day: 'Montag – Freitag', time: '08:00 – 18:00' },
  { day: 'Samstag', time: '09:00 – 17:00' },
  { day: 'Sonntag', time: 'Geschlossen', closed: true },
];

export default function KontaktPage() {
  const fadeUp: any = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } };
  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

  return (
    <main className="min-h-screen bg-neutral-50 pb-20">
      {/* ============================================================ */}
      {/*  HERO                                                        */}
      {/* ============================================================ */}
      <section className="relative pt-32 pb-20 bg-neutral-900 overflow-hidden min-h-[50vh] flex items-end">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/images/hero-kontakt.png')] bg-cover bg-center opacity-30 mix-blend-luminosity grayscale" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-50 via-neutral-50/20 to-transparent" />
        </div>
        <div className="relative max-w-[1400px] mx-auto px-4 md:px-8 w-full">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-xs font-semibold uppercase tracking-wider text-red-500 mb-4 flex items-center gap-3"
          >
            <span className="w-8 h-[1px] bg-red-600" /> Kontakt
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 max-w-3xl leading-[1.1]"
          >
            Sprechen Sie mit uns.
          </motion.h1>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CONTACT PILLS                                               */}
      {/* ============================================================ */}
      <section className="bg-white border-b border-neutral-200/60 py-12">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="max-w-[1400px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {PILLS.map((pill) => {
            const Icon = pill.icon;
            return (
              <motion.a
                key={pill.label}
                variants={fadeUp}
                href={pill.href}
                className="group flex items-center gap-5 p-6 rounded-2xl bg-neutral-50 border border-neutral-100 transition-all hover:bg-white hover:border-neutral-200 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-50 text-red-600 transition-colors group-hover:bg-red-600 group-hover:text-white">
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-[13px] font-bold uppercase tracking-wider text-neutral-500 mb-1">{pill.label}</p>
                  <p className={cn(
                    "font-display text-xl font-bold tracking-tight text-neutral-900 transition-colors group-hover:text-red-600",
                    pill.icon === Phone && "font-mono font-semibold"
                  )}>
                    {pill.value}
                  </p>
                </div>
              </motion.a>
            );
          })}
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  MAP PLACEHOLDER + HOURS                                     */}
      {/* ============================================================ */}
      <section className="py-24 max-w-[1400px] mx-auto px-4 md:px-8" id="karte">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Stylized map */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[400px] lg:h-[600px] rounded-3xl bg-neutral-900 overflow-hidden flex items-center justify-center shadow-xl border border-neutral-800"
          >
            <img src="/images/kontakt_map.png" alt="Standort Karte" className="absolute inset-0 w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-neutral-900/40" />

            {/* Red pin */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="h-6 w-1 rounded-full bg-red-600/50 mb-1" />
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.6)] z-20">
                <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
              </div>
              <div className="mt-4 px-6 py-4 rounded-2xl bg-black/80 backdrop-blur-md border border-white/10 text-center shadow-2xl">
                <span className="block font-display text-lg font-bold text-white tracking-tight mb-1">Apex Motors</span>
                <span className="block text-sm text-white/70">Hermann-Löns-Str. 14<br />35578 Wetzlar</span>
              </div>
            </div>

            {/* Subtle radial glow */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-neutral-900 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          </motion.div>

          {/* Opening hours */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col p-8 md:p-12 rounded-3xl bg-white border border-neutral-200/60 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
                <Clock size={24} />
              </div>
              <h3 className="font-display text-3xl font-bold tracking-tight text-neutral-900">Öffnungszeiten</h3>
            </div>

            <table className="w-full mb-8">
              <tbody>
                {HOURS.map((h) => (
                  <tr key={h.day} className="border-b border-neutral-100 last:border-0">
                    <td className="py-4 text-[15px] font-bold text-neutral-900">{h.day}</td>
                    <td className={cn(
                      "py-4 text-right text-[15px] font-medium font-mono",
                      h.closed ? "text-neutral-400" : "text-neutral-700"
                    )}>
                      {h.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-auto p-6 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm leading-relaxed text-neutral-600">
              <p>
                Feiertage abweichend. Notdienst rund um die Uhr unter{' '}
                <a href="tel:+4917641195301" className="font-bold text-red-600 hover:text-red-700 hover:underline transition-all">
                  0176 41195301
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
