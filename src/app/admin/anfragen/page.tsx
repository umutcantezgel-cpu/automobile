'use client';

import { motion } from 'framer-motion';
import { useMotionTokens } from '@/lib/motion';
import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/cn';

export default function AnfragenPage() {
  const { getDuration, getDelay, prefersReducedMotion } = useMotionTokens();

  const fadeUp: any = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: getDuration(0.4), ease: 'easeOut' as const },
    },
  };

  return (
    <motion.div
      className="adm-card"
      variants={fadeUp}
      initial="hidden"
      animate="show"
    >
      <div className="flex flex-col items-center justify-center gap-5 py-24 px-8 text-center">
        <div className="flex items-center justify-center w-20 h-20 rounded-xl bg-black/10 text-black">
          <MessageSquare size={48} />
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-lg font-semibold mb-2 font-display">
            Anfragen-Modul
          </h2>
          <p className="text-sm max-w-sm text-neutral-500">
            Dieses Modul wird in der nächsten Iteration ausgebaut.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
