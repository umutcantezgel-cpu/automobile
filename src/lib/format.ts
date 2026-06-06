// === Apex Motors — Formatting Utilities ===

export function formatPrice(n: number): string {
  return new Intl.NumberFormat('de-DE').format(Math.round(n)) + ' €';
}

export function formatKm(n: number): string {
  return new Intl.NumberFormat('de-DE').format(n) + ' km';
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('de-DE').format(n);
}

export function formatPower(kw: number, ps: number): string {
  return `${kw} kW (${ps} PS)`;
}

export function formatDate(dateStr: string): string {
  // Input: "MM/YYYY" or date string
  if (dateStr.includes('/')) {
    const [month, year] = dateStr.split('/');
    const monthNames = [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
    ];
    const monthIndex = parseInt(month, 10) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${monthNames[monthIndex]} ${year}`;
    }
  }
  return dateStr;
}

export function formatMonthly(n: number): string {
  return new Intl.NumberFormat('de-DE').format(n) + ' €/Monat';
}

export function formatConsumption(n: number): string {
  return n.toFixed(1).replace('.', ',') + ' l/100km';
}

export function formatCO2(n: number): string {
  return `${n} g/km`;
}

export function formatDisplacement(ccm: number): string {
  return new Intl.NumberFormat('de-DE').format(ccm) + ' ccm';
}

export function formatAccel(n: number): string {
  return n.toFixed(1).replace('.', ',') + ' s';
}

export function formatTopSpeed(n: number): string {
  return `${n} km/h`;
}
