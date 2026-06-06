'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useMotionTokens } from '@/lib/motion';

const STAGGER_DELAY = 0.06;

const FADE_UP = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

interface HeroStat {
  value: string;
  label: string;
}

const STATS: HeroStat[] = [
  { value: '280+', label: 'Fahrzeuge' },
  { value: '42', label: 'Premium-Marken' },
  { value: '4.9/5', label: 'Trustpilot' },
  { value: '1986', label: 'Familiengeführt' },
];

function AnimatedHeadline() {
  const text = 'Fahrzeuge, die Geschichten';
  const lastWord = 'schreiben.';
  const words = text.split(' ');

  return (
    <h1 className="font-display text-5xl md:text-6xl lg:text-[5.5rem] font-bold tracking-tight text-white leading-[1.05] mb-6">
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={{
            hidden: { opacity: 0, y: 40, rotateX: 20 },
            visible: { opacity: 1, y: 0, rotateX: 0 },
          }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 20,
            delay: i * STAGGER_DELAY,
          }}
          className="inline-block mr-3 lg:mr-5"
          style={{ transformOrigin: 'bottom' }}
        >
          {word}
        </motion.span>
      ))}
      <br className="hidden md:block" />
      <motion.span
        variants={{
          hidden: { opacity: 0, y: 40, rotateX: 20 },
          visible: { opacity: 1, y: 0, rotateX: 0 },
        }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
          delay: words.length * STAGGER_DELAY,
        }}
        className="inline-block text-red-600 mt-2 md:mt-4"
      >
        {lastWord}
      </motion.span>
    </h1>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const vehicleY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const vehicleScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.6], [0, 100]);

  return (
    <section ref={sectionRef} className="relative h-screen min-h-[800px] w-full overflow-hidden bg-neutral-950">
      
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: vehicleY, scale: vehicleScale }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-[center_top_30%] parallax-bg"
          style={{ backgroundImage: 'url("/images/hero-bg.png")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-transparent to-transparent" />
      </motion.div>

      {/* Content Wrapper */}
      <motion.div
        className="relative z-10 flex h-full w-full items-center lg:items-end pb-32 md:pb-40 lg:pb-24 pt-32 lg:pt-48"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
            }}
            className="max-w-3xl"
          >
            {/* Eyebrow */}
            <motion.p
              variants={FADE_UP}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-6 flex items-center gap-3"
            >
              <span className="w-8 h-[1px] bg-red-600" />
              Neue Kollektion · Frühjahr 2026
            </motion.p>

            {/* Headline */}
            <AnimatedHeadline />

            {/* Description */}
            <motion.p
              variants={FADE_UP}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="text-lg md:text-xl text-neutral-300 leading-relaxed max-w-2xl mt-8"
            >
              Über 280 sorgfältig kuratierte Premium-Fahrzeuge — vom Jahreswagen bis zum
              Sondermodell. Ohne Schreierei. Ohne Kompromisse.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={FADE_UP}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="mt-12 flex flex-wrap gap-4"
            >
              <Link
                href="/fahrzeuge"
                className="group flex items-center gap-2 rounded-full bg-red-600 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/20 active:scale-95"
              >
                Jetzt entdecken
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/probefahrt"
                className="flex items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/10 hover:border-white/30 active:scale-95"
              >
                Termin vereinbaren
              </Link>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              variants={FADE_UP}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-10"
            >
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="font-mono text-3xl font-bold tracking-tight text-white mb-2">
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-neutral-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
