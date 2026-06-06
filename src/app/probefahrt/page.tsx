'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMotionTokens } from '@/lib/motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, ArrowRight, ArrowLeft, Calendar, Clock, User, ShieldCheck, CheckCircle2, ChevronLeft, ChevronRight, Info, Gauge } from 'lucide-react';
import { VEHICLES } from '@/lib/mock/vehicles';
import { formatPrice, formatPower } from '@/lib/format';
import { cn } from '@/lib/cn';

const schema = z.object({
  vehicleId: z.string().min(1, { message: 'Bitte wählen Sie ein Fahrzeug' }),
  date: z.string().min(1, { message: 'Bitte wählen Sie ein Datum' }),
  time: z.string().min(1, { message: 'Bitte wählen Sie eine Uhrzeit' }),
  firstName: z.string().min(1, { message: 'Pflichtfeld' }),
  lastName: z.string().min(1, { message: 'Pflichtfeld' }),
  email: z.string().email({ message: 'Ungültige E-Mail Adresse' }),
  phone: z.string().min(5, { message: 'Pflichtfeld' }),
  license: z.string().min(5, { message: 'Pflichtfeld' }),
  birthdate: z.string().min(5, { message: 'Pflichtfeld' }),
});

type FormValues = z.infer<typeof schema>;

const TIME_SLOTS = ['09:00', '10:30', '13:00', '14:30', '16:00', '17:30'];

export default function TestDrivePage() {
  const { getDuration, getDelay, shouldReduceMotion, getTransitionType } = useMotionTokens();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  
  // For calendar
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 5)); // June 2026 based on metadata
  
  const topVehicles = VEHICLES.slice(0, 4);

  const { control, watch, setValue, trigger, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      vehicleId: topVehicles[0].id,
      date: '',
      time: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      license: '',
      birthdate: ''
    },
    mode: 'onChange'
  });

  const values = watch();
  const selectedVehicle = VEHICLES.find(v => v.id === values.vehicleId) || topVehicles[0];

  const handleNext = async () => {
    let fieldsToValidate: (keyof FormValues)[] = [];
    if (step === 1) fieldsToValidate = ['vehicleId'];
    if (step === 2) fieldsToValidate = ['date', 'time'];
    if (step === 3) fieldsToValidate = ['firstName', 'lastName', 'email', 'phone', 'license', 'birthdate'];

    const isValid = await trigger(fieldsToValidate );
    if (isValid && step < 4) {
      setDirection(1);
      setStep(s => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 1 && step < 4) {
      setDirection(-1);
      setStep(s => s - 1);
    }
  };

  const isStepValid = () => {
    if (step === 1) return !!values.vehicleId;
    if (step === 2) return !!values.date && !!values.time;
    if (step === 3) return !errors.firstName && !errors.lastName && !errors.email && !errors.phone && !errors.license && !errors.birthdate && !!values.firstName;
    return true;
  };

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  // Adjust for Monday start (0 = Mon, 6 = Sun)
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const dayNum = i - startOffset + 1;
    if (dayNum > 0 && dayNum <= daysInMonth) return dayNum;
    return null;
  });

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 30 : -30, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 30 : -30, opacity: 0 })
  };

  return (
    <main>
      <section className="shell-container">
        <motion.div
          className="mb-12 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: getDuration(0.5), ease: "easeOut" as const }}
        >
          <p className="eyebrow mb-4">{'// Probefahrt'}</p>
          <h1 className="text-h1 mb-4">
            Probefahrt vereinbaren
          </h1>
          <p className="text-lg text-neutral-500">
            Erleben Sie Ihr Wunschfahrzeug hautnah. Wählen Sie Modell, Zeit und Ort — wir bereiten alles für Sie vor.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 items-start lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          {/* ---- Left: Wizard ---- */}
          <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden flex flex-col relative min-h-[40rem]">
            {/* Steps Header */}
            {step < 4 && (
              <div className="flex border-b border-neutral-200 bg-neutral-50/30">
                {[
                  { num: 1, label: 'Fahrzeug', icon: Info },
                  { num: 2, label: 'Termin', icon: Calendar },
                  { num: 3, label: 'Daten', icon: User }
                ].map((s) => (
                  <div 
                    key={s.num} 
                    className={cn(
                      "flex-1 p-4 flex flex-col sm:flex-row items-center justify-center gap-2 text-sm font-semibold transition-colors duration-150 border-b-2",
                      step === s.num ? "border-black text-black bg-white" : 
                      step > s.num ? "border-transparent text-neutral-500" : "border-transparent text-neutral-500/50"
                    )}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono",
                      step >= s.num ? "bg-black/10 text-black" : "bg-neutral-500/10"
                    )}>
                      {step > s.num ? <Check size={14} /> : s.num}
                    </div>
                    <span className="hidden sm:inline">{s.label}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex-1 p-6 sm:p-10 relative overflow-x-hidden">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={step}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: getDuration(0.3), ease: [0.16, 1, 0.3, 1]  }}
                >
                  {/* STEP 1: Vehicle */}
                  {step === 1 && (
                    <div className="flex flex-col gap-6">
                      <h2 className="text-2xl font-semibold mb-6">Wählen Sie ein Fahrzeug</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {topVehicles.map(v => (
                          <button
                            key={v.id}
                            onClick={() => {
                              setValue('vehicleId', v.id, { shouldValidate: true });
                            }}
                            className={cn(
                              "relative flex flex-col items-start p-4 rounded-xl border border-neutral-200 text-left transition-all duration-150 bg-white hover:border-black hover:bg-neutral-50/50",
                              values.vehicleId === v.id && "border-black bg-black/5 shadow-[0_0_0_1px_rgba(0,0,0,0.2)] scale-[0.98]"
                            )}
                          >
                            <div className="mb-3 aspect-[16/10] rounded-lg w-full overflow-hidden relative">
                              <img src={v.images?.[0] || '/images/hero-bg.png'} alt={v.model} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-xs text-neutral-500 uppercase tracking-wider">{v.make}</span>
                            <span className="font-semibold text-lg">{v.model}</span>
                            <span className="text-sm text-neutral-500 mb-3">{formatPower(v.kw, v.hp)}</span>
                            
                            <div className={cn(
                              "absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-150",
                              values.vehicleId === v.id ? "border-black bg-black text-white" : "border-neutral-500/30 bg-white/50 backdrop-blur-sm"
                            )}>
                              {values.vehicleId === v.id && <Check size={14} />}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Date & Time */}
                  {step === 2 && (
                    <div className="flex flex-col gap-6">
                      <h2 className="text-2xl font-semibold mb-6">Wann möchten Sie fahren?</h2>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {/* Calendar */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="font-semibold">{currentMonth.toLocaleString('de-DE', { month: 'long', year: 'numeric' })}</span>
                            <div className="flex gap-2">
                              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-1.5 rounded-lg border border-neutral-200 bg-transparent cursor-pointer hover:bg-neutral-50">
                                <ChevronLeft size={16} />
                              </button>
                              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-1.5 rounded-lg border border-neutral-200 bg-transparent cursor-pointer hover:bg-neutral-50">
                                <ChevronRight size={16} />
                              </button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-7 gap-1 text-center mb-2">
                            {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(d => (
                              <div key={d} className="text-xs font-medium text-neutral-500 py-2">{d}</div>
                            ))}
                          </div>
                          
                          <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map((day, i) => {
                              if (!day) return <div key={i} />;
                              
                              const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                              const isSelected = values.date === dateStr;
                              const isWeekend = i % 7 >= 5; // Sa = 5, So = 6
                              
                              return (
                                <button
                                  key={i}
                                  disabled={isWeekend}
                                  onClick={() => setValue('date', dateStr, { shouldValidate: true })}
                                  className={cn(
                                    "aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-150 min-h-[2.5rem] border-none cursor-pointer",
                                    isSelected ? "bg-black text-white shadow-sm scale-110 z-10" :
                                    isWeekend ? "text-neutral-500/30 bg-neutral-50/20 cursor-not-allowed" :
                                    "bg-neutral-50/50 text-black hover:bg-neutral-50"
                                  )}
                                >
                                  {day}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Times */}
                        <div>
                          <span className="font-semibold flex items-center gap-2 mb-4">
                            <Clock size={16} className="text-black" />
                            Uhrzeit wählen
                          </span>
                          <div className="grid grid-cols-2 gap-3">
                            {TIME_SLOTS.map(time => (
                              <button
                                key={time}
                                disabled={!values.date}
                                onClick={() => setValue('time', time, { shouldValidate: true })}
                                className={cn(
                                  "px-4 py-3 rounded-xl border border-neutral-200 text-sm font-mono font-semibold transition-all duration-150 min-h-[2.5rem] cursor-pointer",
                                  !values.date ? "opacity-50 cursor-not-allowed bg-white" :
                                  values.time === time
                                    ? "border-black bg-black/10 text-black shadow-[0_0_0_1px_rgba(0,0,0,0.2)]"
                                    : "bg-white text-black hover:border-black"
                                )}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                          {!values.date && (
                            <p className="text-xs text-neutral-500 mt-4 flex items-start gap-1.5">
                              <Info size={14} className="mt-[2px] shrink-0" />
                              Bitte wählen Sie zuerst ein Datum, um verfügbare Zeiten zu sehen.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Personal Data */}
                  {step === 3 && (
                    <div className="flex flex-col gap-6">
                      <h2 className="text-2xl font-semibold mb-6">Ihre Kontaktdaten</h2>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-semibold text-neutral-500">Vorname</label>
                          <Controller
                            name="firstName"
                            control={control}
                            render={({ field }) => (
                              <input {...field} className="input" />
                            )}
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-semibold text-neutral-500">Nachname</label>
                          <Controller
                            name="lastName"
                            control={control}
                            render={({ field }) => (
                              <input {...field} className="input" />
                            )}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-semibold text-neutral-500">E-Mail Adresse</label>
                          <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                              <input {...field} type="email" className={cn("input", errors.email && "border-red-500")} />
                            )}
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-semibold text-neutral-500">Telefonnummer</label>
                          <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                              <input {...field} type="tel" className="input font-mono" />
                            )}
                          />
                        </div>
                      </div>

                      <div className="border-t border-neutral-200 pt-6 mt-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                          <ShieldCheck size={16} className="text-black" />
                          Verifizierungsdaten
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-neutral-500">Führerschein-Nr.</label>
                            <Controller
                              name="license"
                              control={control}
                              render={({ field }) => (
                                <input {...field} className="input font-mono" placeholder="z.B. B1234567" />
                              )}
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-neutral-500">Geburtsdatum</label>
                            <Controller
                              name="birthdate"
                              control={control}
                              render={({ field }) => (
                                <input {...field} type="date" className="input" />
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: Success */}
                  {step === 4 && (
                    <div className="flex flex-col items-center justify-center text-center py-12">
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: getTransitionType('spring'), stiffness: 200, damping: 20, duration: getDuration(0.5) }}
                        className="mb-6 text-black"
                      >
                        <CheckCircle2 size={96} />
                      </motion.div>
                      <h2 className="text-3xl font-display font-semibold mb-4">Ihre Probefahrt ist gebucht!</h2>
                      <p className="text-neutral-500 mb-8 max-w-[28rem]">
                        Wir freuen uns auf Sie, {values.firstName}. Eine Bestätigung wurde soeben an <span className="font-semibold text-black">{values.email}</span> gesendet.
                      </p>
                      
                      <div className="w-full max-w-md bg-neutral-50/30 border border-neutral-200 rounded-xl p-5 text-left mb-8 flex flex-col gap-3">
                        <div className="flex justify-between items-center pb-3 border-b border-neutral-200/50">
                          <span className="text-sm text-neutral-500">Termin</span>
                          <span className="text-sm font-semibold font-mono">{values.date} · {values.time}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-neutral-500">Fahrzeug</span>
                          <span className="text-sm font-semibold">{selectedVehicle.make} {selectedVehicle.model}</span>
                        </div>
                      </div>

                      <button onClick={() => window.location.href = '/'} className="font-semibold text-sm text-black no-underline bg-transparent border-none cursor-pointer hover:underline">
                        Zurück zur Startseite
                      </button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Footer */}
            {step < 4 && (
              <div className="border-t border-neutral-200 bg-neutral-50/20 p-6 flex items-center justify-between mt-auto">
                <button
                  onClick={handleBack}
                  disabled={step === 1}
                  className={cn(
                    "flex items-center gap-2 font-semibold text-sm transition-all duration-150 min-h-[2.5rem] bg-transparent border-none cursor-pointer",
                    step === 1 ? "opacity-0 pointer-events-none" : "text-neutral-500 hover:text-black"
                  )}
                >
                  <ArrowLeft size={16} />
                  Zurück
                </button>
                
                <button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="flex min-h-[2.5rem] items-center gap-2 rounded-xl bg-black px-6 py-2.5 text-sm font-semibold text-white transition-all duration-150 shadow-sm border-none cursor-pointer hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {step === 3 ? 'Termin verbindlich buchen' : 'Weiter'}
                  {step < 3 && <ArrowRight size={16} />}
                </button>
              </div>
            )}
          </div>

          {/* ---- Right: Sticky Vehicle Info ---- */}
          <div className="hidden lg:block sticky top-32">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-500 mb-4">Ihre Auswahl</h3>
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
              <div className="mb-4 aspect-[16/10] rounded-xl w-full overflow-hidden relative">
                <img src={selectedVehicle.images?.[0] || '/images/hero-bg.png'} alt={selectedVehicle.model} className="w-full h-full object-cover" />
              </div>
              <div className="mb-4 pb-4 border-b border-neutral-200/50">
                <span className="text-xs text-neutral-500 uppercase tracking-wider block mb-1">{selectedVehicle.make}</span>
                <h4 className="font-display text-2xl font-semibold leading-tight">{selectedVehicle.model}</h4>
                <p className="text-sm text-neutral-500 mt-1">{selectedVehicle.variant}</p>
              </div>
              
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-500 flex items-center gap-2"><Gauge size={16} /> Leistung</span>
                  <span className="font-mono font-medium">{formatPower(selectedVehicle.kw, selectedVehicle.hp)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-500 flex items-center gap-2"><Calendar size={16} /> Erstzulassung</span>
                  <span className="font-mono font-medium">{selectedVehicle.year}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-500 flex items-center gap-2"><User size={16} /> Preis</span>
                  <span className="font-mono font-medium text-black">{formatPrice(selectedVehicle.price)}</span>
                </div>
              </div>

              {step > 1 && values.date && values.time && (
                <div className="mt-6 pt-4 border-t border-dashed border-neutral-200">
                  <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Gewählter Termin</p>
                  <div className="flex items-center gap-3 bg-neutral-50/50 p-3 rounded-xl border border-neutral-200">
                    <Calendar size={20} className="text-black" />
                    <div>
                      <div className="font-mono font-semibold text-sm">{values.date}</div>
                      <div className="text-xs text-neutral-500">{values.time} Uhr</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
