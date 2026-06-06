'use client';

import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Cpu,
  Sofa,
  Gauge,
  Check,
} from 'lucide-react';
import type { EquipmentGroups } from '@/types/inventory';
import { cn } from '@/lib/cn';

interface FeatureGridProps {
  eqGroups: EquipmentGroups;
  className?: string;
}

interface FeatureGroupConfig {
  key: keyof EquipmentGroups;
  title: string;
  icon: React.ReactNode;
  barPercent: number;
}

const GROUP_CONFIG: FeatureGroupConfig[] = [
  {
    key: 'assist',
    title: 'Assistenzsysteme',
    icon: <ShieldCheck size={18} />,
    barPercent: 92,
  },
  {
    key: 'info',
    title: 'Infotainment',
    icon: <Cpu size={18} />,
    barPercent: 88,
  },
  {
    key: 'komfort',
    title: 'Komfort & Interieur',
    icon: <Sofa size={18} />,
    barPercent: 95,
  },
  {
    key: 'perf',
    title: 'Performance & Fahrwerk',
    icon: <Gauge size={18} />,
    barPercent: 90,
  },
];

export function FeatureGrid({ eqGroups, className }: FeatureGridProps) {
  const containerVariants: any = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };
  
  const itemVariants: any = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", className)}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      {GROUP_CONFIG.map((group) => {
        const features = eqGroups[group.key];
        if (!features || features.length === 0) return null;

        return (
          <motion.div
            key={group.key}
            className="flex flex-col rounded-2xl bg-white border border-neutral-200/60 p-6 shadow-sm overflow-hidden"
            variants={itemVariants}
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600 flex-shrink-0">
                {group.icon}
              </div>
              <div>
                <h4 className="font-display text-lg font-bold text-neutral-900 tracking-tight leading-tight">
                  {group.title}
                </h4>
                <p className="text-[13px] font-medium text-neutral-500 mt-0.5">
                  <span className="font-mono text-neutral-900 font-bold">{features.length}</span>{' '}
                  Ausstattungsmerkmale
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 w-full bg-neutral-100 rounded-full overflow-hidden mb-6">
              <motion.div
                className="h-full bg-red-600 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: `${group.barPercent}%` }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.2,
                }}
              />
            </div>

            {/* Feature List */}
            <ul className="flex flex-col gap-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-[14px] text-neutral-700 leading-snug">
                  <Check
                    size={16}
                    className="text-neutral-300 mt-0.5 flex-shrink-0"
                    strokeWidth={2.5}
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
