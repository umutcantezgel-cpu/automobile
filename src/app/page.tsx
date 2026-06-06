import Link from 'next/link';
import {
  ArrowRight,
  Wrench,
  Calculator,
  RefreshCw,
  Shield,
  Star,
  Car,
  Users,
  Award,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatPrice, formatKm } from '@/lib/format';
import { VEHICLES, BRANDS } from '@/lib/mock/vehicles';
import type { Vehicle } from '@/types/inventory';

import { Hero } from '@/components/sections/hero';
import { QuickSearch } from '@/components/sections/quick-search';
import { VehicleCard } from '@/components/sections/vehicle-card';

/* ================================================================== */
/*  BigFeatured Card — Premium Bento Layout                            */
/* ================================================================== */

function BigFeatured({ vehicle }: { vehicle: Vehicle }) {
  return (
    <article className="group relative flex flex-col md:flex-row overflow-hidden rounded-2xl bg-white border border-neutral-200/60 shadow-sm transition-all hover:shadow-xl hover:shadow-neutral-200/50 lg:col-span-2">
      {/* Image Area */}
      <Link href={`/fahrzeuge/${vehicle.id}`} className="relative w-full md:w-3/5 aspect-[4/3] md:aspect-auto overflow-hidden bg-neutral-100">
        {vehicle.images && vehicle.images.length > 0 ? (
          <img
            src={vehicle.images[0]}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className={cn("veh-img absolute inset-0 transition-transform duration-700 group-hover:scale-105", vehicle.imgAlt)}>
            <div className="veh-img-shape" />
            <div className="veh-img-grid" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
        
        {vehicle.images && vehicle.images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
            {vehicle.images.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "h-1.5 rounded-full shadow-sm transition-all duration-300", 
                  i === 0 ? "w-6 bg-white" : "w-1.5 bg-white/50"
                )} 
              />
            ))}
          </div>
        )}
        
        {/* Badge */}
        {vehicle.tag && (
          <span className="absolute top-4 left-4 inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-neutral-900 shadow-sm">
            {vehicle.tag}
          </span>
        )}
      </Link>

      {/* Content Area */}
      <div className="flex flex-1 flex-col justify-between p-6 md:p-8 lg:p-10">
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-red-600">
            Showroom Highlight
          </div>
          <h3 className="font-display text-2xl lg:text-3xl font-bold text-neutral-900 mb-2 leading-tight">
            {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-neutral-500 text-sm md:text-base leading-relaxed line-clamp-2 mb-6">
            {vehicle.variant}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-neutral-600">
            <span className="flex items-center gap-1.5"><GaugeIcon className="w-4 h-4 text-neutral-400" /> {formatKm(vehicle.km)}</span>
            <span className="text-neutral-300">•</span>
            <span className="flex items-center gap-1.5"><CalendarIcon className="w-4 h-4 text-neutral-400" /> {vehicle.year}</span>
            <span className="text-neutral-300">•</span>
            <span className="flex items-center gap-1.5"><PowerIcon className="w-4 h-4 text-neutral-400" /> {vehicle.hp} PS</span>
          </div>
        </div>

        <div className="mt-8 flex items-end justify-between border-t border-neutral-100 pt-6">
          <div>
            {vehicle.oldPrice && (
              <div className="text-sm text-neutral-400 line-through mb-0.5">
                {formatPrice(vehicle.oldPrice)}
              </div>
            )}
            <div className="font-display text-2xl lg:text-3xl font-bold text-neutral-900">
              {formatPrice(vehicle.price)}
            </div>
            {vehicle.monthly && (
              <div className="text-sm font-medium text-neutral-500 mt-1">
                ab {formatPrice(vehicle.monthly)} mtl.
              </div>
            )}
          </div>
          <Link href={`/fahrzeuge/${vehicle.id}`} className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-red-600">
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}

// Mini SVG Icons for BigFeatured
const GaugeIcon = ({className}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
);
const CalendarIcon = ({className}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);
const PowerIcon = ({className}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.04"/></svg>
);

/* ================================================================== */
/*  Main Homepage                                                      */
/* ================================================================== */

export default function HomePage() {
  const featuredVehicles = VEHICLES.slice(0, 5);
  const bigFeatured = featuredVehicles[0];
  const restFeatured = featuredVehicles.slice(1);

  return (
    <div className="bg-neutral-50 pb-20">
      
      {/* Hero Section */}
      <Hero />

      {/* Quick Search overlap */}
      <section className="relative z-20 -mt-16 mb-20 max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="rounded-2xl bg-white p-6 md:p-8 shadow-2xl shadow-black/5 ring-1 ring-black/5">
          <QuickSearch />
        </div>
      </section>

      {/* Featured Vehicles Grid */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-20">
        <div className="mb-12">
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">
            <span className="w-8 h-[1px] bg-red-600" />
            01 · Featured
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight">
            Aktuell im Showroom
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <BigFeatured vehicle={bigFeatured} />
          {restFeatured.map((vehicle) => (
            <div key={vehicle.id} className="h-full">
              <VehicleCard vehicle={vehicle} />
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/fahrzeuge" className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-8 py-4 text-sm font-semibold text-neutral-900 transition-all hover:border-neutral-300 hover:bg-neutral-50 active:scale-95">
            Alle Fahrzeuge ansehen <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Brands Marquee / Bar */}
      <section className="border-y border-neutral-200/60 bg-white py-10 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-8">
          <div className="text-sm font-semibold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
            Premium-Partner
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-12 gap-y-6 flex-1 opacity-60">
            {BRANDS.slice(0, 6).map((brand) => (
              <Link key={brand} href={`/fahrzeuge?marke=${brand.toLowerCase()}`} className="text-xl font-display font-medium text-neutral-800 transition-opacity hover:opacity-100">
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-24">
        <div className="mb-16">
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">
            <span className="w-8 h-[1px] bg-red-600" />
            02 · Services
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight">
            Mehr als nur Fahrzeuge
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              href: '/service',
              icon: <Wrench className="w-6 h-6" />,
              title: 'Werkstatt & Service',
              desc: 'Meisterwerkstatt für alle Marken. Inspektion, Reparatur und Aufbereitung.',
              cta: 'Details',
            },
            {
              href: '/finanzierung',
              icon: <Calculator className="w-6 h-6" />,
              title: 'Finanzierung',
              desc: 'Maßgeschneiderte Raten und Leasingangebote ab 2,99% eff. Jahreszins.',
              cta: 'Berechnen',
            },
            {
              href: '/inzahlungnahme',
              icon: <RefreshCw className="w-6 h-6" />,
              title: 'Inzahlungnahme',
              desc: 'Faire und transparente Bewertung Ihres aktuellen Fahrzeugs in 15 Minuten.',
              cta: 'Bewerten',
            },
            {
              href: '/service',
              icon: <Shield className="w-6 h-6" />,
              title: 'Garantie & Schutz',
              desc: 'Bis zu 36 Monate Premium-Garantie für maximale Sicherheit.',
              cta: 'Schutzpakete',
            },
          ].map((service, idx) => (
            <Link key={idx} href={service.href} className="group flex flex-col justify-between rounded-2xl bg-white p-8 border border-neutral-200/60 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
              <div>
                <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  {service.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-neutral-900 mb-3">{service.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{service.desc}</p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-red-600">
                {service.cta} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-neutral-900 py-24 text-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="mb-16">
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-4">
              <span className="w-8 h-[1px] bg-red-600" />
              03 · Stimmen
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
              Was Kund:innen über uns sagen.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "Vom ersten Kontakt bis zur Übergabe — ein Erlebnis, kein Prozess.",
                name: "M. Schreiber",
                car: "Audi RS6"
              },
              {
                quote: "Transparenz, Kompetenz, null Druck. So muss Autohandel sein.",
                name: "Dr. K. Lindner",
                car: "Porsche 911"
              },
              {
                quote: "Ich habe mein Traumauto gefunden und dabei mehr gespart als erwartet.",
                name: "A. Yilmaz",
                car: "Mercedes GLE"
              }
            ].map((t, i) => (
              <div key={i} className="rounded-2xl bg-white/5 border border-white/10 p-8 backdrop-blur-sm">
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-lg text-neutral-300 leading-relaxed mb-8">"{t.quote}"</p>
                <div>
                  <div className="font-semibold text-white">{t.name}</div>
                  <div className="text-sm text-neutral-500 mt-0.5">{t.car}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Counters */}
      <section className="border-b border-neutral-200/60 bg-white py-16">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x divide-neutral-100">
            {[
              { icon: <Award />, val: "38", label: "Jahre Erfahrung" },
              { icon: <Car />, val: "12.400+", label: "Fahrzeuge verkauft" },
              { icon: <Star />, val: "4,9/5", label: "Trustpilot Score" },
              { icon: <Users />, val: "15", label: "Experten im Team" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center px-4">
                <div className="text-neutral-300 mb-4 [&>svg]:w-8 [&>svg]:h-8">{stat.icon}</div>
                <div className="font-display text-4xl font-bold text-neutral-900 mb-2">{stat.val}</div>
                <div className="text-sm font-medium text-neutral-500 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
