import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ChevronRight,
  Calendar,
  Gauge,
  Activity,
  Fuel,
  MapPin,
  Zap,
  Timer,
  Palette,
  DoorOpen,
} from 'lucide-react';
import {
  formatPrice,
  formatKm,
  formatPower,
  formatAccel,
  formatTopSpeed,
} from '@/lib/format';
import { VEHICLES, DEALER } from '@/lib/mock/vehicles';
import type { Vehicle } from '@/types/inventory';
import { VehicleDetailClient } from './client';
import { cn } from '@/lib/cn';

export function generateStaticParams(): { id: string }[] {
  return VEHICLES.map((v) => ({ id: v.id }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const vehicle = VEHICLES.find((v) => v.id === id);
  if (!vehicle) {
    return { title: 'Fahrzeug nicht gefunden — Apex Motors' };
  }
  return {
    title: `${vehicle.make} ${vehicle.model} ${vehicle.variant} — Apex Motors`,
    description: vehicle.desc,
    openGraph: {
      title: `${vehicle.make} ${vehicle.model} — ${formatPrice(vehicle.price)}`,
      description: vehicle.desc,
    },
  };
}

interface QuickFactProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
}

function QuickFact({ icon, label, value, mono = true, accent = false }: QuickFactProps) {
  return (
    <div className={cn(
      "flex items-center gap-4 p-4 rounded-xl border border-neutral-100 bg-white transition-shadow hover:shadow-sm",
      accent && "bg-neutral-50 border-transparent"
    )}>
      <div className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0",
        accent ? "bg-red-100 text-red-600" : "bg-neutral-100 text-neutral-500"
      )}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-0.5">{label}</p>
        <p className={cn("text-[15px] font-bold text-neutral-900", mono && "font-mono")}>
          {value}
        </p>
      </div>
    </div>
  );
}

function SimilarCard({ vehicle, index }: { vehicle: Vehicle; index: number }) {
  return (
    <Link
      href={`/fahrzeuge/${vehicle.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-neutral-200/60 shadow-sm transition-all hover:shadow-xl hover:shadow-neutral-200/50 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
        {vehicle.images && vehicle.images.length > 0 ? (
          <img
            src={vehicle.images[0]}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div 
            className={cn("veh-img absolute inset-0 transition-transform duration-700 group-hover:scale-105", vehicle.imgAlt)}
          >
            <div className="veh-img-shape" />
            <div className="veh-img-grid" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h4 className="font-display font-bold text-neutral-900 line-clamp-1">
          {vehicle.make} {vehicle.model}
        </h4>
        <p className="text-sm text-neutral-500 line-clamp-1 mt-0.5 mb-3">{vehicle.variant}</p>
        <div className="flex items-center gap-3 text-xs font-medium text-neutral-500 mb-4">
          <span className="font-mono">{vehicle.year}</span>
          <span className="font-mono">{formatKm(vehicle.km)}</span>
          <span className="font-mono">{formatPower(vehicle.kw, vehicle.hp)}</span>
        </div>
        <div className="mt-auto pt-3 border-t border-neutral-100 font-display font-bold text-lg text-neutral-900">
          {formatPrice(vehicle.price)}
        </div>
      </div>
    </Link>
  );
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const { id } = await params;
  const vehicle = VEHICLES.find((v) => v.id === id);

  if (!vehicle) {
    notFound();
  }

  const similar = VEHICLES.filter(
    (v) =>
      v.id !== vehicle.id &&
      (v.make === vehicle.make || Math.abs(v.price - vehicle.price) < vehicle.price * 0.3)
  ).slice(0, 4);

  return (
    <main className="min-h-screen bg-neutral-50 pb-20 pt-24 md:pt-32">
      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mb-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-[13px] font-medium text-neutral-500">
            <li><Link href="/" className="hover:text-neutral-900 transition-colors">Startseite</Link></li>
            <li><ChevronRight size={12} className="opacity-50" /></li>
            <li><Link href="/fahrzeuge" className="hover:text-neutral-900 transition-colors">Fahrzeuge</Link></li>
            <li><ChevronRight size={12} className="opacity-50" /></li>
            <li className="text-neutral-900">{vehicle.make} {vehicle.model}</li>
          </ol>
        </nav>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Title Row */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-red-600 mb-3 flex items-center gap-3">
            <span className="w-8 h-[1px] bg-red-600" /> {vehicle.make}
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 tracking-tight mb-4 flex flex-wrap items-baseline gap-x-4">
            {vehicle.model}
            <span className="text-2xl md:text-3xl text-neutral-400 font-medium">{vehicle.variant}</span>
          </h1>
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm font-medium text-neutral-600">
            <span className="flex items-center gap-1.5"><MapPin size={16} className="text-neutral-400" /> {vehicle.location}</span>
            <span className="flex items-center gap-1.5"><Calendar size={16} className="text-neutral-400" /> EZ <span className="font-mono text-neutral-900">{vehicle.year}</span></span>
            <span className="flex items-center gap-1.5"><Gauge size={16} className="text-neutral-400" /> <span className="font-mono text-neutral-900">{formatKm(vehicle.km)}</span></span>
          </div>
        </div>

        {/* 2 Column Layout - Handled by Client */}
        <VehicleDetailClient vehicle={vehicle} dealer={DEALER} />

        <div className="flex flex-col lg:flex-row gap-10 mt-12">
          {/* Main Column additions */}
          <div className="flex-1 min-w-0 flex flex-col gap-12">
            {/* Quick Facts */}
            <section aria-labelledby="quick-facts-heading">
              <h2 id="quick-facts-heading" className="font-display text-2xl font-bold text-neutral-900 mb-6 tracking-tight">
                Auf einen Blick
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickFact icon={<Calendar size={18} />} label="Erstzulassung" value={vehicle.year} />
                <QuickFact icon={<Gauge size={18} />} label="Kilometerstand" value={formatKm(vehicle.km)} />
                <QuickFact icon={<Activity size={18} />} label="Leistung" value={formatPower(vehicle.kw, vehicle.hp)} accent />
                <QuickFact icon={<Fuel size={18} />} label="Kraftstoff" value={vehicle.fuel} mono={false} />
                <QuickFact icon={<Zap size={18} />} label="0–100 km/h" value={formatAccel(vehicle.accel)} accent />
                <QuickFact icon={<Timer size={18} />} label="Vmax" value={formatTopSpeed(vehicle.top)} />
                <QuickFact icon={<Palette size={18} />} label="Farbe" value={vehicle.color} mono={false} />
                <QuickFact icon={<DoorOpen size={18} />} label="Türen" value={`${vehicle.doors}-Türer`} />
              </div>
            </section>

            {/* Description */}
            <section aria-labelledby="desc-heading">
              <h2 id="desc-heading" className="font-display text-2xl font-bold text-neutral-900 mb-6 tracking-tight">
                Beschreibung
              </h2>
              <div className="rounded-2xl bg-white border border-neutral-200/60 p-6 md:p-8 shadow-sm">
                <p className="text-neutral-600 leading-relaxed mb-8 whitespace-pre-wrap">{vehicle.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {vehicle.equipment.map((eq) => (
                    <span key={eq} className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold tracking-wide text-neutral-700">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Spacer for right column */}
          <div className="hidden lg:block w-[380px] xl:w-[420px] flex-shrink-0" />
        </div>

        {/* Similar Vehicles */}
        {similar.length > 0 && (
          <section className="mt-24 pt-16 border-t border-neutral-200/60">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Empfehlungen</p>
                <h2 className="font-display text-3xl font-bold text-neutral-900 tracking-tight">Ähnliche Fahrzeuge</h2>
              </div>
              <Link href="/fahrzeuge" className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors">
                Alle anzeigen <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similar.map((sv, i) => (
                <SimilarCard key={sv.id} vehicle={sv} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
