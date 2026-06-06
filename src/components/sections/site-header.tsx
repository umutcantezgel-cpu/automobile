'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Heart,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  User,
  Car,
  Wrench,
  CreditCard,
  Building2,
  Phone,
  Calendar,
  MapPin,
  Clock,
  Star,
  Shield,
  Gauge,
  FileText,
  Calculator,
  Newspaper,
  Briefcase,
  UserCircle,
} from 'lucide-react';
import { useFavoritesStore } from '@/lib/store/favorites';
import { useUIStore } from '@/lib/store/ui';
import { cn } from '@/lib/cn';

const NAV_GROUPS_B2C = [
  {
    key: 'fahrzeuge',
    label: 'Fahrzeuge',
    columns: [
      {
        title: 'Bestand',
        items: [
          { href: '/fahrzeuge', label: 'Alle Fahrzeuge', description: 'Gesamter Fahrzeugbestand durchsuchen', icon: <Car className="w-5 h-5" /> },
          { href: '/angebote', label: 'Aktuelle Angebote', description: 'Sonderaktionen & reduzierte Fahrzeuge', icon: <Star className="w-5 h-5" /> },
          { href: '/vergleich', label: 'Vergleichen', description: 'Fahrzeuge direkt gegenüberstellen', icon: <Gauge className="w-5 h-5" /> },
          { href: '/merkliste', label: 'Merkliste', description: 'Ihre gespeicherten Favoriten', icon: <Heart className="w-5 h-5" /> },
        ],
      },
      {
        title: 'Kategorien',
        items: [
          { href: '/fahrzeuge?kategorie=neu', label: 'Neuwagen', description: 'Fahrzeuge mit Tageszulassung', icon: <Shield className="w-5 h-5" /> },
          { href: '/fahrzeuge?kategorie=jahres', label: 'Jahreswagen', description: 'Bis 12 Monate, top gepflegt', icon: <Calendar className="w-5 h-5" /> },
          { href: '/fahrzeuge?kategorie=gebraucht', label: 'Gebrauchtwagen', description: 'Geprüft & mit Garantie', icon: <FileText className="w-5 h-5" /> },
          { href: '/fahrzeuge?kategorie=premium', label: 'Premium-Selektion', description: 'Exklusive Oberklasse-Auswahl', icon: <Star className="w-5 h-5" /> },
        ],
      },
    ],
    promo: { title: 'Audi RS6 Avant performance', subtitle: 'Carbon Black · 8.400 km · 142.500 €', href: '/fahrzeuge/v1', accent: true },
  },
  {
    key: 'service',
    label: 'Service',
    columns: [
      {
        title: 'Werkstatt',
        items: [
          { href: '/service', label: 'Übersicht', description: 'Alle Werkstattleistungen', icon: <Wrench className="w-5 h-5" /> },
          { href: '/service#wartung', label: 'Inspektion & Wartung', description: 'Regelmäßige Checks & Pflege', icon: <Shield className="w-5 h-5" /> },
          { href: '/service#tuv', label: 'TÜV/HU', description: 'Hauptuntersuchung vor Ort', icon: <FileText className="w-5 h-5" /> },
          { href: '/service#reifen', label: 'Reifenservice', description: 'Wechsel, Einlagerung & Beratung', icon: <Gauge className="w-5 h-5" /> },
        ],
      },
      {
        title: 'Rund ums Auto',
        items: [
          { href: '/probefahrt', label: 'Probefahrt vereinbaren', description: 'Online-Terminbuchung in 2 Min.', icon: <Calendar className="w-5 h-5" /> },
          { href: '/inzahlungnahme', label: 'Inzahlungnahme', description: 'Fahrzeugbewertung & Ankauf', icon: <CreditCard className="w-5 h-5" /> },
          { href: '/finanzierung', label: 'Finanzierung', description: 'Rate, Leasing & Ballonkredit', icon: <Calculator className="w-5 h-5" /> },
          { href: '/service#notdienst', label: 'Notdienst 24/7', description: 'Pannenhilfe rund um die Uhr', icon: <Phone className="w-5 h-5" /> },
        ],
      },
    ],
    promo: { title: 'Probefahrt — am Wochenende', subtitle: 'Samstags 9–17 Uhr — Termin in 48h', href: '/probefahrt' },
  },
  {
    key: 'unternehmen',
    label: 'Unternehmen',
    columns: [
      {
        title: 'Apex Motors',
        items: [
          { href: '/ueber-uns', label: 'Über uns', description: 'Geschichte, Team & Standort', icon: <Building2 className="w-5 h-5" /> },
          { href: '/karriere', label: 'Karriere', description: 'Offene Stellen & Bewerbung', icon: <Briefcase className="w-5 h-5" /> },
          { href: '/magazin', label: 'Magazin', description: 'News, Ratgeber & Fahrzeugwissen', icon: <Newspaper className="w-5 h-5" /> },
          { href: '/kontakt', label: 'Kontakt', description: 'Anfahrt, Öffnungszeiten & Formular', icon: <MapPin className="w-5 h-5" /> },
        ],
      },
      {
        title: 'Konto',
        items: [
          { href: '/konto', label: 'Mein Konto', description: 'Profil, Favoriten & Anfragen', icon: <UserCircle className="w-5 h-5" /> },
        ],
      },
    ],
    promo: { title: 'Werkstattmeister seit 1986', subtitle: '15 Mitarbeiter · Wetzlar · 4.9 ★', href: '/ueber-uns' },
  },
];

const NAV_GROUPS_B2B = [
  {
    key: 'agentur',
    label: 'Für Autohändler',
    columns: [
      {
        title: 'Webdesign & Systeme',
        items: [
          { href: '/preise', label: 'Webdesign-Pakete', description: 'Transparente Paketpreise für Autohäuser', icon: <Briefcase className="w-5 h-5" /> },
          { href: '/preise#addons', label: 'Add-ons & Module', description: 'Fahrzeugbörsen-Sync, CRM-Anbindung etc.', icon: <FileText className="w-5 h-5" /> },
        ],
      },
      {
        title: 'Analyse & Beratung',
        items: [
          { href: '/calculator', label: 'Umsatzverlust-Rechner', description: 'Kalkulieren Sie Ihren Verlust durch schlechte UX', icon: <Calculator className="w-5 h-5" /> },
          { href: '/kontakt', label: 'Strategiegespräch buchen', description: 'Kostenlose Erstberatung für Ihren Digital-Erfolg', icon: <Phone className="w-5 h-5" /> },
        ],
      },
    ],
    promo: { title: 'Mehr Anfragen. Höhere Margen.', subtitle: 'Professionelle Webseiten für Autohäuser.', href: '/preise' },
  }
];

const MOBILE_QUICK_ACTIONS_B2C = [
  { icon: <Car className="w-5 h-5" />, label: 'Fahrzeuge', href: '/fahrzeuge' },
  { icon: <Calendar className="w-5 h-5" />, label: 'Probefahrt', href: '/probefahrt' },
  { icon: <Wrench className="w-5 h-5" />, label: 'Service', href: '/service' },
  { icon: <Phone className="w-5 h-5" />, label: 'Kontakt', href: '/kontakt' },
];

const MOBILE_QUICK_ACTIONS_B2B = [
  { icon: <Briefcase className="w-5 h-5" />, label: 'Lösungen', href: '/preise' },
  { icon: <Calculator className="w-5 h-5" />, label: 'Rechner', href: '/calculator' },
  { icon: <Phone className="w-5 h-5" />, label: 'Kontakt', href: '/kontakt' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'b2c' | 'b2b'>('b2c');
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { mobileMenuOpen, megaMenuGroup, setMobileMenuOpen, setMegaMenuGroup, closeAll } = useUIStore();
  const favCount = useFavoritesStore((s) => s.ids.length);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeAll(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeAll]);

  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    closeAll();
    setMobileAccordion(null);
  }, [pathname, closeAll]);

  const handleGroupEnter = useCallback((key: string) => {
    if (closeTimeout.current) { clearTimeout(closeTimeout.current); closeTimeout.current = null; }
    setMegaMenuGroup(key);
  }, [setMegaMenuGroup]);

  const handleGroupLeave = useCallback(() => {
    closeTimeout.current = setTimeout(() => setMegaMenuGroup(null), 150);
  }, [setMegaMenuGroup]);

  const handleMegaPanelEnter = useCallback(() => {
    if (closeTimeout.current) { clearTimeout(closeTimeout.current); closeTimeout.current = null; }
  }, []);

  const handleMegaPanelLeave = useCallback(() => {
    setMegaMenuGroup(null);
  }, [setMegaMenuGroup]);

  const isActive = useCallback((href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href.split('?')[0].split('#')[0]);
  }, [pathname]);

  const allGroups = [...NAV_GROUPS_B2C, ...NAV_GROUPS_B2B];
  const activeGroup = allGroups.find((g) => g.key === megaMenuGroup) ?? null;
  const toggleAccordion = (key: string) => setMobileAccordion((prev) => (prev === key ? null : key));

  return (
    <>
      <header className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "bg-white border-b border-neutral-200/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
      )}>
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-20 md:h-24">
            
            {/* Logo */}
            <div className="flex items-center gap-8 z-50">
              <Link href="/" className="group flex items-center gap-1.5">
                <span className="font-display font-bold text-xl tracking-tight text-neutral-900 transition-colors group-hover:text-red-600">APEX</span>
                <span className="text-red-600 font-light text-xl">/</span>
                <span className="font-display font-medium text-xl tracking-wide text-neutral-600">MOTORS</span>
              </Link>
              
              {/* Desktop Nav B2C */}
              <nav className="hidden lg:flex items-center gap-1 h-full" role="navigation">
                {NAV_GROUPS_B2C.map((group) => (
                  <div
                    key={group.key}
                    className="h-full flex items-center px-2 py-8"
                    onMouseEnter={() => handleGroupEnter(group.key)}
                    onMouseLeave={handleGroupLeave}
                  >
                    <button
                      type="button"
                      className={cn(
                        "flex items-center gap-1.5 text-[15px] font-medium transition-colors rounded-full px-4 py-2",
                        megaMenuGroup === group.key ? "bg-neutral-100 text-neutral-900" : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                      )}
                      aria-expanded={megaMenuGroup === group.key}
                    >
                      {group.label}
                      <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", megaMenuGroup === group.key && "rotate-180")} />
                    </button>
                  </div>
                ))}
              </nav>
            </div>

            {/* Desktop Nav B2B & Right Actions */}
            <div className="flex items-center gap-2 md:gap-4 z-50">
              
              <div className="hidden lg:flex items-center h-full">
                <div className="w-px h-6 bg-neutral-200 mx-2" />
                
                {/* Desktop Nav B2B */}
                {NAV_GROUPS_B2B.map((group) => (
                  <div
                    key={group.key}
                    className="h-full flex items-center px-2 py-8"
                    onMouseEnter={() => handleGroupEnter(group.key)}
                    onMouseLeave={handleGroupLeave}
                  >
                    <button
                      type="button"
                      className={cn(
                        "flex items-center gap-1.5 text-[15px] font-medium transition-colors rounded-full px-4 py-2",
                        megaMenuGroup === group.key ? "bg-red-50 text-red-600" : "text-red-600 hover:text-red-700 hover:bg-red-50/50"
                      )}
                      aria-expanded={megaMenuGroup === group.key}
                    >
                      <Briefcase className="w-4 h-4" />
                      {group.label}
                      <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", megaMenuGroup === group.key && "rotate-180")} />
                    </button>
                  </div>
                ))}
                
                <div className="w-px h-6 bg-neutral-200 mx-2" />
              </div>

              <Link href="/fahrzeuge" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors">
                <Search className="w-5 h-5" />
              </Link>
              <Link href="/merkliste" className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors">
                <Heart className="w-5 h-5" />
                {favCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                    {favCount}
                  </span>
                )}
              </Link>
              <Link href="/konto" className="hidden md:flex w-10 h-10 items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors">
                <User className="w-5 h-5" />
              </Link>
              <Link href="/probefahrt" className="hidden md:inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/20 active:scale-95 ml-2">
                Termin vereinbaren
              </Link>
              <button
                type="button"
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-900"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        <AnimatePresence>
          {activeGroup && (
            <motion.div
              ref={megaMenuRef}
              initial={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(10px)', transition: { duration: 0.2 } }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-2xl border-b border-neutral-200/50 shadow-2xl overflow-hidden"
              onMouseEnter={handleMegaPanelEnter}
              onMouseLeave={handleMegaPanelLeave}
            >
              <div className="max-w-[1400px] mx-auto px-8 py-10">
                <div className="flex gap-16">
                  <div className="flex-1 grid gap-12" style={{ gridTemplateColumns: `repeat(${activeGroup.columns.length}, minmax(0, 1fr))` }}>
                    {activeGroup.columns.map((col) => (
                      <div key={col.title}>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-6">{col.title}</h3>
                        <ul className="space-y-2">
                          {col.items.map((item) => (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                className="group flex items-start gap-4 p-3 -mx-3 rounded-xl transition-colors hover:bg-neutral-50"
                              >
                                <div className={cn(
                                  "flex-shrink-0 mt-0.5 w-10 h-10 flex items-center justify-center rounded-lg transition-colors",
                                  isActive(item.href) ? "bg-red-50 text-red-600" : "bg-neutral-100 text-neutral-500 group-hover:bg-white group-hover:text-neutral-900 group-hover:shadow-sm"
                                )}>
                                  {item.icon}
                                </div>
                                <div>
                                  <div className={cn("text-sm font-medium transition-colors", isActive(item.href) ? "text-red-600" : "text-neutral-900")}>
                                    {item.label}
                                  </div>
                                  <div className="text-[13px] text-neutral-500 mt-0.5 leading-snug">
                                    {item.description}
                                  </div>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  
                  {/* Promo Panel */}
                  <div className="w-[380px] flex-shrink-0">
                    <Link href={activeGroup.promo.href} className="group relative block h-full overflow-hidden rounded-2xl bg-neutral-100 p-8 transition-transform hover:-translate-y-1">
                      <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200/50 transition-colors group-hover:from-red-50/50 group-hover:to-neutral-100" />
                      <div className="relative h-full flex flex-col justify-between">
                        <div>
                          <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-6 text-neutral-400 group-hover:text-red-600 transition-colors">
                            <Car className="w-6 h-6" />
                          </div>
                          <h4 className="text-xl font-display font-semibold text-neutral-900 leading-tight mb-2">
                            {activeGroup.promo.title}
                          </h4>
                          {activeGroup.promo.subtitle && (
                            <p className="text-neutral-600 text-sm">{activeGroup.promo.subtitle}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-red-600 mt-8">
                          Mehr erfahren <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-neutral-950 z-50 lg:hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 md:px-8 h-20 md:h-24 border-b border-white/10 shrink-0">
              <Link href="/" className="font-display font-bold tracking-tight text-xl text-white" onClick={() => setMobileMenuOpen(false)}>
                APEX <span className="text-red-500 font-light">/</span> MOTORS
              </Link>
              <button 
                type="button" 
                onClick={() => setMobileMenuOpen(false)} 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden pt-6 pb-32">
              <div className="px-4 md:px-8">
                
                {/* Tab Switcher */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                  className="flex bg-white/5 p-1 rounded-xl mb-10"
                >
                  <button
                    onClick={() => setMobileTab('b2c')}
                    className={cn("flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all", mobileTab === 'b2c' ? "bg-white text-black shadow-sm" : "text-neutral-400")}
                  >
                    Für Autokäufer
                  </button>
                  <button
                    onClick={() => setMobileTab('b2b')}
                    className={cn("flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all", mobileTab === 'b2b' ? "bg-red-600 text-white shadow-sm" : "text-neutral-400")}
                  >
                    Für Autohändler
                  </button>
                </motion.div>

                {/* Quick Actions Grid */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
                  className="grid grid-cols-2 gap-3 mb-10"
                >
                  {(mobileTab === 'b2c' ? MOBILE_QUICK_ACTIONS_B2C : MOBILE_QUICK_ACTIONS_B2B).map((action) => (
                    <Link
                      key={action.href}
                      href={action.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white">
                        {action.icon}
                      </div>
                      <span className="text-sm font-medium text-neutral-300">{action.label}</span>
                    </Link>
                  ))}
                </motion.div>

                {/* Navigation Links */}
                <div className="space-y-2">
                  {(mobileTab === 'b2c' ? NAV_GROUPS_B2C : NAV_GROUPS_B2B).map((group, i) => {
                    const isOpen = mobileAccordion === group.key;
                    return (
                      <motion.div 
                        key={group.key}
                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + (i * 0.05) }}
                        className="border-b border-white/10 last:border-0"
                      >
                        <button
                          type="button"
                          className="flex items-center justify-between w-full py-5 text-left font-display text-2xl font-bold text-white"
                          onClick={() => toggleAccordion(group.key)}
                        >
                          {group.label}
                          <ChevronDown className={cn("w-6 h-6 text-neutral-500 transition-transform duration-300", isOpen && "rotate-180")} />
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="pb-6 pt-2 space-y-8">
                                {group.columns.map((col) => (
                                  <div key={col.title}>
                                    <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 px-2">{col.title}</h4>
                                    <ul className="space-y-2">
                                      {col.items.map((item) => (
                                        <li key={item.href}>
                                          <Link
                                            href={item.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center gap-4 px-2 py-3 rounded-xl hover:bg-white/5 transition-colors group"
                                          >
                                            <div className="text-neutral-400 group-hover:text-red-500 transition-colors">{item.icon}</div>
                                            <div>
                                              <div className="text-base font-medium text-neutral-200 group-hover:text-white transition-colors">{item.label}</div>
                                            </div>
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>

              </div>
            </div>

            {/* Bottom Sticky Action */}
            <div className="absolute bottom-0 left-0 w-full bg-neutral-950/80 backdrop-blur-xl border-t border-white/10 p-4 md:p-6 pb-8">
              {mobileTab === 'b2c' ? (
                <Link
                  href="/probefahrt"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 py-4 text-base font-bold text-white transition-all hover:bg-red-700"
                >
                  <Calendar className="w-5 h-5" />
                  Probefahrt vereinbaren
                </Link>
              ) : (
                <Link
                  href="/kontakt"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-white py-4 text-base font-bold text-neutral-900 transition-all hover:bg-neutral-100"
                >
                  <Phone className="w-5 h-5" />
                  Strategiegespräch buchen
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default SiteHeader;
