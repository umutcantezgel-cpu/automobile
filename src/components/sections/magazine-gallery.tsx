'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
  RotateCw,
  Play,
  Maximize2,
} from 'lucide-react';
import type { VehicleMedia } from '@/types/inventory';
import { cn } from '@/lib/cn';

interface MagazineGalleryProps {
  make: string;
  model: string;
  variant: string;
  media: VehicleMedia;
  imgAlt: string;
  images?: string[];
  className?: string;
}

type GalleryTab = 'fotos' | '360' | 'video';

interface GalleryImage {
  id: number;
  label: string;
  altClass: string;
  src?: string;
}

function generateGalleryImages(
  make: string,
  model: string,
  imgAlt: string,
  count: number
): GalleryImage[] {
  const alts = ['alt-1', 'alt-2', 'alt-3', 'alt-4', 'alt-5', 'alt-6', 'alt-7'];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    label: `${make} ${model} — Bild ${i + 1}`,
    altClass: i === 0 ? imgAlt : alts[i % alts.length],
  }));
}

export function MagazineGallery({
  make,
  model,
  variant,
  media,
  imgAlt,
  images,
  className,
}: MagazineGalleryProps) {
  const [activeTab, setActiveTab] = useState<GalleryTab>('fotos');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const galleryItems: GalleryImage[] = images && images.length > 0
    ? images.map((src, i) => ({ id: i, label: `${make} ${model} — Bild ${i + 1}`, src, altClass: '' }))
    : generateGalleryImages(make, model, imgAlt, media.photoCount);

  const tileImages = galleryItems.slice(0, 5);
  const remainingCount = Math.max(0, galleryItems.length - 5);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % galleryItems.length);
  }, [galleryItems.length]);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  }, [galleryItems.length]);

  useEffect(() => {
    if (!lightboxOpen) return;

    function handleKey(e: KeyboardEvent) {
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowRight':
          goNext();
          break;
        case 'ArrowLeft':
          goPrev();
          break;
      }
    }

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [lightboxOpen, closeLightbox, goNext, goPrev]);

  const tileClasses = [
    'col-span-4 row-span-2 md:col-span-2 md:row-span-2 relative', // Hero
    'col-span-2 row-span-1 relative hidden md:block',
    'col-span-2 row-span-1 relative hidden md:block',
    'col-span-2 row-span-1 relative hidden lg:block',
    'col-span-2 row-span-1 relative hidden lg:block',
  ];

  const tabs: { key: GalleryTab; label: string; icon: React.ReactNode; count: number; available: boolean }[] = [
    {
      key: 'fotos',
      label: 'Fotos',
      icon: <Camera size={16} />,
      count: media.photoCount,
      available: true,
    },
    {
      key: '360',
      label: '360°',
      icon: <RotateCw size={16} />,
      count: media.has360 ? 1 : 0,
      available: media.has360,
    },
    {
      key: 'video',
      label: 'Video',
      icon: <Play size={16} />,
      count: media.hasVideo ? 1 : 0,
      available: media.hasVideo,
    },
  ];

  return (
    <>
      <div className={cn("relative rounded-3xl overflow-hidden bg-neutral-100", className)}>
        {/* Mosaic Grid */}
        <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-6 grid-rows-2 gap-1 h-[400px] md:h-[500px]">
          {tileImages.map((img, i) => (
            <button
              key={img.id}
              type="button"
              className={cn("group block w-full h-full relative overflow-hidden bg-neutral-200 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-600", tileClasses[i])}
              onClick={() => openLightbox(i)}
              aria-label={`${img.label} öffnen`}
            >
              <div className={cn("absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105", !img.src && img.altClass)}>
                {img.src ? (
                  <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-neutral-900/5 mix-blend-overlay" />
                )}
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />

              {/* Hero tile shade + meta */}
              {i === 0 && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-left">
                    <p className="text-sm font-medium text-white/80 mb-1">{variant}</p>
                    <p className="font-display text-2xl font-bold text-white leading-tight">
                      {make} {model}
                    </p>
                  </div>
                </>
              )}

              {/* Last tile "more" overlay */}
              {i === (tileImages.length - 1) && remainingCount > 0 && (
                <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-white transition-colors group-hover:bg-neutral-900/80">
                  <Maximize2 size={24} className="mb-2 opacity-80" />
                  <span className="font-display text-3xl font-bold mb-1">
                    +{remainingCount}
                  </span>
                  <span className="text-[10px] font-semibold tracking-widest uppercase opacity-80">
                    Bilder
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Media Toggle Controls (Floating) */}
        <div className="absolute top-6 right-6 flex items-center gap-2 p-1.5 rounded-full bg-black/40 backdrop-blur-xl shadow-lg ring-1 ring-white/10">
          {tabs
            .filter((t) => t.available)
            .map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all",
                  activeTab === tab.key 
                    ? "bg-white text-neutral-900 shadow-sm" 
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                )}
                onClick={() => setActiveTab(tab.key)}
                aria-label={`${tab.label} anzeigen`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className={cn(
                  "font-mono text-xs opacity-60 ml-1",
                  activeTab === tab.key && "text-neutral-500"
                )}>
                  {tab.count}
                </span>
              </button>
            ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-md flex items-center justify-center"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label="Bildergalerie"
          >
            {/* Close Button */}
            <button
              type="button"
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
              onClick={closeLightbox}
              aria-label="Galerie schließen"
            >
              <X size={24} />
            </button>

            {/* Previous */}
            <button
              type="button"
              className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              aria-label="Vorheriges Bild"
            >
              <ChevronLeft size={32} />
            </button>

            {/* Stage */}
            <div
              className="relative w-full max-w-6xl aspect-[16/9] px-24 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {galleryItems[lightboxIndex].src ? (
                <img 
                  src={galleryItems[lightboxIndex].src} 
                  alt={galleryItems[lightboxIndex].label}
                  className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" 
                />
              ) : (
                <div
                  className={cn(
                    "w-full h-full bg-cover bg-center rounded-xl shadow-2xl",
                    galleryItems[lightboxIndex].altClass
                  )}
                />
              )}
              <div className="absolute bottom-6 left-0 right-0 text-center">
                <span className="inline-block px-4 py-2 rounded-full bg-black/60 backdrop-blur-md text-white text-sm font-medium tracking-wide">
                  {make} {model} · {lightboxIndex + 1} / {galleryItems.length}
                </span>
              </div>
            </div>

            {/* Next */}
            <button
              type="button"
              className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              aria-label="Nächstes Bild"
            >
              <ChevronRight size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
