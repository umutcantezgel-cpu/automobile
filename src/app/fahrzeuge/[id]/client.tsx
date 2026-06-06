'use client';

import { MagazineGallery } from '@/components/sections/magazine-gallery';
import { BuyingCard } from '@/components/sections/buying-card';
import { MarketPriceMeter } from '@/components/sections/market-price-meter';
import { FeatureGrid } from '@/components/sections/feature-grid';
import { Phone, Mail } from 'lucide-react';
import { SpecsTable } from '@/components/sections/specs-table';
import { DetailedTimeline } from '@/components/sections/detailed-timeline';
import { DealerSignals } from '@/components/sections/dealer-signals';
import type { Vehicle, Dealer } from '@/types/inventory';
import { cn } from '@/lib/cn';

interface VehicleDetailClientProps {
  vehicle: Vehicle;
  dealer: Dealer;
}

export function VehicleDetailClient({ vehicle, dealer }: VehicleDetailClientProps) {
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-10 pb-28 lg:pb-0">
        {/* Main Content Column */}
      <div className="flex-1 min-w-0 flex flex-col gap-12">
        {/* Magazine Gallery */}
        <MagazineGallery
          make={vehicle.make}
          model={vehicle.model}
          variant={vehicle.variant}
          media={vehicle.media}
          imgAlt={vehicle.imgAlt}
          images={vehicle.images}
        />

        {/* Market Price Meter */}
        <section aria-labelledby="market-heading">
          <h2 id="market-heading" className="font-display text-2xl font-bold text-neutral-900 mb-6 tracking-tight">
            Marktpreisanalyse
          </h2>
          <div className="rounded-2xl bg-white border border-neutral-200/60 p-6 shadow-sm">
            <MarketPriceMeter
              price={vehicle.price}
              rating={vehicle.priceRating}
            />
          </div>
        </section>

        {/* Feature Grid */}
        <section aria-labelledby="features-heading">
          <h2 id="features-heading" className="font-display text-2xl font-bold text-neutral-900 mb-6 tracking-tight">
            Ausstattung & Features
          </h2>
          <FeatureGrid eqGroups={vehicle.eqGroups} />
        </section>

        {/* Specs Table */}
        <section aria-labelledby="specs-heading">
          <h2 id="specs-heading" className="font-display text-2xl font-bold text-neutral-900 mb-6 tracking-tight">
            Technische Daten
          </h2>
          <SpecsTable vehicle={vehicle} />
        </section>

        {/* Detailed Timeline */}
        <section aria-labelledby="timeline-heading">
          <h2 id="timeline-heading" className="font-display text-2xl font-bold text-neutral-900 mb-6 tracking-tight">
            Fahrzeughistorie
          </h2>
          <DetailedTimeline vehicle={vehicle} />
        </section>

        {/* Dealer Signals — visible on mobile, hidden on desktop */}
        <section
          aria-labelledby="dealer-heading-mobile"
          className="lg:hidden"
        >
          <h2 id="dealer-heading-mobile" className="font-display text-2xl font-bold text-neutral-900 mb-6 tracking-tight">
            Ihr Ansprechpartner
          </h2>
          <DealerSignals dealer={dealer} />
        </section>
      </div>

      {/* Sidebar — Buying Card + Dealer (desktop only) */}
      <aside className="hidden lg:block w-[380px] xl:w-[420px] flex-shrink-0">
        <div className="sticky top-28 flex flex-col gap-8">
          <BuyingCard vehicle={vehicle} />

          <section aria-labelledby="dealer-heading-desktop">
            <h3 id="dealer-heading-desktop" className="font-display text-lg font-bold text-neutral-900 mb-4 tracking-tight">
              Händler
            </h3>
            <DealerSignals dealer={dealer} />
          </section>
        </div>
      </aside>
    </div>

    {/* Mobile Sticky Contact Bar */}
    <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-neutral-200/60 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] z-50 flex items-center gap-3 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
      <a 
        href={`tel:${dealer.phone.replace(/[^0-9+]/g, '')}`}
        className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-[15px] font-semibold text-neutral-900 shadow-sm transition-all active:scale-95 hover:bg-neutral-50"
      >
        <Phone size={18} className="text-neutral-500" />
        Anrufen
      </a>
      <a 
        href={`mailto:${dealer.email}?subject=Anfrage: ${vehicle.make} ${vehicle.model}`}
        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3.5 text-[15px] font-semibold text-white shadow-sm transition-all active:scale-95 hover:bg-red-700"
      >
        <Mail size={18} />
        Nachricht
      </a>
    </div>
    </>
  );
}
