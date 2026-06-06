'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Trash2 } from 'lucide-react';
import { useFavoritesStore } from '@/lib/store/favorites';
import { VEHICLES } from '@/lib/mock/vehicles';
import { VehicleCard } from '@/components/sections/vehicle-card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';

export default function MerklistePage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const ids = useFavoritesStore((state) => state.ids);
  const clear = useFavoritesStore((state) => state.clear);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <main className="shell-container py-12 md:py-16 min-h-[80vh]">
        <div className="opacity-0">Lade Merkliste...</div>
      </main>
    );
  }

  const favoriteVehicles = VEHICLES.filter((v) => ids.includes(v.id));
  const count = favoriteVehicles.length;

  return (
    <main className="shell-container py-12 md:py-16 min-h-[80vh]">
      <div className="flex flex-col justify-between gap-6 mb-12 md:flex-row md:items-end md:mb-16">
        <div>
          <span className="text-black font-mono text-sm tracking-wider uppercase mb-4 block">
            // Merkliste
          </span>
          <h1 className="text-h1 font-display">
            <span className="font-mono tabular-nums">{count}</span> Fahrzeuge gemerkt
          </h1>
        </div>
        {count > 0 && (
          <Button variant="outline" onClick={clear} className="w-full md:w-auto">
            <Trash2 size={16} className="mr-2" />
            Alle entfernen
          </Button>
        )}
      </div>

      {count === 0 ? (
        <div className="card p-12 text-center max-w-2xl mx-auto flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-neutral-100 flex items-center justify-center mb-6">
            <Heart size={64} className="text-neutral-500" />
          </div>
          <h2 className="text-h3 font-display mb-4">Noch keine Favoriten</h2>
          <p className="text-neutral-500 mb-8">
            Speichern Sie Fahrzeuge auf Ihrer Merkliste, um sie später einfacher wiederzufinden oder miteinander zu vergleichen.
          </p>
          <Button onClick={() => router.push('/fahrzeuge')}>
            Fahrzeuge entdecken
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favoriteVehicles.map((vehicle, index) => (
            <div key={vehicle.id} className="flex flex-col gap-4">
              <VehicleCard vehicle={vehicle} index={index} />
              <div className="card p-4">
                <label
                  htmlFor={`note-${vehicle.id}`}
                  className="text-xs font-mono uppercase tracking-wider text-neutral-500 block mb-2"
                >
                  Persönliche Notiz
                </label>
                <textarea
                  id={`note-${vehicle.id}`}
                  className="w-full bg-transparent border-none resize-none p-0 text-sm min-h-[4rem] font-body focus:outline-none focus:ring-0 placeholder:text-neutral-500/50"
                  placeholder="Z.B. Nach Winterreifen fragen..."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
