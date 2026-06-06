'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, Star } from 'lucide-react';
import { cn } from '@/lib/cn';

interface FooterLink {
  label: string;
  href: string;
}

const FAHRZEUGE_LINKS: FooterLink[] = [
  { label: 'Alle Fahrzeuge', href: '/fahrzeuge' },
  { label: 'Aktuelle Angebote', href: '/angebote' },
  { label: 'Vergleichen', href: '/vergleich' },
  { label: 'Magazin', href: '/magazin' },
];

const SERVICE_LINKS: FooterLink[] = [
  { label: 'Service', href: '/service' },
  { label: 'Finanzierung', href: '/finanzierung' },
  { label: 'Inzahlungnahme', href: '/inzahlungnahme' },
  { label: 'Probefahrt', href: '/probefahrt' },
];

const LEGAL_LINKS: FooterLink[] = [
  { label: 'Impressum', href: '/impressum' },
  { label: 'Datenschutz', href: '/datenschutz' },
  { label: 'AGB', href: '/agb' },
  { label: 'Karriere', href: '/karriere' },
];

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-6">{title}</h3>
      <ul className="space-y-3.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-neutral-600 hover:text-red-600 transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200/60" role="contentinfo">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-20 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col items-start">
            <Link href="/" className="group flex items-center gap-1.5 mb-6">
              <span className="font-display font-bold text-2xl tracking-tight text-neutral-900 transition-colors group-hover:text-red-600">APEX</span>
              <span className="text-red-600 font-light text-2xl">/</span>
              <span className="font-display font-medium text-2xl tracking-wide text-neutral-600">MOTORS</span>
            </Link>
            
            <p className="text-neutral-500 text-sm leading-relaxed max-w-sm mb-8">
              Premium-Fahrzeuge mit redaktioneller Sorgfalt — seit 1986. Ihr Partner für erstklassige Gebraucht- und Sportwagen.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 bg-white border border-neutral-200 px-3 py-1.5 rounded-full text-[11px] font-medium text-neutral-600 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> TÜV Süd
              </div>
              <div className="flex items-center gap-1.5 bg-white border border-neutral-200 px-3 py-1.5 rounded-full text-[11px] font-medium text-neutral-600 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> DEKRA
              </div>
              <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-900 px-3 py-1.5 rounded-full text-[11px] font-medium text-white shadow-sm">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> 4.9/5
              </div>
            </div>
          </div>

          {/* Link Columns */}
          <FooterColumn title="Fahrzeuge" links={FAHRZEUGE_LINKS} />
          <FooterColumn title="Service" links={SERVICE_LINKS} />
          <FooterColumn title="Rechtliches" links={LEGAL_LINKS} />

          {/* Newsletter Column */}
          <div className="lg:col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-6">Newsletter</h3>
            <p className="text-neutral-500 text-[13px] leading-relaxed mb-4">
              Erhalten Sie exklusive Angebote und Neuigkeiten vor allen anderen.
            </p>

            <form className="relative max-w-sm" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="footer-email" className="sr-only">E-Mail-Adresse</label>
              <input
                id="footer-email"
                name="email"
                type="email"
                required
                placeholder="E-Mail-Adresse"
                autoComplete="email"
                className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all shadow-sm"
              />
              <button
                type="submit"
                aria-label="Newsletter abonnieren"
                className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square bg-neutral-100 hover:bg-red-50 text-neutral-600 hover:text-red-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-200/60 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-neutral-500">
          <p>
            © 2026 Apex Motors GmbH · Hermann-Löns-Str. 14 · 35578 Wetzlar
          </p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] opacity-70">v4.2.0</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              System Online
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
