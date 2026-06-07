'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useAnimation, useDragControls } from 'framer-motion';

export function WhatsappButton() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragControls = useDragControls();
  
  // Track window size for constraints
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    // Prevent click if we were dragging
    if (isDragging) {
      e.preventDefault();
      return;
    }
    
    // Open WhatsApp
    window.open('https://wa.me/4917641195301', '_blank', 'noopener,noreferrer');
  };

  if (windowSize.width === 0) return null; // Don't render until we know window size to prevent hydration mismatch on constraints

  const BUTTON_SIZE = 64; // 16 * 4 (w-16 h-16)
  const PADDING = 24; // Distance from edge

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[100]" 
      ref={containerRef}
    >
      <motion.button
        type="button"
        onClick={handleClick}
        drag
        dragControls={dragControls}
        dragElastic={0.4} // Adds the bouncy rubber-band effect when pulled past edges
        dragTransition={{ bounceStiffness: 400, bounceDamping: 15 }} // Bouncy physics after letting go
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => {
          // Small delay before allowing clicks again so mouseup doesn't trigger click
          setTimeout(() => setIsDragging(false), 150);
        }}
        dragConstraints={{
          top: PADDING,
          left: PADDING,
          right: windowSize.width - BUTTON_SIZE - PADDING,
          bottom: windowSize.height - BUTTON_SIZE - PADDING,
        }}
        // Start bottom-right
        initial={{ x: windowSize.width - BUTTON_SIZE - PADDING, y: windowSize.height - BUTTON_SIZE - PADDING, scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="pointer-events-auto absolute flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-[#128C7E] to-[#25D366] text-white shadow-[0_0_30px_rgba(37,211,102,0.4)] border border-white/20 backdrop-blur-md transition-shadow hover:shadow-[0_0_40px_rgba(37,211,102,0.6)] outline-none touch-none"
        aria-label="Kontakt per WhatsApp"
      >
        {/* WhatsApp Icon SVG */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="32" 
          height="32" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>
      </motion.button>
    </div>
  );
}
