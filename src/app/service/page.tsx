'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wrench,
  Circle,
  ClipboardCheck,
  Paintbrush,
  Thermometer,
  Truck,
  Car,
  Zap,
  Phone,
  CalendarDays,
  Clock,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/cn';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface ServiceTile {
  icon: React.ElementType;
  title: string;
  desc: string;
  image: string;
}

const SERVICES: ServiceTile[] = [
  { icon: Wrench, title: 'Inspektion & Wartung', desc: 'Herstellerkonform, digital dokumentiert', image: '/images/svc_inspektion.png' },
  { icon: Circle, title: 'Reifenservice', desc: 'Wechsel, Lagerung, Neubestellung', image: '/images/svc_reifen.png' },
  { icon: ClipboardCheck, title: 'TÜV & HU', desc: 'Prüfung und Abnahme vor Ort', image: '/images/svc_tuev.png' },
  { icon: Paintbrush, title: 'Karosserie & Lack', desc: 'Spot-Repair bis Vollaufbereitung', image: '/images/svc_lack.png' },
  { icon: Thermometer, title: 'Klimaservice', desc: 'Desinfektion, Nachfüllung, Lecksuche', image: '/images/svc_klima.png' },
  { icon: Truck, title: 'Hol- & Bring-Service', desc: '25 km Umkreis, kostenlos ab Paket 2', image: '/images/svc_hol_bring.png' },
  { icon: Car, title: 'Ersatzwagen', desc: 'Sofort verfügbar, auch am Wochenende', image: '/images/svc_ersatzwagen.png' },
  { icon: Zap, title: 'Hochvolt-Werkstatt', desc: 'Zertifiziert für alle E-Modelle', image: '/images/svc_hochvolt.png' },
];

interface TeamMember {
  initials: string;
  name: string;
  role: string;
  years: number;
  image: string;
}

const TEAM: TeamMember[] = [
  { initials: 'KR', name: 'Klaus Reuter', role: 'Werkstattmeister', years: 22, image: '/images/team_kr.png' },
  { initials: 'TL', name: 'Tobias Lemke', role: 'Karosserie & Lack', years: 14, image: '/images/team_tl.png' },
  { initials: 'AV', name: 'Anja Vogt', role: 'Diagnose / Hochvolt', years: 8, image: '/images/team_av.png' },
  { initials: 'FM', name: 'Filip Marek', role: 'Reifen & Räder', years: 6, image: '/images/team_fm.png' },
];

const SERVICE_OPTIONS = [
  'Inspektion & Wartung',
  'Reifenservice',
  'TÜV & HU',
  'Karosserie & Lack',
  'Klimaservice',
  'Hochvolt-Service',
  'Sonstiges',
] as const;

const TIME_SLOTS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
] as const;

export default function ServicePage() {
  const fadeUp: any = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };

  const [selectedService, setSelectedService] = useState<string>('Inspektion & Wartung');
  const [vehicle, setVehicle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleBooking(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  }

  return (
    <main className="min-h-screen bg-neutral-50 pb-20">
      {/* ============================================================ */}
      {/*  HERO                                                        */}
      {/* ============================================================ */}
      <section className="relative pt-32 pb-20 bg-neutral-900 overflow-hidden min-h-[50vh] flex items-end">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/images/hero-service.png')] bg-cover bg-center opacity-30 mix-blend-luminosity grayscale" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-50 via-neutral-50/20 to-transparent" />
        </div>
        <div className="relative max-w-[1400px] mx-auto px-4 md:px-8 w-full">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-xs font-semibold uppercase tracking-wider text-red-500 mb-4 flex items-center gap-3"
          >
            <span className="w-8 h-[1px] bg-red-600" /> Werkstatt seit 1986
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 max-w-3xl leading-[1.1]"
          >
            Wir kennen jedes Detail.
          </motion.h1>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  STATS ROW                                                   */}
      {/* ============================================================ */}
      <section className="bg-white border-b border-neutral-200/60 py-12 md:py-16">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="max-w-[1400px] mx-auto px-4 md:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
        >
          {[
            { value: '15', label: 'Mitarbeiter' },
            { value: '1.800', label: 'm² Werkstatt' },
            { value: '38', label: 'Jahre' },
            { value: '4.9', label: 'Google Bewertung', prefix: '★' },
          ].map((stat) => (
            <motion.div key={stat.label} variants={fadeUp} className="flex flex-col items-center text-center">
              <span className="font-display text-4xl md:text-5xl font-bold text-neutral-900 mb-2 tracking-tight">
                {stat.prefix && <span className="text-red-600 text-3xl mr-1">{stat.prefix}</span>}
                {stat.value}
              </span>
              <span className="text-sm font-semibold uppercase tracking-wider text-neutral-500">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  SERVICES GRID                                               */}
      <section className="py-24 max-w-[1400px] mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-red-600 mb-3 flex items-center gap-3">
            <span className="w-8 h-[1px] bg-red-600" /> Leistungen
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-neutral-900">Alles aus einer Hand.</h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {SERVICES.map((svc) => {
            const Icon = svc.icon;
            return (
              <motion.div
                key={svc.title}
                variants={fadeUp}
                className="group flex flex-col rounded-3xl bg-white border border-neutral-200/60 shadow-sm transition-all hover:shadow-xl hover:shadow-neutral-200/50 hover:-translate-y-1 overflow-hidden"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                  <img src={svc.image} alt={svc.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 backdrop-blur text-neutral-900 shadow-sm">
                    <Icon size={20} />
                  </div>
                </div>
                <div className="p-6 md:p-8 flex-grow">
                  <h3 className="font-display text-xl font-bold text-neutral-900 tracking-tight mb-2 group-hover:text-red-600 transition-colors">{svc.title}</h3>
                  <p className="text-[15px] leading-relaxed text-neutral-500">{svc.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  EMERGENCY / NOTDIENST                                       */}
      {/* ============================================================ */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 mb-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl bg-neutral-900 px-6 py-12 md:p-16 flex flex-col lg:flex-row lg:items-center justify-between gap-10 border border-neutral-800"
        >
          {/* Background Elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[400px] h-[400px] bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex items-start gap-6 z-10">
            {/* pulsing red dot */}
            <span className="relative flex h-4 w-4 mt-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.6)]" />
            </span>
            <div>
              <h3 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">Notdienst 24/7</h3>
              <p className="text-lg text-neutral-400">Wir sind immer für Sie da — rund um die Uhr.</p>
            </div>
          </div>

          <a
            href="tel:+4917641195301"
            className="relative z-10 inline-flex items-center justify-center gap-3 rounded-full bg-red-600 px-8 py-5 text-lg font-semibold text-white transition-all hover:bg-red-700 hover:shadow-xl hover:shadow-red-600/20 active:scale-95 whitespace-nowrap lg:w-auto w-full"
          >
            <Phone size={20} />
            <span className="font-mono tracking-tight">0176 41195301</span>
          </a>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  BOOKING WIDGET                                              */}
      {/* ============================================================ */}
      <section className="bg-white border-y border-neutral-200/60 py-24">
        <div className="max-w-[800px] mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-red-600 mb-3 justify-center flex items-center gap-3">
              <span className="w-8 h-[1px] bg-red-600" /> Online-Terminbuchung <span className="w-8 h-[1px] bg-red-600" />
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-neutral-900">Termin vereinbaren</h2>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleBooking}
            className="relative flex flex-col gap-10 rounded-3xl bg-neutral-50 border border-neutral-200/60 p-6 md:p-10 shadow-sm"
          >
            {/* Service chip selector */}
            <div>
              <label className="text-[13px] font-bold uppercase tracking-wider text-neutral-900 mb-4 block">Serviceleistung</label>
              <div className="flex flex-wrap gap-2">
                {SERVICE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSelectedService(opt)}
                    className={cn(
                      "px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border",
                      selectedService === opt
                        ? "bg-neutral-900 text-white border-neutral-900"
                        : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle */}
            <div>
              <label htmlFor="bk-vehicle" className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
                <Car size={14} className="text-neutral-400" /> Fahrzeug
              </label>
              <input
                id="bk-vehicle"
                type="text"
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                placeholder="z. B. Audi A4 Avant 2.0 TDI"
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-[15px] text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100"
                required
              />
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="bk-date" className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
                  <CalendarDays size={14} className="text-neutral-400" />
                  Wunschtermin
                </label>
                <input
                  id="bk-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-[15px] text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100"
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
                  <Clock size={14} className="text-neutral-400" />
                  Uhrzeit
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTime(slot)}
                      className={cn(
                        "px-2 py-2.5 rounded-lg text-sm font-semibold transition-all border",
                        time === slot
                          ? "bg-neutral-900 text-white border-neutral-900"
                          : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                      )}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-8 py-4 text-[15px] font-semibold text-white transition-all hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/20 active:scale-95"
            >
              <Send size={18} />
              Termin anfragen
            </button>

            {/* Toast */}
            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white shadow-xl"
                >
                  <CheckCircle2 size={18} className="text-green-400" />
                  Terminanfrage gesendet.
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  WORKSHOP TEAM                                               */}
      {/* ============================================================ */}
      <section className="py-24 max-w-[1400px] mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-red-600 mb-3 flex items-center gap-3">
            <span className="w-8 h-[1px] bg-red-600" /> Unser Team
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-neutral-900">Die Werkstatt-Crew</h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {TEAM.map((member) => (
            <motion.div
              key={member.initials}
              variants={fadeUp}
              className="flex flex-col items-center text-center p-8 rounded-3xl bg-white border border-neutral-200/60 shadow-sm"
            >
              {/* Avatar */}
              <div className="h-32 w-32 rounded-full overflow-hidden shadow-md mb-6 border-4 border-white bg-neutral-100">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-display text-xl font-bold text-neutral-900 tracking-tight mb-1">{member.name}</h4>
                <p className="text-[13px] font-semibold uppercase tracking-wider text-red-600 mb-3">{member.role}</p>
                <p className="text-sm text-neutral-500 font-medium">
                  <span className="font-mono text-neutral-900 font-bold">{member.years}</span> Jahre Erfahrung
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </main>
  );
}
