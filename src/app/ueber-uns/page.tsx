'use client';

import { motion } from 'framer-motion';
import {
  Diamond,
  Handshake,
  HeartHandshake,
  Lightbulb,
  Quote,
} from 'lucide-react';
import { Placeholder } from '@/components/ui/placeholder';
import { cn } from '@/lib/cn';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface Milestone {
  year: string;
  title: string;
  image: string;
}

const TIMELINE: Milestone[] = [
  { year: '1986', title: 'Gründung', image: '/images/ueber_uns_ms_1986.png' },
  { year: '1994', title: 'Erweiterung', image: '/images/ueber_uns_ms_1994.png' },
  { year: '2001', title: 'ISO-Zertifizierung', image: '/images/ueber_uns_ms_2001.png' },
  { year: '2008', title: 'Premium-Partnerschaft', image: '/images/ueber_uns_ms_2008.png' },
  { year: '2015', title: 'Digitalisierung', image: '/images/ueber_uns_ms_2015.png' },
  { year: '2022', title: 'E-Mobilität', image: '/images/ueber_uns_ms_2022.png' },
  { year: '2026', title: 'Relaunch', image: '/images/ueber_uns_ms_2026.png' },
];

interface ValueCard {
  icon: React.ElementType;
  title: string;
  desc: string;
}

const VALUES: ValueCard[] = [
  { icon: Diamond, title: 'Qualität', desc: 'Wir verkaufen nur Fahrzeuge, hinter denen wir persönlich stehen. Jedes Fahrzeug durchläuft eine 200-Punkte-Prüfung.' },
  { icon: Handshake, title: 'Vertrauen', desc: 'Transparenz bei Preisen, Historie und Zustand. Keine versteckten Kosten, keine Überraschungen.' },
  { icon: HeartHandshake, title: 'Service', desc: 'Von der Probefahrt bis zur Wartung — ein Ansprechpartner, der Sie kennt und Ihr Fahrzeug versteht.' },
  { icon: Lightbulb, title: 'Innovation', desc: 'Hochvolt-Werkstatt, digitale Fahrzeugakte, Online-Terminbuchung — wir investieren in Ihre Zukunft.' },
];

interface TeamMember {
  initials: string;
  name: string;
  role: string;
  image: string;
}

const KEY_TEAM: TeamMember[] = [
  { initials: 'CA', name: 'Carla Apex', role: 'Geschäftsführerin', image: '/images/team_ca.png' },
  { initials: 'MR', name: 'Michael Roth', role: 'Vertriebsleitung', image: '/images/team_mr.png' },
  { initials: 'SB', name: 'Sabine Becker', role: 'Kundenbetreuung', image: '/images/team_sb.png' },
];

export default function UeberUnsPage() {
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
    visible: { transition: { staggerChildren: 0.1 } },
  };

  return (
    <main className="min-h-screen bg-neutral-50 pb-20">
      {/* ============================================================ */}
      {/*  HERO                                                        */}
      {/* ============================================================ */}
      <section className="relative pt-32 pb-20 bg-neutral-900 overflow-hidden min-h-[50vh] flex items-end">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/images/hero-ueber-uns.png')] bg-cover bg-center opacity-30 mix-blend-luminosity grayscale" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-50 via-neutral-50/20 to-transparent" />
        </div>
        <div className="relative max-w-[1400px] mx-auto px-4 md:px-8 w-full">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-xs font-semibold uppercase tracking-wider text-red-500 mb-4 flex items-center gap-3"
          >
            <span className="w-8 h-[1px] bg-red-600" /> Seit 1986 · Wetzlar
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 max-w-3xl leading-[1.1]"
          >
            Drei Generationen. Eine Überzeugung.
          </motion.h1>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  EDITORIAL 2-COLUMN                                          */}
      {/* ============================================================ */}
      <section className="py-24 max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left — image placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-white/50 rounded-3xl -z-10" />
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <img src="/images/ueber_uns_showroom.png" alt="Showroom 1986" className="w-full h-full object-cover" />
            </div>
          </motion.div>

          {/* Right — text with drop cap */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-red-600 mb-6 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-red-600" /> Unsere Geschichte
            </p>

            <div className="text-lg leading-relaxed text-neutral-600 space-y-6 mb-10">
              <p>
                <span className="float-left text-7xl font-display font-bold leading-[0.8] mr-3 mt-1 text-neutral-900">
                  A
                </span>
                ls Heinrich Apex im Frühjahr 1986 die Tore seiner kleinen Werkstatt an der
                Hermann-Löns-Straße öffnete, war sein Versprechen simpel: Ehrliche Arbeit,
                faire Preise, und ein Handschlag, auf den man sich verlassen kann. Was als
                Einmann-Betrieb begann, wuchs über drei Generationen zu einem der
                renommiertesten Premium-Autohäuser in Mittelhessen.
              </p>
              <p>
                Heute vereinen wir auf 1.800 m² Werkstatt und Showroom alles unter einem Dach:
                Verkauf, Service, Finanzierung und eine zertifizierte Hochvolt-Werkstatt für die
                Elektromobilität der Zukunft. Unser Team aus 15 Mitarbeiterinnen und Mitarbeitern
                betreut mehr als 4.000 Kundinnen und Kunden pro Jahr.
              </p>
            </div>

            {/* Blockquote */}
            <blockquote className="relative p-8 rounded-3xl bg-white border border-neutral-200/60 shadow-sm">
              <Quote size={32} className="absolute top-6 left-6 text-red-100" />
              <div className="relative z-10 pl-4">
                <p className="text-xl font-display font-medium text-neutral-900 leading-snug mb-6">
                  &ldquo;Mein Großvater hat gesagt: Verkauf ist Vertrauen. Wir leben das —
                  in jedem Gespräch, jedem Service, jedem Fahrzeug, das unser Haus verlässt.&rdquo;
                </p>
                <footer className="text-sm text-neutral-500 font-medium">
                  — <strong className="text-neutral-900 font-bold">Carla Apex</strong>, Geschäftsführerin
                </footer>
              </div>
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  TIMELINE                                                    */}
      {/* ============================================================ */}
      <section className="bg-neutral-900 py-24 border-y border-neutral-800">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-20 text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-red-500 mb-3 flex items-center justify-center gap-3">
              <span className="w-8 h-[1px] bg-red-600" /> Meilensteine <span className="w-8 h-[1px] bg-red-600" />
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white">Unser Weg</h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="relative max-w-4xl mx-auto"
          >
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-neutral-800 -translate-x-1/2" />

            <div className="flex flex-col gap-12">
              {TIMELINE.map((ms, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <motion.div
                    key={ms.year}
                    variants={fadeUp}
                    className="relative flex items-center w-full"
                  >
                    {/* Dot */}
                    <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-red-600 border-4 border-neutral-900 -translate-x-1/2 z-10" />

                    {/* Left column (Desktop only) */}
                    <div className={cn(
                      "hidden md:block w-1/2 pr-12 text-right",
                      !isLeft && "invisible"
                    )}>
                      {isLeft && (
                        <div className="flex flex-col items-end gap-4">
                          <div className="text-right">
                            <span className="block font-mono text-2xl font-bold text-neutral-400 mb-1">{ms.year}</span>
                            <p className="font-display text-xl font-bold text-white tracking-tight">{ms.title}</p>
                          </div>
                          <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-lg border border-neutral-800">
                            <img src={ms.image} alt={ms.title} className="w-full h-auto object-cover aspect-[16/9]" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right column (Desktop only) */}
                    <div className={cn(
                      "hidden md:block w-1/2 pl-12 text-left",
                      isLeft && "invisible"
                    )}>
                      {!isLeft && (
                        <div className="flex flex-col items-start gap-4">
                          <div className="text-left">
                            <span className="block font-mono text-2xl font-bold text-neutral-400 mb-1">{ms.year}</span>
                            <p className="font-display text-xl font-bold text-white tracking-tight">{ms.title}</p>
                          </div>
                          <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-lg border border-neutral-800">
                            <img src={ms.image} alt={ms.title} className="w-full h-auto object-cover aspect-[16/9]" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Mobile layout */}
                    <div className="md:hidden pl-16 pr-4 w-full flex flex-col gap-3 pb-6">
                      <div>
                        <span className="block font-mono text-lg font-bold text-neutral-400 mb-0.5">{ms.year}</span>
                        <p className="font-display text-lg font-bold text-white tracking-tight">{ms.title}</p>
                      </div>
                      <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-neutral-800">
                        <img src={ms.image} alt={ms.title} className="w-full h-auto object-cover aspect-[16/9]" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  VALUES                                                      */}
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
            <span className="w-8 h-[1px] bg-red-600" /> Werte
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-neutral-900">Wofür wir stehen</h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {VALUES.map((v) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={v.title}
                variants={fadeUp}
                className="group flex flex-col p-8 rounded-3xl bg-white border border-neutral-200/60 shadow-sm transition-all hover:shadow-xl hover:shadow-neutral-200/50 hover:-translate-y-1"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-50 text-neutral-900 mb-6 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                  <Icon size={24} />
                </div>
                <h3 className="font-display text-xl font-bold text-neutral-900 tracking-tight mb-3">{v.title}</h3>
                <p className="text-[15px] leading-relaxed text-neutral-500">{v.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  TEAM                                                        */}
      {/* ============================================================ */}
      <section className="bg-white border-t border-neutral-200/60 py-24">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16 text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-red-600 mb-3 justify-center flex items-center gap-3">
              <span className="w-8 h-[1px] bg-red-600" /> Führungsteam <span className="w-8 h-[1px] bg-red-600" />
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-neutral-900">Die Menschen hinter Apex</h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="flex flex-wrap justify-center gap-6 md:gap-8"
          >
            {KEY_TEAM.map((member) => (
              <motion.div
                key={member.initials}
                variants={fadeUp}
                className="flex flex-col items-center text-center p-8 rounded-3xl bg-neutral-50 border border-neutral-200/60 shadow-sm w-[280px]"
              >
                {/* Image avatar */}
                <div className="h-32 w-32 rounded-full overflow-hidden shadow-md mb-6 border-4 border-white">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-display text-xl font-bold text-neutral-900 tracking-tight mb-1">{member.name}</h4>
                  <p className="text-[13px] font-semibold uppercase tracking-wider text-red-600">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
