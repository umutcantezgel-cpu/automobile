'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, ArrowRight, ArrowLeft, CarFront, Gauge, Calendar, Wrench, Sparkles, CircleDollarSign, BarChart3, Repeat, Info } from 'lucide-react';
import { BRANDS } from '@/lib/mock/vehicles';
import { cn } from '@/lib/cn';

const schema = z.object({
  brand: z.string().min(1, { message: 'Bitte wählen Sie eine Marke' }),
  model: z.string().min(1, { message: 'Bitte wählen Sie ein Modell' }),
  year: z.number({ message: 'Pflichtfeld' } as any)
    .min(2000, { message: 'Muss ab Jahr 2000 sein' })
    .max(2026, { message: 'Muss bis Jahr 2026 sein' }),
  mileage: z.number({ message: 'Pflichtfeld' } as any)
    .min(0, { message: 'Darf nicht negativ sein' })
    .max(500000, { message: 'Maximal 500.000 km' }),
  equipment: z.array(z.string()),
  condition: z.string().min(1, { message: 'Bitte wählen Sie den Zustand' })
});

type FormValues = z.infer<typeof schema>;

const EQUIPMENT_OPTIONS = [
  'Navigationssystem', 'Sitzheizung', 'LED-Scheinwerfer', 'Panoramadach',
  'Rückfahrkamera', 'Standheizung', 'Anhängerkupplung', 'Sportpaket'
];

const CONDITIONS = [
  { id: 'Neuwertig', desc: 'Keine Kratzer, scheckheftgepflegt, wie neu.' },
  { id: 'Sehr gut', desc: 'Minimale Gebrauchsspuren, technisch einwandfrei.' },
  { id: 'Gut', desc: 'Normale Gebrauchsspuren, keine größeren Schäden.' },
  { id: 'Akzeptabel', desc: 'Sichtbare Kratzer oder Dellen, fahrbereit.' },
  { id: 'Mangelhaft', desc: 'Reparaturbedarf, größere Mängel vorhanden.' },
];

export default function TradeInPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const { control, watch, setValue, trigger, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      brand: '',
      model: '',
      year: undefined,
      mileage: undefined,
      equipment: [],
      condition: ''
    },
    mode: 'onChange'
  });

  const values = watch();

  const handleNext = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) fieldsToValidate = ['brand'];
    if (step === 2) fieldsToValidate = ['model'];
    if (step === 3) fieldsToValidate = ['year', 'mileage'];
    if (step === 4) fieldsToValidate = ['equipment'];
    if (step === 5) fieldsToValidate = ['condition'];

    const isValid = await trigger(fieldsToValidate as any);
    if (isValid && step < 6) {
      setDirection(1);
      setStep(s => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(s => s - 1);
    }
  };

  const isStepValid = () => {
    if (step === 1) return !!values.brand;
    if (step === 2) return !!values.model;
    if (step === 3) return !!values.year && !!values.mileage && !errors.year && !errors.mileage;
    if (step === 4) return true; // optional
    if (step === 5) return !!values.condition;
    return true;
  };

  // Mock models based on brand
  const currentModels = values.brand 
    ? [`${values.brand} Kompakt`, `${values.brand} Limousine`, `${values.brand} Kombi`, `${values.brand} SUV`, `${values.brand} Sport`]
    : [];

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 50 : -50,
      opacity: 0
    })
  };

  return (
    <main className="min-h-screen bg-neutral-50 pb-20">
      <section className="relative pt-32 pb-20 bg-neutral-900 overflow-hidden min-h-[40vh] flex items-center justify-center w-full mb-12">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/images/inz_hero.png')] bg-cover bg-center opacity-40 mix-blend-luminosity grayscale" />
        </div>
        <div className="relative max-w-[1200px] mx-auto px-4 md:px-8 w-full text-center z-10 mt-12">
          <p className="text-xs font-semibold uppercase tracking-wider text-red-500 mb-4 flex items-center justify-center gap-3">
            <span className="w-8 h-[1px] bg-red-600" /> Inzahlungnahme · Bewertung <span className="w-8 h-[1px] bg-red-600" />
          </p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1]"
          >
            Was ist Ihr Fahrzeug wert?
          </motion.h1>
          <p className="text-lg text-neutral-300 max-w-xl mx-auto">
            Finden Sie in wenigen Schritten den aktuellen Marktwert Ihres Fahrzeugs heraus. Unverbindlich und transparent.
          </p>
        </div>
      </section>

      <section className="w-full max-w-[1200px] mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="w-full flex flex-col">

        {/* Progress Bar */}
        <div className="relative mb-12 px-2">
          <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 rounded-full bg-neutral-200" />
          <motion.div 
            className="absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded-full bg-red-600"
            style={{ width: `${((step - 1) / 5) * 100}%` }}
            layout
          />
          <div className="relative flex justify-between">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all z-10 shadow-sm",
                  i < step ? "bg-red-600 text-white" : 
                  i === step ? "bg-neutral-900 text-white ring-4 ring-neutral-900/20" : 
                  "bg-white text-neutral-400 border border-neutral-200"
                )}
              >
                {i < step ? <Check size={16} /> : i}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            <span>Start</span>
            <span>Ergebnis</span>
          </div>
        </div>

        {/* Wizard Card */}
        <div className="rounded-3xl bg-white border border-neutral-200/60 shadow-xl overflow-hidden flex flex-col min-h-[500px]">
          <div className="flex-1 relative p-6 md:p-10 overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={step}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full"
              >
                {/* STEP 1: Brand */}
                {step === 1 && (
                  <div className="flex flex-col h-full">
                    <h2 className="flex items-center gap-3 font-display text-2xl font-bold text-neutral-900 mb-8 tracking-tight">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
                        <CarFront size={20} />
                      </div>
                      Marke wählen
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {BRANDS.map(brand => (
                        <button
                          key={brand}
                          onClick={() => {
                            setValue('brand', brand, { shouldValidate: true });
                            setValue('model', '');
                            setTimeout(handleNext, 300);
                          }}
                          className={cn(
                            "py-4 px-3 rounded-xl font-bold text-[15px] transition-all border",
                            values.brand === brand
                              ? "bg-neutral-900 text-white border-neutral-900 shadow-md scale-[1.02]"
                              : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 active:scale-95"
                          )}
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2: Model */}
                {step === 2 && (
                  <div className="flex flex-col h-full">
                    <h2 className="flex items-center gap-3 font-display text-2xl font-bold text-neutral-900 mb-8 tracking-tight">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
                        <CarFront size={20} />
                      </div>
                      Modell wählen
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentModels.map(model => (
                        <button
                          key={model}
                          onClick={() => {
                            setValue('model', model, { shouldValidate: true });
                            setTimeout(handleNext, 300);
                          }}
                          className={cn(
                            "flex justify-between items-center p-4 rounded-xl font-bold text-[15px] transition-all border",
                            values.model === model
                              ? "bg-neutral-900 text-white border-neutral-900 shadow-md scale-[1.02]"
                              : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 active:scale-95"
                          )}
                        >
                          <span>{model}</span>
                          {values.model === model && <Check size={20} className="text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 3: Year & Mileage */}
                {step === 3 && (
                  <div className="flex flex-col h-full">
                    <h2 className="flex items-center gap-3 font-display text-2xl font-bold text-neutral-900 mb-8 tracking-tight">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
                        <Calendar size={20} />
                      </div>
                      Alter & Laufleistung
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                      <div className="flex flex-col">
                        <label className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
                          <Calendar size={16} className="text-neutral-400" /> Erstzulassung (Jahr)
                        </label>
                        <Controller
                          name="year"
                          control={control}
                          render={({ field }) => (
                            <div>
                              <input
                                {...field}
                                type="number"
                                placeholder="z.B. 2018"
                                value={field.value || ''}
                                onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                className={cn(
                                  "w-full rounded-xl border bg-white px-4 py-3.5 text-[15px] text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:ring-4",
                                  errors.year ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-neutral-200 focus:border-neutral-400 focus:ring-neutral-100"
                                )}
                              />
                              {errors.year && <p className="mt-2 text-sm font-semibold text-red-600">{errors.year.message}</p>}
                            </div>
                          )}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
                          <Gauge size={16} className="text-neutral-400" /> Kilometerstand
                        </label>
                        <Controller
                          name="mileage"
                          control={control}
                          render={({ field }) => (
                            <div>
                              <input
                                {...field}
                                type="number"
                                placeholder="z.B. 45000"
                                value={field.value || ''}
                                onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                className={cn(
                                  "w-full rounded-xl border bg-white px-4 py-3.5 text-[15px] text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:ring-4",
                                  errors.mileage ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-neutral-200 focus:border-neutral-400 focus:ring-neutral-100"
                                )}
                              />
                              {errors.mileage && <p className="mt-2 text-sm font-semibold text-red-600">{errors.mileage.message}</p>}
                            </div>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: Equipment */}
                {step === 4 && (
                  <div className="flex flex-col h-full">
                    <h2 className="flex items-center gap-3 font-display text-2xl font-bold text-neutral-900 mb-2 tracking-tight">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
                        <Sparkles size={20} />
                      </div>
                      Sonderausstattung
                    </h2>
                    <p className="text-neutral-500 mb-8 ml-13 pl-13">Wählen Sie alle zutreffenden Merkmale aus.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {EQUIPMENT_OPTIONS.map(eq => {
                        const isSelected = values.equipment?.includes(eq);
                        return (
                          <button
                            key={eq}
                            onClick={() => {
                              const curr = values.equipment || [];
                              const next = isSelected ? curr.filter(x => x !== eq) : [...curr, eq];
                              setValue('equipment', next);
                            }}
                            className={cn(
                              "flex items-center gap-3 p-4 rounded-xl transition-all border text-left",
                              isSelected
                                ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                                : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                            )}
                          >
                            <div className={cn(
                              "flex h-5 w-5 items-center justify-center rounded transition-colors",
                              isSelected ? "bg-red-600 text-white" : "bg-white border border-neutral-300 text-transparent"
                            )}>
                              {isSelected && <Check size={14} />}
                            </div>
                            <span className="font-semibold">{eq}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 5: Condition */}
                {step === 5 && (
                  <div className="flex flex-col h-full">
                    <h2 className="flex items-center gap-3 font-display text-2xl font-bold text-neutral-900 mb-8 tracking-tight">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
                        <Wrench size={20} />
                      </div>
                      Fahrzeugzustand
                    </h2>
                    <div className="flex flex-col gap-3">
                      {CONDITIONS.map(cond => (
                        <button
                          key={cond.id}
                          onClick={() => setValue('condition', cond.id, { shouldValidate: true })}
                          className={cn(
                            "flex justify-between items-center p-4 rounded-xl transition-all border text-left",
                            values.condition === cond.id
                              ? "bg-neutral-900 text-white border-neutral-900 shadow-md scale-[1.01]"
                              : "bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                          )}
                        >
                          <div className="flex flex-col gap-1 pr-4">
                            <span className={cn("font-bold text-[15px]", values.condition === cond.id ? "text-white" : "text-neutral-900")}>{cond.id}</span>
                            <span className={cn("text-sm", values.condition === cond.id ? "text-neutral-400" : "text-neutral-500")}>
                              {cond.desc}
                            </span>
                          </div>
                          <div className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full border flex-shrink-0 transition-colors",
                            values.condition === cond.id ? "border-red-600 bg-red-600 text-white" : "border-neutral-300 text-transparent"
                          )}>
                            {values.condition === cond.id && <Check size={14} />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 6: Result */}
                {step === 6 && (
                  <div className="flex flex-col items-center justify-center h-full text-center py-8">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20, duration: 0.5 }}
                      className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 mb-6 shadow-sm"
                    >
                      <CircleDollarSign size={40} />
                    </motion.div>
                    
                    <motion.h3 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-[13px] font-bold uppercase tracking-wider text-neutral-500 mb-2"
                    >
                      Geschätzter Ankaufswert
                    </motion.h3>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="font-display text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 mb-4"
                    >
                      € 18.450 <span className="text-neutral-300 mx-2">–</span> 21.200
                    </motion.div>

                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-lg text-neutral-500 mb-10 max-w-lg"
                    >
                      Dieser Wert basiert auf aktuellen Marktdaten für einen <span className="font-bold text-neutral-900">{values.brand} {values.model}</span> (Bj. {values.year}) mit {values.mileage} km.
                    </motion.p>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl"
                    >
                      <button className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white border border-neutral-200/60 transition-all hover:border-neutral-300 hover:bg-neutral-50 hover:-translate-y-1 group shadow-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200 transition-colors">
                          <BarChart3 size={24} />
                        </div>
                        <span className="font-bold text-neutral-900">Direkt verkaufen</span>
                      </button>
                      <button className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-neutral-900 border border-neutral-900 text-white transition-all hover:bg-neutral-800 hover:-translate-y-1 group shadow-xl">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white group-hover:bg-white/20 transition-colors">
                          <Repeat size={24} />
                        </div>
                        <span className="font-bold">Inzahlung geben</span>
                      </button>
                      <button className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white border border-neutral-200/60 transition-all hover:border-neutral-300 hover:bg-neutral-50 hover:-translate-y-1 group shadow-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200 transition-colors">
                          <Info size={24} />
                        </div>
                        <span className="font-bold text-neutral-900">Inserieren</span>
                      </button>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Footer */}
          {step < 6 && (
            <div className="p-6 border-t border-neutral-200/60 bg-neutral-50 flex items-center justify-between">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl px-6 py-3 text-[15px] font-semibold transition-all",
                  step === 1
                    ? "opacity-0 pointer-events-none"
                    : "text-neutral-600 hover:bg-neutral-200/50 hover:text-neutral-900"
                )}
              >
                <ArrowLeft size={18} />
                Zurück
              </button>
              
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-[15px] font-bold text-white transition-all shadow-sm",
                  isStepValid()
                    ? "bg-red-600 hover:bg-red-700 hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                    : "bg-neutral-300 cursor-not-allowed"
                )}
              >
                Weiter
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
        </div>

        {/* Side Panel */}
        <div className="hidden lg:block relative w-full h-full min-h-[500px] rounded-3xl overflow-hidden shadow-xl border border-neutral-200/60 bg-white">
          <AnimatePresence mode="wait">
            {step <= 2 && (
              <motion.img
                key="img1"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                src="/images/inz_side1.png"
                alt="Lifestyle 1"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            {step >= 3 && step <= 4 && (
              <motion.img
                key="img2"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                src="/images/inz_side2.png"
                alt="Lifestyle 2"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            {step >= 5 && (
              <motion.img
                key="img3"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                src="/images/inz_side3.png"
                alt="Lifestyle 3"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <h3 className="font-display text-2xl font-bold mb-2">Einfach, sicher, fair.</h3>
            <p className="text-neutral-300">Wir bewerten Ihr Fahrzeug objektiv und machen Ihnen ein faires Angebot. Profitieren Sie von unserer Erfahrung.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
