'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useMotionTokens } from '@/lib/motion';
import {
  ChevronDown,
  MapPin,
  Clock,
  Briefcase,
  Coffee,
  GraduationCap,
  CarFront,
  Users,
  PiggyBank,
  Tags,
  Send,
  MessageSquare,
  Wrench,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';

const JOBS = [
  {
    id: 'j1',
    title: 'Kfz-Mechatroniker:in (m/w/d)',
    type: 'Vollzeit',
    department: 'Werkstatt',
    description: 'Verstärken Sie unser Werkstatt-Team bei der Wartung und Instandsetzung von Premium-Fahrzeugen. Sie arbeiten mit modernster Diagnosetechnik an den faszinierendsten Sportwagen und Luxuslimousinen.',
    requirements: ['Abgeschlossene Ausbildung als Kfz-Mechatroniker:in', 'Erfahrung im Premium-Segment von Vorteil', 'Hohes Qualitätsbewusstsein und Teamfähigkeit'],
  },
  {
    id: 'j2',
    title: 'Automobilkaufmann/-frau (m/w/d)',
    type: 'Vollzeit',
    department: 'Vertrieb',
    description: 'Beraten Sie unsere anspruchsvollen Kunden beim Kauf ihres nächsten Traumwagens. Von der ersten Anfrage bis zur feierlichen Fahrzeugübergabe sind Sie der kompetente Ansprechpartner.',
    requirements: ['Abgeschlossene kaufmännische Ausbildung', 'Verkaufstalent und ausgeprägte Kundenorientierung', 'Begeisterung für Premium-Automobile'],
  },
  {
    id: 'j3',
    title: 'Fahrzeugaufbereiter:in (m/w/d)',
    type: 'Vollzeit',
    department: 'Werkstatt',
    description: 'Sie sorgen für den perfekten optischen Auftritt unserer Fahrzeuge. Mit Auge fürs Detail und Expertise in der Lackpflege bereiten Sie Neu- und Gebrauchtwagen für den Showroom vor.',
    requirements: ['Erfahrung in der professionellen Fahrzeugaufbereitung', 'Kenntnisse in der Lackpolitur und Versiegelung', 'Sorgfältige und selbstständige Arbeitsweise'],
  },
  {
    id: 'j4',
    title: 'Marketing Manager:in (m/w/d)',
    type: 'Vollzeit',
    department: 'Marketing',
    description: 'Gestalten Sie den Markenauftritt von Apex Motors. Sie konzipieren Kampagnen, betreuen unsere Social Media Kanäle und organisieren exklusive Kundenevents.',
    requirements: ['Studium oder Ausbildung im Bereich Marketing/Medien', 'Sicherer Umgang mit digitalen Kanälen', 'Kreativität und Textgespür'],
  },
  {
    id: 'j5',
    title: 'Werkstudent:in Digitalisierung (m/w/d)',
    type: 'Teilzeit',
    department: 'IT',
    description: 'Unterstützen Sie uns bei der digitalen Transformation. Sie helfen bei der Einführung neuer Tools, der Prozessoptimierung und der Pflege unserer digitalen Plattformen.',
    requirements: ['Laufendes Studium im Bereich Wirtschaftsinformatik o.ä.', 'IT-Affinität und schnelle Auffassungsgabe', 'Zuverlässigkeit und Eigeninitiative'],
  },
  {
    id: 'j6',
    title: 'Kundenberater:in Service (m/w/d)',
    type: 'Vollzeit',
    department: 'Service',
    description: 'Sie sind das Gesicht unseres Servicebereichs. Sie nehmen Werkstattaufträge an, koordinieren Termine und sorgen für höchste Kundenzufriedenheit im After-Sales.',
    requirements: ['Technische oder kaufmännische Ausbildung', 'Erfahrung im Servicebereich eines Autohauses', 'Souveränes Auftreten und Stressresistenz'],
  },
  {
    id: 'j7',
    title: 'Auszubildende:r Kfz-Mechatronik (m/w/d)',
    type: 'Ausbildung',
    department: 'Werkstatt',
    description: 'Starte deine Karriere in der faszinierenden Welt der Premium-Automobile. Du lernst alles über moderne Fahrzeugtechnik, Diagnose und Instandsetzung von erfahrenen Meistern.',
    requirements: ['Guter Schulabschluss', 'Handwerkliches Geschick', 'Leidenschaft für Autos und Technik'],
  },
];

const BENEFITS = [
  { icon: Clock, title: 'Flexible Arbeitszeiten', desc: 'Arbeitszeitmodelle, die sich Ihrem Leben anpassen.' },
  { icon: GraduationCap, title: 'Weiterbildung', desc: 'Individuelle Förderung und regelmäßige Schulungen.' },
  { icon: CarFront, title: 'Firmenfahrzeug', desc: 'Attraktive Konditionen für Mitarbeiterfahrzeuge.' },
  { icon: Users, title: 'Team-Events', desc: 'Gemeinsame Erfolge feiern wir auf unseren Events.' },
  { icon: PiggyBank, title: 'Altersvorsorge', desc: 'Wir bezuschussen Ihre betriebliche Altersvorsorge.' },
  { icon: Tags, title: 'Mitarbeiterrabatte', desc: 'Sonderkonditionen auf Service und Teile.' },
];

const STEPS = [
  { icon: Send, title: '1. Bewerbung', desc: 'Senden Sie uns Ihren Lebenslauf — ein Anschreiben ist optional.' },
  { icon: MessageSquare, title: '2. Gespräch', desc: 'Lernen wir uns in einem entspannten ersten Video-Call kennen.' },
  { icon: Wrench, title: '3. Probearbeit', desc: 'Erleben Sie einen halben Tag lang unser Team in Action.' },
  { icon: CheckCircle2, title: '4. Willkommen', desc: 'Vertragsangebot und ein strukturiertes Onboarding.' },
];

export default function KarrierePage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { getDuration, getDelay, prefersReducedMotion: shouldReduceMotion } = useMotionTokens();

  return (
    <main className="w-full max-w-7xl mx-auto px-4 md:px-8 py-24 lg:py-32 flex flex-col gap-24 lg:gap-32 min-h-[calc(100vh-5rem)]">
      <header className="flex flex-col gap-6 max-w-3xl">
        <span className="text-sm font-semibold uppercase tracking-wider text-red-600 mb-2">
          // Karriere
        </span>
        <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-neutral-900 m-0">
          Werde Teil von Apex.
        </h1>
        <p className="text-xl lg:text-2xl text-neutral-500 m-0 leading-relaxed font-light">
          Wir suchen Menschen, die Autos nicht nur verkaufen, sondern verstehen. 
          Gestalten Sie mit uns die Zukunft des Premium-Automobilhandels.
        </p>
      </header>

      {/* Benefits */}
      <section className="flex flex-col gap-12">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-neutral-900 m-0">Was wir bieten</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {BENEFITS.map((benefit, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-200/50 flex flex-col gap-4">
              <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center text-red-600 mb-2">
                <benefit.icon size={24} />
              </div>
              <h3 className="font-display text-xl font-bold text-neutral-900 m-0">{benefit.title}</h3>
              <p className="text-neutral-500 m-0 leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Jobs */}
      <section className="flex flex-col gap-12">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-neutral-900 m-0">Offene Positionen</h2>
        <div className="flex flex-col gap-4">
          {JOBS.map((job) => {
            const isExpanded = expandedId === job.id;

            return (
              <div 
                key={job.id} 
                className={cn(
                  "bg-white rounded-2xl shadow-sm border border-neutral-200/50 overflow-hidden transition-all duration-300",
                  isExpanded && "border-red-600/30 shadow-md ring-1 ring-red-600/5"
                )}
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : job.id)}
                  className="w-full flex items-center justify-between p-6 lg:p-8 text-left hover:bg-neutral-50 transition-colors focus:outline-none"
                >
                  <div className="flex flex-col gap-4">
                    <h3 className="font-display text-2xl font-bold text-neutral-900 m-0">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-xs font-semibold uppercase tracking-wider">
                        <MapPin size={12} className="text-neutral-400" /> Wetzlar
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-xs font-semibold uppercase tracking-wider">
                        <Clock size={12} className="text-neutral-400" /> {job.type}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-xs font-semibold uppercase tracking-wider">
                        <Briefcase size={12} className="text-neutral-400" /> {job.department}
                      </span>
                    </div>
                  </div>
                  <ChevronDown 
                    size={24} 
                    className={cn(
                      "text-neutral-400 transition-transform duration-300 shrink-0 ml-4", 
                      isExpanded && "rotate-180 text-red-600"
                    )} 
                  />
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      animate={shouldReduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                      exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: getDuration(0.3), ease: "easeInOut" }}
                    >
                      <div className="p-6 lg:p-8 pt-0 border-t border-neutral-100 bg-neutral-50/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mt-6">
                          <div className="flex flex-col gap-4">
                            <h4 className="font-bold text-neutral-900 uppercase tracking-wider text-sm m-0">Die Aufgabe</h4>
                            <p className="text-neutral-600 leading-relaxed m-0">{job.description}</p>
                          </div>
                          <div className="flex flex-col gap-4">
                            <h4 className="font-bold text-neutral-900 uppercase tracking-wider text-sm m-0">Das Profil</h4>
                            <ul className="flex flex-col gap-3 m-0 p-0 list-none">
                              {job.requirements.map((req, i) => (
                                <li key={i} className="flex items-start gap-3 text-neutral-600">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0 mt-2" />
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="mt-8 pt-8 border-t border-neutral-200">
                          <Button size="lg">Jetzt bewerben</Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Process */}
      <section className="flex flex-col gap-12">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-neutral-900 m-0">Der Bewerbungsprozess</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {STEPS.map((step, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-200/50 flex flex-col gap-4 relative overflow-hidden group hover:border-neutral-300 transition-colors">
              <div className="absolute -right-8 -bottom-8 opacity-[0.03] text-neutral-900 group-hover:scale-110 group-hover:text-red-600 transition-all duration-500">
                <step.icon size={160} />
              </div>
              <h3 className="font-display text-xl font-bold text-neutral-900 m-0 relative z-10">{step.title}</h3>
              <p className="text-neutral-500 m-0 leading-relaxed relative z-10">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Spontaneous Banner */}
      <section className="bg-neutral-900 text-white rounded-[2.5rem] p-12 lg:p-20 flex flex-col items-center text-center gap-8 relative overflow-hidden my-12">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <h2 className="font-display text-3xl md:text-5xl font-bold m-0 relative z-10">Nichts Passendes dabei?</h2>
        <p className="text-lg lg:text-xl text-neutral-300 max-w-2xl m-0 leading-relaxed relative z-10">
          Wir sind immer auf der Suche nach außergewöhnlichen Talenten. Überzeugen Sie uns mit Ihrer Initiativbewerbung.
        </p>
        <div className="relative z-10 mt-4">
          <Button size="lg" className="bg-white text-neutral-900 hover:bg-neutral-100 shadow-sm h-14 px-8 text-[15px]">
            Initiativbewerbung senden
          </Button>
        </div>
      </section>
    </main>
  );
}
