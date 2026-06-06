import {
  formatPrice,
  formatKm,
  formatPower,
  formatConsumption,
  formatCO2,
  formatDisplacement,
  formatAccel,
  formatTopSpeed,
} from '@/lib/format';
import type { Vehicle } from '@/types/inventory';
import { cn } from '@/lib/cn';

interface SpecsTableProps {
  vehicle: Vehicle;
  className?: string;
}

interface SpecRow {
  label: string;
  value: string;
  mono: boolean;
}

function buildRows(v: Vehicle): SpecRow[] {
  return [
    { label: 'Erstzulassung', value: v.year, mono: true },
    { label: 'Kilometerstand', value: formatKm(v.km), mono: true },
    { label: 'Leistung', value: formatPower(v.kw, v.hp), mono: true },
    { label: 'Kraftstoff', value: v.fuel, mono: false },
    { label: 'Getriebe', value: v.gear, mono: false },
    { label: 'Antrieb', value: v.drive, mono: false },
    { label: 'Hubraum', value: v.ccm > 0 ? formatDisplacement(v.ccm) : '—', mono: true },
    { label: 'Farbe', value: v.color, mono: false },
    { label: 'Türen', value: String(v.doors), mono: true },
    { label: '0–100 km/h', value: formatAccel(v.accel), mono: true },
    { label: 'Höchstgeschwindigkeit', value: formatTopSpeed(v.top), mono: true },
    { label: 'Verbrauch (komb.)', value: v.fuel === 'Elektro' ? `${v.consumption.toFixed(1).replace('.', ',')} kWh/100km` : formatConsumption(v.consumption), mono: true },
    { label: 'CO₂-Emission', value: v.co2 > 0 ? formatCO2(v.co2) : '0 g/km', mono: true },
    { label: 'Emissionsklasse', value: v.em, mono: false },
    { label: 'Neupreis (UPE)', value: v.priceRating.marketAvg > 0 ? formatPrice(v.priceRating.marketAvg) : '—', mono: true },
  ];
}

export function SpecsTable({ vehicle, className }: SpecsTableProps) {
  const rows = buildRows(vehicle);

  return (
    <div className={cn("overflow-hidden rounded-2xl bg-white border border-neutral-200/60 shadow-sm", className)}>
      <table className="w-full text-left border-collapse" role="table">
        <caption className="sr-only">
          Technische Daten — {vehicle.make} {vehicle.model}
        </caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Eigenschaft</th>
            <th scope="col">Wert</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {rows.map((row, i) => (
            <tr
              key={row.label}
              className={cn(
                "transition-colors hover:bg-neutral-50/50",
                i % 2 === 0 ? "bg-white" : "bg-neutral-50/30"
              )}
            >
              <td className="py-4 pl-6 pr-4 text-[13px] font-medium text-neutral-500 w-1/2 align-top">
                {row.label}
              </td>
              <td
                className={cn(
                  "py-4 pr-6 pl-4 text-[15px] font-semibold text-neutral-900 w-1/2 align-top",
                  row.mono && "font-mono tracking-tight"
                )}
              >
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
