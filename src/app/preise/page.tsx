'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMotionTokens } from '@/lib/motion';
import Link from 'next/link';
import {
  ChevronDown,
  ChevronRight,
  Check,
  X,
  Minus,
  Zap,
  Shield,
  Lock,
  User,
  Palette,
  Code2,
  FileText,
  Search,
  Target,
  Bot,
  Headphones,
  ArrowRight,
  Sparkles,
  BarChart3,
  Globe,
  Camera,
  Video,
  MessageSquare,
  Share2,
  Database,
  Gauge,
  Clock,
  Layers,
  Rocket,
  RefreshCw,
  Star,
  TrendingUp,
  Users,
  Calculator,
  Car,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/cn';

/* ================================================================== */
/*  TYPES                                                              */
/* ================================================================== */

interface ModuleItem {
  label: string;
  included: boolean;
  detail?: string;
}

interface Module {
  icon: React.ReactNode;
  title: string;
  items: ModuleItem[];
}

interface PricingTier {
  id: string;
  badge: string;
  badgeVariant: 'default' | 'premium';
  name: string;
  priceRange: string;
  priceNote: string;
  timeline: string;
  iterations: string;
  pages: string;
  description: string;
  featured: boolean;
  modules: Module[];
}

interface AddOn {
  icon: React.ReactNode;
  name: string;
  price: string;
  description: string;
}

interface ProcessPhase {
  step: string;
  title: string;
  description: string;
  duration: string;
  icon: React.ReactNode;
}

interface CostItem {
  label: string;
  percentage: number;
  color: string;
}

interface ComparisonRow {
  feature: string;
  category: string;
  tier1: string | boolean;
  tier2: string | boolean;
  tier3: string | boolean;
}

interface CaseStudy {
  title: string;
  tier: string;
  stats: { label: string; value: string }[];
  description: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface DecisionHelper {
  id: string;
  title: string;
  subtitle: string;
  ideal: string;
  icon: React.ReactNode;
}

/* ================================================================== */
/*  DATA                                                               */
/* ================================================================== */

const HERO_STATS: { value: string; label: string; icon: React.ReactNode }[] = [
  { value: 'Festpreis', label: 'Keine Überraschungen', icon: <Shield size={16} /> },
  { value: 'Code-Eigentum', label: 'Ihr Code gehört Ihnen', icon: <Lock size={16} /> },
  { value: 'Kein Lock-In', label: 'Jederzeit wechselbar', icon: <Zap size={16} /> },
  { value: '1 Kontakt', label: 'Direkter Ansprechpartner', icon: <User size={16} /> },
];

const TIERS: PricingTier[] = [
  {
    id: 'essential',
    badge: 'Stufe 01',
    badgeVariant: 'default',
    name: 'Digitales Autohaus Basis',
    priceRange: '1.450 – 2.700 €',
    priceNote: 'Einmalig · Festpreis',
    timeline: '3–5 Wochen',
    iterations: '2 Iterationen',
    pages: '5–8 Seiten',
    description:
      'Ihre professionelle Online-Filiale. Keine generische Website, sondern ein speziell für Autohändler entwickeltes System, das Vertrauen schafft und Leads generiert.',
    featured: false,
    modules: [
      {
        icon: <Car size={16} />,
        title: 'Fahrzeug-Features',
        items: [
          { label: 'Fahrzeugbestand-Übersicht', included: true },
          { label: 'Basis-Suchfunktion & Filter', included: true },
          { label: 'Fahrzeug-Detailseiten (VDP)', included: true },
          { label: 'Mobile.de / AutoScout24 Sync', included: false, detail: 'Nur manuelles Einpflegen' },
        ],
      },
      {
        icon: <Target size={16} />,
        title: 'Händler-Conversion',
        items: [
          { label: 'Probefahrt-Buchungsformular', included: true },
          { label: 'Einfache Inzahlungnahme-Anfrage', included: true },
          { label: 'Click-to-Call Buttons (Mobile)', included: true },
          { label: 'Finanzierungs-Rechner', included: false },
        ],
      },
      {
        icon: <Palette size={16} />,
        title: 'Design & UX',
        items: [
          { label: 'Premium Autohaus-Design', included: true, detail: 'Kein Baukasten-Look' },
          { label: 'Mobile-First (Smartphone-optimiert)', included: true },
          { label: 'Markenkonformes Farbschema', included: true },
          { label: '1 Design-Konzept', included: true },
        ],
      },
      {
        icon: <Search size={16} />,
        title: 'SEO für Händler',
        items: [
          { label: 'Regionale Autohaus-SEO', included: true },
          { label: 'Google My Business Einrichtung', included: true },
          { label: 'Standort- & Routenplanung', included: true },
          { label: 'Fahrzeug-SEO (Schema.org)', included: false },
        ],
      },
      {
        icon: <Code2 size={16} />,
        title: 'Technik & Support',
        items: [
          { label: 'Blitzschnelle Ladezeiten', included: true },
          { label: 'DSGVO-konform (Cookie-Banner)', included: true },
          { label: '3 Monate Post-Launch Support', included: true },
          { label: 'Wartungsvertrag optional', included: true },
        ],
      },
    ],
  },
  {
    id: 'growth',
    badge: 'Stufe 02 · Empfohlen',
    badgeVariant: 'premium',
    name: 'Performance Dealer',
    priceRange: '4.450 – 9.250 €',
    priceNote: 'Einmalig · Festpreis',
    timeline: '6–10 Wochen',
    iterations: 'Unbegrenzte Iterationen',
    pages: '15–30 Seiten',
    description:
      'Die komplette Verkaufsmaschine für ambitionierte Händler. Vollautomatisierter Fahrzeugimport, smarte Rechner und regionale SEO-Dominanz für messbaren ROI.',
    featured: true,
    modules: [
      {
        icon: <RefreshCw size={16} />,
        title: 'Fahrzeug-Sync & Daten',
        items: [
          { label: 'Autom. Mobile.de / AutoScout24 Import', included: true, detail: 'API-basiert' },
          { label: 'Erweiterte Fahrzeug-Suchmaschine', included: true },
          { label: 'Premium Fahrzeug-Detailseiten', included: true },
          { label: 'Automatische Fahrzeug-SEO', included: true },
        ],
      },
      {
        icon: <Calculator size={16} />,
        title: 'Sales & Conversion',
        items: [
          { label: 'Integrierter Finanzierungs-Rechner', included: true },
          { label: 'Interaktive Inzahlungnahme (Multi-Step)', included: true },
          { label: 'Smart Lead-Routing ans Verkaufsteam', included: true },
          { label: 'Fahrzeug-Merkliste & Favoriten', included: true },
          { label: 'CRM-Anbindung (Basis)', included: true },
        ],
      },
      {
        icon: <Palette size={16} />,
        title: 'Design & Erlebnis',
        items: [
          { label: 'UX wie bei Premium-Herstellern', included: true },
          { label: '3 Design-Konzepte', included: true },
          { label: 'Micro-Animationen für Wertigkeit', included: true },
          { label: 'Performance-Videos im Hintergrund', included: true },
        ],
      },
      {
        icon: <Search size={16} />,
        title: 'Local Dominance SEO',
        items: [
          { label: 'Strategische Keyword-Abdeckung (50+)', included: true },
          { label: 'Marken-spezifische Landingpages', included: true },
          { label: 'Local-SEO für Ihren Standort', included: true },
          { label: 'Automatisierte Kundenbewertungen', included: true },
        ],
      },
      {
        icon: <Headphones size={16} />,
        title: 'Support & Wartung',
        items: [
          { label: '12 Monate Priority Support', included: true },
          { label: 'Hosting-Setup & Deployment', included: true },
          { label: 'Schulung für Ihr Verkaufsteam', included: true },
          { label: 'Inkl. 6 Monate Wartungsvertrag', included: true },
        ],
      },
    ],
  },
  {
    id: 'enterprise',
    badge: 'Stufe 03 · Enterprise',
    badgeVariant: 'default',
    name: 'Multi-Location System',
    priceRange: 'ab 17.500 €',
    priceNote: 'Sprint-basiert · Individuelle Kalkulation',
    timeline: 'Sprint-basiert',
    iterations: 'Unbegrenzt',
    pages: 'Unbegrenzt',
    description:
      'Für große Autohaus-Gruppen und Großhändler. Nahtlose DMS/ERP-Integration, Mandantenfähigkeit und maßgeschneiderte Automatisierungen für maximale Effizienz.',
    featured: false,
    modules: [
      {
        icon: <Database size={16} />,
        title: 'Architektur & Systeme',
        items: [
          { label: 'Multi-Standort Verwaltung', included: true },
          { label: 'Echtzeit ERP/DMS Integration', included: true, detail: 'z.B. Loco-Soft, DAT, AutoData' },
          { label: 'Zentraler Fahrzeug-Pool (Cross-Selling)', included: true },
          { label: 'Mandantenfähiges Dashboard', included: true },
        ],
      },
      {
        icon: <Bot size={16} />,
        title: 'Automatisierung & KI',
        items: [
          { label: 'KI-Chatbot zur Vorqualifizierung', included: true },
          { label: 'KI-generierte Fahrzeugtexte', included: true },
          { label: 'Dynamische Preisgestaltung', included: true },
          { label: 'Automatisierte Sales-Workflows', included: true },
        ],
      },
      {
        icon: <Target size={16} />,
        title: 'Enterprise Marketing',
        items: [
          { label: 'Programmatische SEO für 1000+ Keys', included: true },
          { label: 'Personalisierte Customer Journeys', included: true },
          { label: 'Retargeting & Marketing-Automation', included: true },
          { label: 'Multi-Language Support', included: true },
        ],
      },
      {
        icon: <Palette size={16} />,
        title: 'Design & UI/UX',
        items: [
          { label: 'Eigenes Corporate Design System', included: true },
          { label: 'Barrierefreiheit (WCAG 2.1 AA)', included: true },
          { label: 'Prototyping & User-Testing', included: true },
          { label: 'Multi-Brand & Sub-Marken', included: true },
        ],
      },
      {
        icon: <Headphones size={16} />,
        title: 'Enterprise Support',
        items: [
          { label: 'Dedizierter Account Manager', included: true },
          { label: 'SLA mit garantierten Reaktionszeiten', included: true },
          { label: '24/7 Notfall-Support', included: true },
          { label: 'Laufende Conversion-Optimierung', included: true },
        ],
      },
    ],
  },
];

const ADDONS: AddOn[] = [
  {
    icon: <Database size={20} />,
    name: 'Fahrzeugbörsen-Sync (API)',
    price: '1.000 – 2.000 €',
    description: 'Automatische Live-Synchronisation mit Mobile.de, AutoScout24 oder Ihrem DMS.',
  },
  {
    icon: <Camera size={20} />,
    name: 'Autohaus Fotografie',
    price: '600 – 1.400 €',
    description: 'Professionelles Vor-Ort-Shooting. Showroom, Team und Premium-Fahrzeuge.',
  },
  {
    icon: <Video size={20} />,
    name: 'Fahrzeug-Walkarounds',
    price: '1.250 – 3.000 €',
    description: 'Imagefilm für Ihr Autohaus oder detaillierte Videos für Ihre Bestandsfahrzeuge.',
  },
  {
    icon: <MessageSquare size={20} />,
    name: 'KI-Verkaufsassistent',
    price: '750 – 1.750 €',
    description: 'Ein Chatbot, der 24/7 Kundenfragen zu Fahrzeugen beantwortet und Probefahrten bucht.',
  },
  {
    icon: <Share2 size={20} />,
    name: 'Social-Media für Händler',
    price: '400 – 750 €',
    description: 'Instagram/Facebook Setup für Fahrzeug-Highlights, Content-Kalender & Templates.',
  },
  {
    icon: <Globe size={20} />,
    name: 'Mehrsprachigkeit',
    price: '750 – 1.500 €',
    description: 'Professionelle Übersetzung für internationale Autokäufer (Export).',
  },
  {
    icon: <Gauge size={20} />,
    name: 'Performance-Audit',
    price: '300 – 600 €',
    description: 'Tiefgehende Analyse Ihrer aktuellen Plattform mit Fokus auf Ladezeiten & Conversion.',
  },
  {
    icon: <BarChart3 size={20} />,
    name: 'Fahrzeug-Lead-Ads',
    price: '900 – 1.750 €',
    description: 'Google Ads & Meta Ads Setup speziell zur Lead-Generierung für Ihren Bestand.',
  },
  {
    icon: <Shield size={20} />,
    name: 'Händler-Wartungsvertrag',
    price: '100 – 250 €/Monat',
    description: 'Laufende Updates, Sicherheits-Patches, Hosting und Priority Support.',
  },
];

const PROCESS_PHASES: ProcessPhase[] = [
  {
    step: '01',
    title: 'Briefing',
    description: 'Erstgespräch, Zieldefinition, Anforderungsanalyse',
    duration: 'Tag 1',
    icon: <MessageSquare size={20} />,
  },
  {
    step: '02',
    title: 'Discovery',
    description: 'Marktanalyse, Wettbewerb, Content-Audit',
    duration: 'Woche 1–2',
    icon: <Search size={20} />,
  },
  {
    step: '03',
    title: 'Design',
    description: 'Wireframes, Mockups, Design-System',
    duration: 'Woche 2–4',
    icon: <Palette size={20} />,
  },
  {
    step: '04',
    title: 'Develop',
    description: 'Frontend, Backend, Integrationen, Testing',
    duration: 'Woche 4–8',
    icon: <Code2 size={20} />,
  },
  {
    step: '05',
    title: 'Launch',
    description: 'Deployment, DNS, SSL, Monitoring',
    duration: 'Woche 8–9',
    icon: <Rocket size={20} />,
  },
  {
    step: '06',
    title: 'Iterate',
    description: 'Analyse, A/B Tests, Optimierung',
    duration: 'Fortlaufend',
    icon: <RefreshCw size={20} />,
  },
];

const COST_ITEMS: CostItem[] = [
  { label: 'Strategie & Konzeption', percentage: 15, color: 'bg-indigo-500' },
  { label: 'Design & UX', percentage: 25, color: 'bg-blue-500' },
  { label: 'Entwicklung', percentage: 35, color: 'bg-emerald-500' },
  { label: 'Content & SEO', percentage: 15, color: 'bg-amber-500' },
  { label: 'Testing & Launch', percentage: 10, color: 'bg-violet-500' },
];

const COMPARISON_ROWS: ComparisonRow[] = [
  { feature: 'Responsive Autohaus-Design', category: 'Design', tier1: true, tier2: true, tier3: true },
  { feature: 'Design-Konzepte', category: 'Design', tier1: '1', tier2: '3', tier3: 'Unbegrenzt' },
  { feature: 'Premium Micro-Animationen', category: 'Design', tier1: false, tier2: true, tier3: true },
  { feature: 'Corporate Design System', category: 'Design', tier1: false, tier2: false, tier3: true },
  { feature: 'Fahrzeugbestand (VDPs)', category: 'Features', tier1: true, tier2: true, tier3: true },
  { feature: 'Suchfunktion & Filter', category: 'Features', tier1: 'Basis', tier2: 'Erweitert', tier3: 'Enterprise' },
  { feature: 'Probefahrt-Buchung', category: 'Features', tier1: true, tier2: true, tier3: true },
  { feature: 'Inzahlungnahme-Formular', category: 'Features', tier1: 'Basis', tier2: 'Multi-Step', tier3: 'Dynamisch' },
  { feature: 'Finanzierungs-Rechner', category: 'Features', tier1: false, tier2: true, tier3: true },
  { feature: 'Fahrzeug-Merkliste', category: 'Features', tier1: false, tier2: true, tier3: true },
  { feature: 'Mobile.de / AutoScout24 Sync', category: 'Technik', tier1: 'Manuell', tier2: 'Automatisch', tier3: 'Echtzeit (API)' },
  { feature: 'DMS / ERP Integration', category: 'Technik', tier1: false, tier2: false, tier3: true },
  { feature: 'CRM-Anbindung', category: 'Technik', tier1: false, tier2: 'Basis', tier3: 'Vollständig' },
  { feature: 'Multi-Standort', category: 'Technik', tier1: false, tier2: false, tier3: true },
  { feature: 'Seitenanzahl', category: 'Content', tier1: '5–8', tier2: '15–30', tier3: 'Unbegrenzt' },
  { feature: 'KI-Fahrzeugtexte', category: 'Content', tier1: false, tier2: false, tier3: true },
  { feature: 'Regionale Autohaus-SEO', category: 'SEO', tier1: 'Basis', tier2: 'Dominance', tier3: 'Enterprise' },
  { feature: 'Keyword-Abdeckung', category: 'SEO', tier1: 'Fokus', tier2: '50+ Keys', tier3: '1000+ Keys' },
  { feature: 'Fahrzeug-SEO (Schema.org)', category: 'SEO', tier1: false, tier2: true, tier3: true },
  { feature: 'A/B Testing (Conversion)', category: 'Conversion', tier1: false, tier2: true, tier3: true },
  { feature: 'Automatisierte Sales-Flows', category: 'Conversion', tier1: false, tier2: false, tier3: true },
  { feature: 'Post-Launch Support', category: 'Support', tier1: '3 Monate', tier2: '12 Monate', tier3: '12 Monate Priority' },
];


const CASE_STUDIES: CaseStudy[] = [
  {
    title: 'Autohaus Weber, Gießen',
    tier: 'Digitales Autohaus Basis',
    stats: [
      { label: 'Sichtbarkeit', value: '+180%' },
      { label: 'Probefahrten/Monat', value: '+12' },
      { label: 'Investition', value: '2.100 €' },
    ],
    description:
      'Vom veralteten Baukasten zur modernen Webpräsenz. Innerhalb von 4 Wochen live mit 6 optimierten Seiten und integriertem Probefahrt-Modul.',
  },
  {
    title: 'Premium Cars Frankfurt',
    tier: 'Performance Dealer',
    stats: [
      { label: 'Organischer Traffic', value: '+340%' },
      { label: 'Conversion-Rate', value: '3,2%' },
      { label: 'ROI nach 6 Mon.', value: '820%' },
    ],
    description:
      'Komplette Neupositionierung mit automatischer mobile.de-Anbindung und lokaler SEO-Strategie. Top 3 für 42 relevante Fahrzeug-Keywords.',
  },
  {
    title: 'Autogruppe Rhein-Main',
    tier: 'Multi-Location System',
    stats: [
      { label: 'Standorte vernetzt', value: '7' },
      { label: 'Automatisierte Leads', value: '89%' },
      { label: 'Zeitersparnis/Woche', value: '18h' },
    ],
    description:
      'Multi-Standort-System mit DMS-Integration, automatisierter Bestandssynchronisierung über alle Filialen und KI-Assistent.',
  },
];

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Was ist im Festpreis enthalten?',
    answer:
      'Der Festpreis umfasst Konzeption, Design, Entwicklung, Content-Erstellung, Testing und Launch. Es gibt keine versteckten Kosten. Hosting, Domain und optionale laufende Wartung werden separat und transparent kalkuliert.',
  },
  {
    question: 'Wem gehört der Code nach Fertigstellung?',
    answer:
      'Ihnen. Nach vollständiger Bezahlung erhalten Sie alle Rechte am erstellten Code, Design und Content. Sie können das Projekt jederzeit von einem anderen Entwickler weiterführen lassen.',
  },
  {
    question: 'Was passiert, wenn ich nach dem Launch Änderungen brauche?',
    answer:
      'Kleinere Änderungen innerhalb der Support-Phase sind inklusive. Darüber hinaus bieten wir flexible Wartungsverträge oder können einzelne Änderungen nach Aufwand abrechnen. Stundensatz: 120 €/h netto.',
  },
  {
    question: 'Wie läuft die Zahlung ab?',
    answer:
      'Standardmäßig: 40% bei Beauftragung, 30% nach Design-Freigabe, 30% bei Launch. Bei Enterprise-Projekten wird sprint-basiert nach Meilensteinen abgerechnet.',
  },
  {
    question: 'Kann ich mein bestehendes CMS behalten?',
    answer:
      'Ja, wir integrieren gängige CMS-Systeme wie WordPress (Headless), Sanity, Strapi oder Contentful. In Stufe 01 ist kein CMS enthalten, ab Stufe 02 ist eine Integration inklusive.',
  },
  {
    question: 'Wie lange dauert die Umsetzung?',
    answer:
      'Stufe 01: 4–6 Wochen, Stufe 02: 8–12 Wochen, Stufe 03: Sprint-basiert (typisch 3–6 Monate). Die Timeline hängt von der Zulieferung von Inhalten und der Feedback-Geschwindigkeit ab.',
  },
  {
    question: 'Bieten Sie auch laufende SEO-Betreuung an?',
    answer:
      'Ja, als Add-on. Ab 500 €/Monat bieten wir fortlaufende SEO-Optimierung mit monatlichem Reporting, Keyword-Monitoring und Content-Empfehlungen.',
  },
  {
    question: 'Was unterscheidet Sie von einer Agentur?',
    answer:
      'Sie arbeiten direkt mit dem Entwickler — ohne Account-Manager-Overhead, ohne Kommunikationsverluste. Das bedeutet schnellere Umsetzung, bessere Qualität und transparente Preise.',
  },
  {
    question: 'Kann ich zwischen den Stufen wechseln?',
    answer:
      'Ja, Sie können jederzeit upgraden. Bereits geleistete Arbeit wird angerechnet. Ein Downgrade ist vor Projektbeginn möglich.',
  },
  {
    question: 'Gibt es eine Geld-zurück-Garantie?',
    answer:
      'Wir bieten eine Zufriedenheitsgarantie: Wenn Sie nach dem Design-Konzept nicht zufrieden sind, können Sie das Projekt abbrechen und zahlen nur die bereits geleistete Arbeit (maximal die Anzahlung).',
  },
];

const DECISION_HELPERS: DecisionHelper[] = [
  {
    id: 'essential',
    title: 'Ich brauche eine Website',
    subtitle: 'Professionell starten',
    ideal: 'Einzelstandort, erste Online-Präsenz',
    icon: <Globe size={24} />,
  },
  {
    id: 'growth',
    title: 'Ich will mehr Kunden',
    subtitle: 'Wachstum beschleunigen',
    ideal: 'Etabliertes Autohaus, regionale Dominanz',
    icon: <TrendingUp size={24} />,
  },
  {
    id: 'enterprise',
    title: 'Ich brauche ein System',
    subtitle: 'Prozesse automatisieren',
    ideal: 'Autohaus-Gruppe, Multi-Standort',
    icon: <Layers size={24} />,
  },
];

/* ================================================================== */
/*  ANIMATION VARIANTS                                                 */
/* ================================================================== */


/* ================================================================== */
/*  COLLAPSIBLE MODULE COMPONENT                                       */
/* ================================================================== */

function ModuleSection({ module, defaultOpen }: { module: Module; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const { getDuration, getDelay, prefersReducedMotion: shouldReduceMotion } = useMotionTokens();

  return (
    <div className="flex flex-col border border-neutral-200/50 rounded-xl overflow-hidden bg-white shadow-sm transition-all duration-300 hover:border-neutral-300">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center justify-between w-full p-4 text-left focus:outline-none focus-visible:bg-neutral-50 transition-colors"
        aria-expanded={open}
      >
        <span className="flex items-center gap-3 font-semibold text-neutral-900 text-sm">
          <span className="text-neutral-500 bg-neutral-100 p-1.5 rounded-md flex items-center justify-center">{module.icon}</span>
          {module.title}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: getDuration(0.25) }}
          className="text-neutral-400"
        >
          <ChevronDown size={16} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: getDuration(0.3), ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="overflow-hidden bg-neutral-50/50 border-t border-neutral-100"
          >
            <ul className="flex flex-col gap-3 p-4 m-0 list-none">
              {module.items.map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  {item.included ? (
                    <Check className="w-4 h-4 mt-0.5 text-green-600 shrink-0" />
                  ) : (
                    <X className="w-4 h-4 mt-0.5 text-neutral-300 shrink-0" />
                  )}
                  <span className={cn("text-sm text-neutral-700 leading-tight", !item.included && "text-neutral-400 line-through")}>
                    {item.label}
                    {item.detail && (
                      <span className="block text-xs text-neutral-500 mt-0.5 no-underline">({item.detail})</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================== */
/*  FAQ ITEM COMPONENT                                                 */
/* ================================================================== */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FAQItemComponent({ item, index, fadeUp }: { item: FAQItem; index: number; fadeUp: any }) {
  const [open, setOpen] = useState(false);
  const { getDuration, getDelay, prefersReducedMotion: shouldReduceMotion } = useMotionTokens();

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="bg-white rounded-2xl border border-neutral-200/50 shadow-sm overflow-hidden"
    >
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full text-left p-6 lg:p-8 flex items-center justify-between gap-6 hover:bg-neutral-50 transition-colors focus:outline-none"
        aria-expanded={open}
      >
        <span className="text-lg md:text-xl font-bold text-neutral-900 leading-tight">{item.question}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: getDuration(0.25) }}
          className="text-red-600 shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-red-50"
        >
          <ChevronDown size={20} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: getDuration(0.3), ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 lg:px-8 lg:pb-8 pt-0 m-0 text-neutral-600 leading-relaxed text-base md:text-lg border-t border-neutral-100 mt-2">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ================================================================== */
/*  COMPARISON CELL                                                    */
/* ================================================================== */

function ComparisonCell({ value }: { value: string | boolean }) {
  if (value === true) return <Check className="w-5 h-5 text-green-600 mx-auto" />;
  if (value === false) return <Minus className="w-5 h-5 text-neutral-300 mx-auto" />;
  return <span className="font-medium text-neutral-900 text-sm whitespace-nowrap">{value}</span>;
}

/* ================================================================== */
/*  PAGE COMPONENT                                                     */
/* ================================================================== */

export default function PreisePage() {
  const [expandedTier, setExpandedTier] = useState<string>('growth');
  const tierRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { getDuration, getDelay, prefersReducedMotion: shouldReduceMotion } = useMotionTokens();
  const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.06 } } };
  
  const fadeUp: any = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: shouldReduceMotion ? 0 : i * 0.08, 
        duration: getDuration(0.5), 
        ease: [0.25, 0.46, 0.45, 0.94] as const 
      },
    }),
  };

  const scrollToTier = useCallback((id: string) => {
    setExpandedTier(id);
    const el = tierRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div className="bg-neutral-50 flex flex-col w-full min-h-screen">
      {/* ============================================================ */}
      {/*  HERO                                                         */}
      {/* ============================================================ */}
      <section className="w-full bg-neutral-900 text-white pb-32 pt-32 lg:pt-40 lg:pb-48 -mt-24 relative z-0 overflow-hidden clip-path-[polygon(0_0,100%_0,100%_calc(100%-4rem),0_100%)]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[url('/images/hero-preise.png')] bg-cover bg-center opacity-10 mix-blend-overlay pointer-events-none" />
          <div className="absolute -top-1/2 -right-1/4 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-200/20 via-transparent to-transparent opacity-50 blur-3xl pointer-events-none" />        
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-transparent pointer-events-none" />
        </div>
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: getDuration(0.6) }}
            className="flex flex-col gap-6 max-w-3xl items-center text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-red-500">// Investition · transparent kalkuliert</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white m-0">
              Drei Stufen. Keine versteckten Kosten.
              <br />
              <span className="text-red-500">Ehrlich kalkuliert.</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-300 m-0 max-w-2xl leading-relaxed">
              Eine Website ist eine Investition — keine laufende Verpflichtung.
              Sie sehen vor der Beauftragung, was Sie bekommen.
            </p>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl"
          >
            {HERO_STATS.map((stat, i) => (
              <motion.div
                key={stat.value}
                custom={i}
                variants={fadeUp}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col items-center text-center gap-2"
              >
                <span className="text-red-500 flex items-center justify-center w-8 h-8 rounded-full bg-red-500/10 mb-1">{stat.icon}</span>
                <span className="text-white font-bold text-lg">{stat.value}</span>
                <span className="text-neutral-400 text-xs uppercase tracking-wider">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  QUICK DECISION HELPER                                        */}
      {/* ============================================================ */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 relative z-20 -mt-16 lg:-mt-24 mb-24">
        <div className="w-full">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6"
          >
            {DECISION_HELPERS.map((helper, i) => (
              <motion.button
                key={helper.id}
                custom={i}
                variants={fadeUp}
                onClick={() => scrollToTier(helper.id)}
                className={cn(
                  "flex flex-col items-start text-left p-6 lg:p-8 rounded-[2rem] shadow-sm transition-all duration-300 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 relative overflow-hidden",
                  helper.id === "growth" ? "bg-red-600 text-white hover:bg-red-700" : "bg-white border border-neutral-200/50 hover:border-red-600/30 hover:shadow-md"
                )}
              >
                {helper.id === "growth" && (
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
                )}
                <span className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110",
                  helper.id === "growth" ? "bg-white/20 text-white" : "bg-red-50 text-red-600"
                )}>
                  {helper.icon}
                </span>
                <div className="flex flex-col gap-1 mb-6 relative z-10">
                  <p className={cn("text-2xl font-display font-bold m-0 leading-tight", helper.id === "growth" ? "text-white" : "text-neutral-900")}>{helper.title}</p>
                  <p className={cn("text-base m-0", helper.id === "growth" ? "text-red-100 font-medium" : "text-neutral-500")}>{helper.subtitle}</p>
                </div>
                <p className={cn("text-sm mt-auto mb-6 relative z-10", helper.id === "growth" ? "text-red-200" : "text-neutral-400")}>{helper.ideal}</p>
                <span className={cn("flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider relative z-10 transition-transform group-hover:translate-x-1", helper.id === "growth" ? "text-white" : "text-red-600")}>
                  Details ansehen <ChevronRight size={16} />
                </span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  PRICING TIERS                                                */}
      {/* ============================================================ */}
      <section className="w-full bg-neutral-100 py-24 lg:py-32">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: getDuration(0.5) }}
            className="flex flex-col items-center text-center gap-4 mb-16"
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-red-600">// Leistungspakete</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-neutral-900 m-0">Wählen Sie Ihre Stufe</h2>
          </motion.div>

          <div className="flex flex-col gap-6 lg:gap-8">
            {TIERS.map((tier, i) => {
              const isExpanded = expandedTier === tier.id;
              return (
                  <motion.div
                  key={tier.id}
                  ref={(el) => {
                    tierRefs.current[tier.id] = el;
                  }}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className={cn(
                    "flex flex-col rounded-[2rem] transition-all duration-300 relative overflow-hidden bg-white",
                    tier.featured ? "border-2 border-red-600 shadow-xl" : "border border-neutral-200/80 shadow-sm hover:border-neutral-300"
                  )}
                >
                  {/* Tier header */}
                  <button
                    onClick={() => setExpandedTier(isExpanded ? '' : tier.id)}
                    className="w-full text-left focus:outline-none p-0 flex flex-col cursor-pointer transition-colors hover:bg-neutral-50/50"
                    aria-expanded={isExpanded}
                  >
                    <div className="w-full h-48 lg:h-64 relative border-b border-neutral-100/50">
                       <img src={`/images/preise_paket${i+1}.png`} alt={tier.name} className="absolute inset-0 w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/40 to-transparent" />
                    </div>
                    
                    <div className="p-6 md:p-8 lg:p-10 w-full">
                      <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-16 w-full">
                        <div className="flex flex-col flex-1 gap-4">
                          <div className="flex flex-wrap gap-2">
                            {tier.featured ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white rounded-full text-xs font-bold uppercase tracking-wider">
                                <Sparkles size={12} />
                                {tier.badge}
                              </span>
                            ) : (
                              <Badge variant={tier.badgeVariant}>{tier.badge}</Badge>
                            )}
                          </div>
                          <h3 className="text-3xl lg:text-4xl font-display font-bold text-neutral-900 m-0">{tier.name}</h3>
                          <p className="text-lg text-neutral-500 m-0 leading-relaxed max-w-2xl">{tier.description}</p>
                        </div>
                        <div className="flex flex-col lg:items-end gap-2 shrink-0">
                          <p className="text-3xl lg:text-4xl font-display font-bold text-neutral-900 m-0 whitespace-nowrap">
                            {tier.priceRange}
                          </p>
                          <p className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">{tier.priceNote}</p>
                          <div className="flex flex-wrap lg:justify-end gap-x-4 gap-y-2 mt-auto">
                            <span className="flex items-center gap-1.5 text-sm font-medium text-neutral-600">
                              <Clock size={16} className="text-neutral-400" /> {tier.timeline}
                            </span>
                            <span className="flex items-center gap-1.5 text-sm font-medium text-neutral-600">
                              <RefreshCw size={16} className="text-neutral-400" /> {tier.iterations}
                            </span>
                            <span className="flex items-center gap-1.5 text-sm font-medium text-neutral-600">
                              <Layers size={16} className="text-neutral-400" /> {tier.pages}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="w-full flex justify-center items-center gap-2 mt-8 pt-4 border-t border-neutral-100 text-sm font-bold uppercase tracking-wider text-neutral-400">
                        {isExpanded ? 'Module ausblenden' : 'Module anzeigen'}
                        <motion.span
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: getDuration(0.25) }}
                        >
                          <ChevronDown size={16} />
                        </motion.span>
                      </div>
                    </div>
                  </button>

                  {/* Expandable modules */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: getDuration(0.4), ease: [0.25, 0.46, 0.45, 0.94] as const }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 md:p-8 lg:p-10 pt-0 bg-neutral-50/50">
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                            {tier.modules.map((mod, mi) => (
                              <ModuleSection key={mod.title} module={mod} defaultOpen={mi === 0} />
                            ))}
                          </div>
                          <div className="flex flex-col sm:flex-row items-center gap-4 mt-12 justify-center lg:justify-end">
                            <Button variant="primary" size="lg" className="w-full sm:w-auto px-8 h-14 text-base">
                              Angebot anfordern
                              <ArrowRight size={16} className="ml-2" />
                            </Button>
                            <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 h-14 text-base">
                              Unverbindlich beraten lassen
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  ADD-ONS                                                      */}
      {/* ============================================================ */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-24 lg:py-32">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: getDuration(0.5) }}
            className="flex flex-col items-center text-center gap-4 mb-16 max-w-3xl mx-auto"
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-red-600">// Modulare Erweiterungen</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-neutral-900 m-0">Add-ons nach Bedarf</h2>
            <p className="text-lg text-neutral-500 m-0 leading-relaxed">
              Erweitern Sie Ihr Paket gezielt mit den Bausteinen, die Ihr Autohaus braucht.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {ADDONS.map((addon, i) => (
              <motion.div
                key={addon.name}
                custom={i}
                variants={fadeUp}
                className="bg-white rounded-2xl p-6 lg:p-8 border border-neutral-200/50 shadow-sm hover:shadow-md hover:border-red-600/30 transition-all flex flex-col gap-4"
                style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-100 text-neutral-700">{addon.icon}</span>
                  <span className="inline-block px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-xs font-bold whitespace-nowrap">{addon.price}</span>
                </div>
                <h4 className="font-display text-xl font-bold text-neutral-900 m-0">{addon.name}</h4>
                <p className="text-sm text-neutral-500 leading-relaxed m-0">{addon.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  PROCESS TIMELINE                                             */}
      {/* ============================================================ */}
      <section className="w-full bg-neutral-100 py-24 lg:py-32">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: getDuration(0.5) }}
            className="flex flex-col items-center text-center gap-4 mb-20 max-w-3xl mx-auto"
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-red-600">// Unser Prozess</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-neutral-900 m-0">Von der Idee zum Launch</h2>
            <p className="text-lg text-neutral-500 m-0 leading-relaxed">
              Transparenter Ablauf in 6 Phasen — Sie wissen immer, wo wir stehen.
            </p>
          </motion.div>

          <div className="relative">
            {/* Desktop: horizontal */}
            <div className="hidden lg:block relative py-12">
              {/* Connecting line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-200 -translate-y-1/2 z-0" />

              <div className="grid grid-cols-6 gap-4 relative z-10">
                {PROCESS_PHASES.map((phase, i) => (
                  <motion.div
                    key={phase.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: shouldReduceMotion ? 0 : i * 0.1, duration: getDuration(0.5), ease: [0.25, 0.46, 0.45, 0.94] as const }}
                    className="flex flex-col items-center text-center gap-3 relative group"
                  >
                    {/* Dot */}
                    <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center relative shadow-sm border-4 border-white mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:border-red-50">
                      <div className="absolute inset-0 rounded-full border border-neutral-200" />
                      <span className="text-red-600">{phase.icon}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 bg-white px-2 py-0.5 rounded border border-neutral-100 shadow-sm">
                      Phase {phase.step}
                    </span>
                    <h4 className="font-display text-lg font-bold text-neutral-900 m-0">{phase.title}</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed m-0 px-2">{phase.description}</p>
                    <span className="text-[11px] font-semibold text-neutral-400 mt-2">
                      {phase.duration}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobile: vertical cards */}
            <div className="flex lg:hidden flex-col gap-4">
              {PROCESS_PHASES.map((phase, i) => (
                <motion.div
                  key={phase.step}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-6 border border-neutral-200/50 shadow-sm flex flex-col gap-4 relative overflow-hidden"
                >
                  <div className="flex items-start gap-4">
                    <span className="w-12 h-12 bg-neutral-100 text-red-600 rounded-xl flex items-center justify-center shrink-0">
                      {phase.icon}
                    </span>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        Phase {phase.step}
                      </span>
                      <h4 className="font-display text-xl font-bold text-neutral-900 m-0">{phase.title}</h4>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-500 leading-relaxed m-0">{phase.description}</p>
                  <span className="inline-block px-3 py-1 bg-neutral-50 text-neutral-600 rounded-lg text-xs font-semibold self-start border border-neutral-100 mt-2">
                    {phase.duration}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  COST TRANSPARENCY                                            */}
      {/* ============================================================ */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-24 lg:py-32">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: getDuration(0.5) }}
            className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center"
          >
            <div className="flex-1 flex flex-col gap-6 max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-red-600">// Kostentransparenz</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-neutral-900 m-0">Wo fließt Ihr Geld hin?</h2>
              <p className="text-lg text-neutral-500 m-0 leading-relaxed">
                Beispielhafte Aufteilung für ein{' '}
                <span className="font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">12.500 €</span>{' '}
                Local-Dominance-Projekt:
              </p>
            </div>

            <div className="flex-1 w-full flex flex-col gap-5">
              {COST_ITEMS.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: shouldReduceMotion ? 0 : i * 0.1, duration: getDuration(0.4) }}
                  className="flex flex-col gap-2"
                >
                  <div className="flex justify-between items-end text-sm">
                    <span className="font-bold text-neutral-900">{item.label}</span>
                    <span className="font-medium text-neutral-500">
                      {new Intl.NumberFormat('de-DE').format(Math.round(12500 * item.percentage / 100))} €
                      <span className="ml-1 text-xs text-neutral-400">
                        (<span className="font-bold">{item.percentage}%</span>)
                      </span>
                    </span>
                  </div>
                  <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden flex w-full">
                    <motion.div
                      className={cn("h-full rounded-full", item.color)}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: shouldReduceMotion ? 0 : i * 0.1 + 0.2, duration: getDuration(0.6), ease: "easeOut" as const }}
                    />
                  </div>
                </motion.div>
              ))}
              <div className="mt-4 pt-6 border-t border-neutral-200">
                <div className="bg-neutral-900 text-white rounded-xl p-5 flex justify-between items-center shadow-lg">
                  <span className="font-bold uppercase tracking-wider text-sm">Gesamt</span>
                  <span className="font-display text-2xl font-bold">12.500 €</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  COMPARISON MATRIX                                            */}
      {/* ============================================================ */}
      <section className="w-full bg-neutral-100 py-24 lg:py-32 overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: getDuration(0.5) }}
            className="flex flex-col items-center text-center gap-4 mb-16"
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-red-600">// Feature-Vergleich</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-neutral-900 m-0">Alle Features im Überblick</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: getDuration(0.5) }}
            className="w-full overflow-x-auto pb-8 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide"
          >
            <table className="w-full text-left border-collapse min-w-[800px] bg-white rounded-2xl shadow-sm overflow-hidden">
              <thead>
                <tr className="border-b-2 border-neutral-200">
                  <th className="p-4 lg:p-6 font-bold text-neutral-900 w-1/4 bg-neutral-50/50">Feature</th>
                  <th className="p-4 lg:p-6 font-bold text-neutral-900 w-1/4 text-center">Essential</th>
                  <th className="p-4 lg:p-6 font-bold text-neutral-900 w-1/4 text-center bg-red-50/30">
                    <span className="flex items-center justify-center gap-1.5 text-red-600">
                      Local Dominance <Sparkles size={14} className="text-red-500" />
                    </span>
                  </th>
                  <th className="p-4 lg:p-6 font-bold text-neutral-900 w-1/4 text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  let lastCategory = '';
                  return COMPARISON_ROWS.map((row, i) => {
                    const showCategory = row.category !== lastCategory;
                    lastCategory = row.category;
                    return (
                      <tr key={`${row.category}-${row.feature}-${i}`} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/50 transition-colors">
                        {showCategory ? (
                          <td
                            className="bg-neutral-100/50 p-3 px-6 font-bold text-xs uppercase tracking-wider text-neutral-500"
                            colSpan={4}
                          >
                            {row.category}
                          </td>
                        ) : null}
                        {!showCategory && (
                          <>
                            <td className="p-4 lg:px-6 font-medium text-neutral-700 border-r border-neutral-100/50">
                              {row.feature}
                            </td>
                            <td className="p-4 text-center border-r border-neutral-100/50">
                              <ComparisonCell value={row.tier1} />
                            </td>
                            <td className="p-4 text-center border-r border-neutral-100/50 bg-red-50/10">
                              <ComparisonCell value={row.tier2} />
                            </td>
                            <td className="p-4 text-center">
                              <ComparisonCell value={row.tier3} />
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CASE STUDIES                                                 */}
      {/* ============================================================ */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-24 lg:py-32">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: getDuration(0.5) }}
            className="flex flex-col items-center text-center gap-4 mb-16 max-w-3xl mx-auto"
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-red-600">// Ergebnisse</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-neutral-900 m-0">Was unsere Kunden erreicht haben</h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {CASE_STUDIES.map((study, i) => (
              <motion.div
                key={study.title}
                custom={i}
                variants={fadeUp}
                className="bg-white border border-neutral-200/50 shadow-sm hover:shadow-md hover:border-neutral-300 rounded-[2rem] p-8 lg:p-10 flex flex-col gap-6 transition-all"
                style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                <Badge variant="outline" className="self-start text-xs border-neutral-200 text-neutral-600">{study.tier}</Badge>
                <h4 className="font-display text-2xl font-bold text-neutral-900 m-0 leading-tight">{study.title}</h4>
                <p className="text-neutral-500 m-0 leading-relaxed min-h-[4.5rem]">{study.description}</p>
                <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-neutral-100">
                  {study.stats.map((stat) => (
                    <div key={stat.label} className="flex justify-between items-center text-sm">
                      <p className="font-medium text-neutral-500 m-0">{stat.label}</p>
                      <p className="font-bold text-neutral-900 m-0">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FAQ                                                          */}
      {/* ============================================================ */}
      <section className="w-full bg-neutral-100 py-24 lg:py-32">
        <div className="w-full max-w-3xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: getDuration(0.5) }}
            className="flex flex-col items-center text-center gap-4 mb-16"
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-red-600">// Häufige Fragen</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-neutral-900 m-0">Alles Wichtige auf einen Blick</h2>
          </motion.div>

          <div className="flex flex-col gap-4">
            {FAQ_ITEMS.map((item, i) => (
              <FAQItemComponent key={item.question} item={item} index={i} fadeUp={fadeUp} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CTA                                                          */}
      {/* ============================================================ */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-24 lg:py-32">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: getDuration(0.5) }}
            className="w-full"
          >
            <div className="bg-neutral-900 text-white rounded-[2.5rem] p-10 md:p-16 lg:p-24 flex flex-col items-center text-center gap-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
              <Calculator className="w-16 h-16 text-red-500 mb-2 relative z-10" />
              <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight m-0 max-w-3xl relative z-10">
                Was kostet Sie Ihre aktuelle Website?
              </h2>
              <p className="text-lg md:text-xl text-neutral-300 max-w-2xl m-0 leading-relaxed relative z-10">
                Berechnen Sie in 2 Minuten, wie viel Umsatz Ihnen jeden Monat durch
                eine nicht-optimierte Website entgeht.
              </p>
              <Link href="/calculator" className="relative z-10 mt-4 w-full sm:w-auto">
                <Button variant="primary" size="xl" className="w-full sm:w-auto h-16 px-10 text-lg shadow-xl shadow-red-900/20">
                  Umsatzverlust berechnen
                  <ArrowRight size={20} className="ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
