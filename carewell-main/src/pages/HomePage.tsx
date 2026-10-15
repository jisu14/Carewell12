import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell, MapPin, Search, ChevronRight, Stethoscope, FlaskConical, Pill, Heart, FileText, ArrowRight,
  ShieldCheck, Calendar, Activity, Sparkles, Clock, CheckCircle2, PhoneCall, AlertCircle, 
  HeartPulse, User, Award, Video, Check
} from 'lucide-react';
import { dataService } from '@/services/dataService';
import { PatientSelector, Rating, VerificationBadge, PriceDisplay } from '@/components/ui';

export function HomePage() {
  const navigate = useNavigate();
  const user = dataService.user.getCurrent();
  const allPatients = dataService.patients.getAll();
  const [selectedPatientId, setSelectedPatientId] = useState(allPatients[1]?.id ?? allPatients[0].id);
  const selectedPatient = allPatients.find(p => p.id === selectedPatientId);

  const providers = dataService.providers.getAll();
  const doctors = dataService.doctors.getAll();
  const orders = dataService.orders.getAll();
  const unreadCount = dataService.notifications.getUnreadCount();

  // Care items for active patient
  const todaysCareItems = useMemo(() => {
    const allCare = dataService.care.getTodaysCare();
    return allCare.filter(c => c.patientName === selectedPatient?.name);
  }, [selectedPatient?.name]);

  const upcomingOrders = useMemo(() => {
    return orders.filter(o => 
      (o.status === 'upcoming' || o.status === 'in-progress') &&
      (!selectedPatient?.name || o.details.includes(selectedPatient.name))
    ).slice(0, 3);
  }, [orders, selectedPatient?.name]);

  // Greeting calculation
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Quick Clinical Tags
  const quickSearchTags = [
    { label: 'Cardiologist', path: '/search?q=Cardiologist' },
    { label: 'Full Body Checkup', path: '/search?q=Full%20Body' },
    { label: 'Home ICU Nurse', path: '/home-care' },
    { label: 'Diabetes Meds', path: '/pharmacies' },
    { label: 'Physiotherapy', path: '/search?q=Physiotherapy' }
  ];

  // Core Service Pillars
  const servicePillars = [
    {
      title: 'Consult Specialists',
      desc: 'Instant video or clinic visits with top rated doctors',
      stat: '180+ Doctors Online',
      icon: Stethoscope,
      to: '/doctors',
      gradient: 'from-emerald-600 to-teal-700',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200/60',
      accentGlow: 'hover:border-emerald-500/50 hover:shadow-emerald-950/5'
    },
    {
      title: 'Certified Lab Tests',
      desc: 'NABL pathology with fast 60-min home sample pickup',
      stat: 'Home Sample Pickup',
      icon: FlaskConical,
      to: '/labs',
      gradient: 'from-blue-600 to-indigo-700',
      badgeBg: 'bg-blue-50 text-blue-800 border-blue-200/60',
      accentGlow: 'hover:border-blue-500/50 hover:shadow-blue-950/5'
    },
    {
      title: 'Doorstep Pharmacy',
      desc: 'Upload prescription for 100% verified medicine delivery',
      stat: 'Same-Day Express',
      icon: Pill,
      to: '/pharmacies',
      gradient: 'from-amber-600 to-orange-700',
      badgeBg: 'bg-amber-50 text-amber-900 border-amber-200/60',
      accentGlow: 'hover:border-amber-500/50 hover:shadow-amber-950/5'
    },
    {
      title: 'Home Care & Nursing',
      desc: 'Licensed nurses, geriatric attendants & post-op therapy',
      stat: 'Verified & Background-Checked',
      icon: Heart,
      to: '/home-care',
      gradient: 'from-rose-600 to-pink-700',
      badgeBg: 'bg-rose-50 text-rose-900 border-rose-200/60',
      accentGlow: 'hover:border-rose-500/50 hover:shadow-rose-950/5'
    },
  ];

  return (
    <div className="min-h-screen pb-28 lg:pb-16 text-neutral-900">
      
      {/* Luxury Sticky Top Bar */}
      <header className="sticky top-0 z-20 border-b border-neutral-200/70 bg-white/85 backdrop-blur-xl px-4 py-3 sm:px-6 lg:px-8 shadow-xs">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PatientSelector
              patients={allPatients}
              selectedId={selectedPatientId}
              onSelect={setSelectedPatientId}
              label="Active Health Profile"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-neutral-600 bg-white/90 px-3 py-1.5 rounded-full border border-neutral-200/80 shadow-2xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <MapPin size={13} className="text-emerald-700" />
              <span>{user.location}</span>
            </div>

            <a
              href="tel:+919847012345"
              className="flex items-center gap-1.5 rounded-full bg-rose-50 hover:bg-rose-100/80 px-3 py-1.5 text-xs font-bold text-rose-700 border border-rose-200/70 transition-colors shadow-2xs"
              title="24/7 Emergency Ambulance & Nursing SOS"
            >
              <PhoneCall size={13} className="animate-pulse" />
              <span className="hidden xs:inline">SOS Help</span>
            </a>

            <Link
              to="/notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200/80 bg-white/90 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors shadow-2xs"
              aria-label="Notifications"
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-extrabold text-white ring-2 ring-white shadow-xs px-1">
                  {unreadCount}
                </span>
              )}
            </Link>

            <Link
              to="/profile"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-neutral-900 to-neutral-700 text-xs font-bold text-white shadow-xs hover:ring-2 hover:ring-emerald-500/40 transition-all"
            >
              {user.name.charAt(0)}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 space-y-7">

        {/* Hero Banner: Greeting & Vitals Command Center */}
        <section className="relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-white p-5 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          {/* Subtle Ambient Background Light */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-gradient-to-br from-emerald-100/50 to-teal-100/30 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-12 h-48 w-48 rounded-full bg-emerald-50/50 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-extrabold text-emerald-800 border border-emerald-200/70 shadow-2xs">
                  <Sparkles size={12} className="text-emerald-600" />
                  Premier Care Coordinator
                </span>
                <span className="text-xs text-neutral-300">•</span>
                <span className="text-xs font-semibold text-neutral-500">
                  {selectedPatient?.relationship === 'self' ? 'Primary Member' : `${selectedPatient?.relationship} Profile`}
                </span>
                <span className="text-xs text-neutral-300">•</span>
                <span className="text-xs font-semibold text-neutral-500">
                  {selectedPatient?.gender}, {selectedPatient?.age} yrs
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 font-display">
                {greeting}, {user.name.split(' ')[0]}
              </h1>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Coordinating healthcare, appointments, and vitals for <span className="font-bold text-neutral-900">{selectedPatient?.name}</span>. Everything is on schedule today.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                to="/health-records"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-950 text-white px-4 py-2.5 text-xs sm:text-sm font-bold shadow-md shadow-neutral-900/10 transition-all hover:-translate-y-0.5"
              >
                <FileText size={16} />
                <span>Health Vault</span>
              </Link>
              <Link
                to="/care"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/80 px-4 py-2.5 text-xs sm:text-sm font-bold transition-all hover:-translate-y-0.5"
              >
                <HeartPulse size={16} className="text-emerald-700" />
                <span>Full Care Plan</span>
              </Link>
            </div>
          </div>

          {/* Real-time Health Vitals Ribbon */}
          <div className="relative z-10 mt-6 pt-5 border-t border-neutral-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-neutral-50 to-white p-3.5 border border-neutral-200/70 shadow-2xs hover:border-emerald-500/30 transition-all">
              <div className="flex items-center justify-between text-neutral-500 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">Blood Pressure</span>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base sm:text-lg font-extrabold text-neutral-950">120/80</span>
                <span className="text-[11px] text-neutral-500 font-medium">mmHg</span>
              </div>
              <p className="text-[10px] text-emerald-700 font-semibold mt-1">Normal & Controlled</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-neutral-50 to-white p-3.5 border border-neutral-200/70 shadow-2xs hover:border-emerald-500/30 transition-all">
              <div className="flex items-center justify-between text-neutral-500 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">Heart Rate</span>
                <Activity size={13} className="text-rose-500" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base sm:text-lg font-extrabold text-neutral-950">72</span>
                <span className="text-[11px] text-neutral-500 font-medium">bpm</span>
              </div>
              <p className="text-[10px] text-emerald-700 font-semibold mt-1">Resting Pulse Regular</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-neutral-50 to-white p-3.5 border border-neutral-200/70 shadow-2xs hover:border-emerald-500/30 transition-all">
              <div className="flex items-center justify-between text-neutral-500 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">Blood Oxygen</span>
                <span className="flex h-2 w-2 rounded-full bg-blue-500" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base sm:text-lg font-extrabold text-neutral-950">98%</span>
                <span className="text-[11px] text-neutral-500 font-medium">SpO2</span>
              </div>
              <p className="text-[10px] text-emerald-700 font-semibold mt-1">Optimal Saturation</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-emerald-50/60 to-white p-3.5 border border-emerald-200/70 shadow-2xs hover:border-emerald-500/40 transition-all">
              <div className="flex items-center justify-between text-emerald-800 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900">Next Dosage</span>
                <Clock size={13} className="text-emerald-700" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs sm:text-sm font-extrabold text-emerald-950 truncate">Metformin 500mg</span>
              </div>
              <p className="text-[10px] text-emerald-700 font-semibold mt-1">Scheduled at 8:00 PM</p>
            </div>
          </div>

          {/* Luxury Spotlight Search */}
          <div className="relative z-10 mt-5 pt-5 border-t border-neutral-100">
            <div
              onClick={() => navigate('/search')}
              className="group relative flex items-center rounded-2xl border border-neutral-200 bg-neutral-50/80 p-2.5 sm:p-3 hover:border-emerald-500/60 hover:bg-white transition-all cursor-pointer shadow-2xs hover:shadow-md hover:shadow-emerald-900/5"
            >
              <div className="pl-2 pr-3 text-neutral-400 group-hover:text-emerald-700 transition-colors">
                <Search size={19} />
              </div>
              <span className="text-xs sm:text-sm text-neutral-400 group-hover:text-neutral-700 font-medium flex-1">
                Search verified specialists, lab tests, home nursing, or prescribed medicines...
              </span>
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="rounded-lg bg-white border border-neutral-200/80 px-2 py-1 text-[11px] font-semibold text-neutral-500 shadow-2xs">
                  ⌘K Spotlight
                </span>
              </div>
            </div>

            {/* Quick Filter Tags */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 mr-1">
                Quick Search:
              </span>
              {quickSearchTags.map((tag) => (
                <button
                  key={tag.label}
                  onClick={() => navigate(tag.path)}
                  className="rounded-xl border border-neutral-200/80 bg-white/90 px-3 py-1 text-[11px] font-semibold text-neutral-600 hover:border-emerald-500/40 hover:text-emerald-900 hover:bg-emerald-50/60 transition-all shadow-2xs"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Premier Healthcare Pillars Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-neutral-950 tracking-tight font-display">
                Clinical Services & Care
              </h2>
              <p className="text-xs text-neutral-500 font-medium">
                Accredited medical consultations, diagnostics, and home healthcare
              </p>
            </div>
            <Link
              to="/explore"
              className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100/70 px-3 py-1.5 rounded-full border border-emerald-200/60 transition-colors"
            >
              All Specialties <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {servicePillars.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.title}
                  to={service.to}
                  className={`group relative flex flex-col justify-between rounded-3xl border border-neutral-200/80 bg-white p-5 shadow-subtle hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${service.accentGlow}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${service.gradient} text-white shadow-md shadow-neutral-900/10 group-hover:scale-105 transition-transform duration-300`}>
                        <Icon size={22} />
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold border ${service.badgeBg}`}>
                        {service.stat}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-extrabold text-neutral-950 group-hover:text-emerald-900 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed font-medium">
                      {service.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-neutral-800 group-hover:text-emerald-800">
                    <span>Book Service</span>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 group-hover:bg-emerald-100 group-hover:text-emerald-800 transition-colors">
                      <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Today's Care Journey & Upcoming Visits */}
        <section className="grid lg:grid-cols-12 gap-6">
          
          {/* Today's Live Care Journey */}
          <div className="lg:col-span-7 space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-extrabold text-neutral-950 tracking-tight font-display">
                    Today's Care Journey
                  </h2>
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <p className="text-xs text-neutral-500 font-medium">
                  Confirmed visits and scheduled treatments for {selectedPatient?.name}
                </p>
              </div>
              <Link
                to="/care"
                className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
              >
                View Full Timeline <ChevronRight size={14} />
              </Link>
            </div>

            <div className="rounded-3xl border border-neutral-200/80 bg-white divide-y divide-neutral-100 shadow-subtle overflow-hidden">
              {todaysCareItems.length > 0 ? (
                todaysCareItems.map((item) => {
                  const isInProgress = item.status === 'in-progress';
                  const isCompleted = item.status === 'completed';

                  return (
                    <div
                      key={item.id}
                      className="p-4 sm:p-5 flex items-start gap-4 hover:bg-neutral-50/60 transition-colors group"
                    >
                      <div className={`flex flex-col items-center justify-center rounded-2xl px-3 py-2.5 text-center min-w-[4rem] border ${
                        isInProgress
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : isCompleted
                          ? 'bg-neutral-100/70 border-neutral-200 text-neutral-500'
                          : 'bg-neutral-50 border-neutral-200/80 text-neutral-800'
                      }`}>
                        <Clock size={14} className={isInProgress ? 'text-emerald-600' : 'text-neutral-400'} />
                        <span className="text-[10px] font-extrabold mt-1 uppercase tracking-wider">{item.time}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-neutral-950 group-hover:text-emerald-900 transition-colors truncate">
                            {item.title}
                          </h3>
                          <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider border ${
                            isInProgress
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : isCompleted
                              ? 'bg-neutral-100 text-neutral-600 border-neutral-200'
                              : 'bg-blue-50 text-blue-800 border-blue-200'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-1 font-medium">{item.details}</p>
                        
                        <div className="mt-2.5 flex items-center gap-3">
                          {isInProgress && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Active Staff On-Site
                            </span>
                          )}
                          {isCompleted && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-neutral-500">
                              <Check size={12} className="text-emerald-600" /> Completed
                            </span>
                          )}
                        </div>
                      </div>

                      <ChevronRight size={17} className="text-neutral-300 group-hover:text-neutral-600 group-hover:translate-x-0.5 transition-transform self-center" />
                    </div>
                  );
                })
              ) : upcomingOrders.length > 0 ? (
                upcomingOrders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => navigate('/orders')}
                    className="p-4 sm:p-5 flex items-start gap-4 hover:bg-neutral-50/60 transition-colors cursor-pointer group"
                  >
                    <div className="flex flex-col items-center justify-center rounded-2xl bg-neutral-100 px-3 py-2 text-center min-w-[3.8rem] border border-neutral-200/70">
                      <Calendar size={14} className="text-neutral-500" />
                      <span className="text-xs font-bold text-neutral-900 mt-1">{order.date.substring(5)}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-neutral-950 group-hover:text-emerald-900 transition-colors truncate">
                          {order.title}
                        </h3>
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-emerald-800 border border-emerald-200/60">
                          {order.type}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1 line-clamp-1">{order.details}</p>
                    </div>

                    <ChevronRight size={17} className="text-neutral-300 group-hover:translate-x-0.5 transition-transform self-center" />
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 mb-3">
                    <CheckCircle2 size={24} />
                  </div>
                  <p className="text-sm font-bold text-neutral-900">All health tasks up to date</p>
                  <p className="text-xs text-neutral-500 mt-1">No pending visits or refills required right now.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Health Shortcuts & Tools */}
          <div className="lg:col-span-5 space-y-3.5">
            <div>
              <h2 className="text-lg font-extrabold text-neutral-950 tracking-tight font-display">
                Health Vault & Tools
              </h2>
              <p className="text-xs text-neutral-500 font-medium">Quick actions for medical management</p>
            </div>

            <div className="rounded-3xl border border-neutral-200/80 bg-white divide-y divide-neutral-100 shadow-subtle overflow-hidden">
              <Link to="/health-records" className="group flex items-center gap-3.5 p-4 hover:bg-neutral-50/80 transition-colors">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 border border-blue-200/60 group-hover:scale-105 transition-transform">
                  <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs sm:text-sm font-extrabold text-neutral-950 group-hover:text-emerald-900 transition-colors">
                      Prescriptions & Reports
                    </h3>
                    <span className="rounded-full bg-blue-50 px-1.5 py-0.2 text-[9px] font-bold text-blue-700 border border-blue-200/50">
                      Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 truncate mt-0.5">Access verified lab slips and digital prescriptions</p>
                </div>
                <ChevronRight size={16} className="text-neutral-300 group-hover:text-neutral-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </Link>

              <Link to="/pharmacies" className="group flex items-center gap-3.5 p-4 hover:bg-neutral-50/80 transition-colors">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 border border-amber-200/60 group-hover:scale-105 transition-transform">
                  <Pill size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs sm:text-sm font-extrabold text-neutral-950 group-hover:text-emerald-900 transition-colors">
                      Medication Refills
                    </h3>
                    <span className="rounded-full bg-amber-50 px-1.5 py-0.2 text-[9px] font-bold text-amber-700 border border-amber-200/50">
                      Fast Refill
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 truncate mt-0.5">Quick re-order of regular daily prescriptions</p>
                </div>
                <ChevronRight size={16} className="text-neutral-300 group-hover:text-neutral-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </Link>

              <Link to="/equipment" className="group flex items-center gap-3.5 p-4 hover:bg-neutral-50/80 transition-colors">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-purple-700 border border-purple-200/60 group-hover:scale-105 transition-transform">
                  <ShieldCheck size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs sm:text-sm font-extrabold text-neutral-950 group-hover:text-emerald-900 transition-colors">
                      Medical Equipment Rental
                    </h3>
                    <span className="rounded-full bg-purple-50 px-1.5 py-0.2 text-[9px] font-bold text-purple-700 border border-purple-200/50">
                      Doorstep
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 truncate mt-0.5">Hospital beds, monitors & oxygen concentrators</p>
                </div>
                <ChevronRight size={16} className="text-neutral-300 group-hover:text-neutral-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Verified Specialists */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-neutral-950 tracking-tight font-display">
                Top Specialists Available
              </h2>
              <p className="text-xs text-neutral-500 font-medium">
                Verified physicians ready for video consultation or hospital visit
              </p>
            </div>
            <Link
              to="/doctors"
              className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100/70 px-3 py-1.5 rounded-full border border-emerald-200/60 transition-colors"
            >
              All Doctors <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.slice(0, 3).map((doctor) => (
              <Link
                key={doctor.id}
                to={`/doctors/${doctor.id}`}
                className="group rounded-3xl border border-neutral-200/80 bg-white p-5 shadow-subtle hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-700 to-teal-600 text-white font-extrabold shadow-sm group-hover:scale-105 transition-transform">
                      <Stethoscope size={22} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1.5">
                        <h3 className="truncate font-extrabold text-neutral-950 group-hover:text-emerald-900 transition-colors text-sm sm:text-base">
                          {doctor.name}
                        </h3>
                        <VerificationBadge status={doctor.verification} />
                      </div>
                      <p className="text-xs font-semibold text-emerald-800 mt-0.5">{doctor.specialty}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Rating rating={doctor.rating} reviewCount={doctor.reviewCount} />
                        <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                          {doctor.experience}y exp
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl bg-neutral-50 p-2 border border-neutral-100">
                      <span className="text-[10px] text-neutral-400 font-semibold uppercase block">Next Slot</span>
                      <span className="font-bold text-neutral-900 truncate block mt-0.5">{doctor.nextSlot}</span>
                    </div>
                    <div className="rounded-xl bg-neutral-50 p-2 border border-neutral-100">
                      <span className="text-[10px] text-neutral-400 font-semibold uppercase block">Location</span>
                      <span className="font-bold text-neutral-900 truncate block mt-0.5">{doctor.location.split(',')[0]}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-neutral-100 flex items-center justify-between">
                  <PriceDisplay price={doctor.consultationFee} label="Fee" size="sm" />
                  <span className="inline-flex items-center gap-1 rounded-xl bg-neutral-900 group-hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-bold transition-colors shadow-2xs">
                    <Video size={13} />
                    <span>Book Visit</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Accredited Home Care Providers */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-neutral-950 tracking-tight font-display">
                Verified Care Providers Nearby
              </h2>
              <p className="text-xs text-neutral-500 font-medium">
                Licensed healthcare agencies operating in {user.location}
              </p>
            </div>
            <Link
              to="/home-care"
              className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100/70 px-3 py-1.5 rounded-full border border-emerald-200/60 transition-colors"
            >
              Full Directory <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {providers.slice(0, 4).map((provider) => (
              <div
                key={provider.id}
                onClick={() => navigate(`/home-care/provider/${provider.id}`)}
                className="group rounded-3xl border border-neutral-200/80 bg-white p-4.5 shadow-subtle hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-md">
                      {provider.providerType}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                      ★ {provider.rating}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-neutral-950 group-hover:text-emerald-900 transition-colors line-clamp-1">
                    {provider.name}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-1 font-medium">
                    {provider.services.join(' • ')}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                  <span className="flex items-center gap-1 font-medium text-neutral-600">
                    <MapPin size={12} className="text-emerald-700" /> {provider.distance} km
                  </span>
                  <span className="font-extrabold text-emerald-800 group-hover:translate-x-0.5 transition-transform">
                    Details →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}

