'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMotionTokens } from '@/lib/motion';
import type { ReactNode } from 'react';

const PAGE_VARIANTS = {
  hidden: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
} as const;

const REDUCED_PAGE_VARIANTS = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 },
} as const;

export default function Template({ children }: { children: ReactNode }) {
  const { getDuration, prefersReducedMotion } = useMotionTokens();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={prefersReducedMotion ? REDUCED_PAGE_VARIANTS : PAGE_VARIANTS}
        transition={{ duration: getDuration(0.4), ease: [0.42, 0, 0.58, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
