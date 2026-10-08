import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell, MapPin, Search, ChevronRight, Stethoscope, FlaskConical, Pill, Heart, FileText, ArrowRight,
  ShieldCheck, Calendar, Activity, Sparkles, Clock, CheckCircle2
} from 'lucide-react';
import { dataService } from '@/services/dataService';
import { PatientSelector } from '@/components/ui';

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

  const upcomingCare = orders.filter(o => o.status === 'upcoming' || o.status === 'in-progress').slice(0, 3);

  const careServices = [
    {
      title: 'Consult Specialists',
      subtitle: 'Video or clinic visits with top doctors',
      badge: '180+ Doctors',
      icon: Stethoscope,
      to: '/doctors',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200/60',
      iconBg: 'bg-emerald-600 text-white'
    },
    {
      title: 'Diagnostic Lab Tests',
      subtitle: 'Certified pathology with home sample pickup',
      badge: 'Home Pickup',
      icon: FlaskConical,
      to: '/labs',
      color: 'bg-blue-50 text-blue-800 border-blue-200/60',
      iconBg: 'bg-blue-600 text-white'
    },
    {
      title: 'Pharmacy & Refills',
      subtitle: 'Upload Rx for verified doorstep delivery',
      badge: 'Same-day',
      icon: Pill,
      to: '/pharmacies',
      color: 'bg-amber-50 text-amber-900 border-amber-200/60',
      iconBg: 'bg-amber-600 text-white'
    },
    {
      title: 'Home Care & Nursing',
      subtitle: 'Vetted nurses, attendants & post-op care',
      badge: 'Verified Staff',
      icon: Heart,
      to: '/home-care',
      color: 'bg-rose-50 text-rose-900 border-rose-200/60',
      iconBg: 'bg-rose-600 text-white'
    },
  ];

  const quickSearchTags = ['Cardiologist', 'Full Body Checkup', 'Diabetes Medicines', 'Home Nurse', 'Physiotherapy'];

  return (
    <div className="min-h-screen bg-[#fbfcfb] pb-24 lg:pb-12">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-20 border-b border-neutral-200/70 bg-white/95 backdrop-blur-md px-4 py-3.5 lg:px-8">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PatientSelector
              patients={allPatients}
              selectedId={selectedPatientId}
              onSelect={setSelectedPatientId}
              label="Active Profile"
            />
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-neutral-600 bg-neutral-100/80 px-3 py-1.5 rounded-full border border-neutral-200/60">
              <MapPin size={13} className="text-primary-700" />
              <span>{user.location}</span>
            </div>
            <Link
              to="/notifications"
              className="relative p-2 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-700 text-[10px] font-bold text-white ring-2 ring-white px-1">
                  {unreadCount}
                </span>
              )}
            </Link>
            <Link
              to="/profile"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-950 text-xs font-bold text-white shadow-xs hover:ring-2 hover:ring-primary-600/30 transition-all"
            >
              {user.name.charAt(0)}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 lg:px-8 py-6 space-y-8">
        
        {/* Patient Context Banner */}
        <section className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-subtle">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200/60">
                  <Activity size={12} className="text-emerald-700" /> Coordinated Health Plan
                </span>
                <span className="text-xs text-neutral-400">•</span>
                <span className="text-xs text-neutral-500">{selectedPatient?.gender}, {selectedPatient?.age} yrs</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                Care Dashboard for {selectedPatient?.name}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Manage upcoming clinical appointments, medication refills, and home health services.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/health-records"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2.5 text-xs sm:text-sm font-semibold shadow-xs transition-colors"
              >
                <FileText size={16} />
                <span>Health Records</span>
              </Link>
            </div>
          </div>

          {/* Quick Search Bar */}
          <div className="mt-5 pt-5 border-t border-neutral-100">
            <div
              onClick={() => navigate('/search')}
              className="group relative flex items-center rounded-xl border border-neutral-200 bg-neutral-50/70 p-2 sm:p-2.5 hover:border-primary-600/50 hover:bg-white transition-all cursor-pointer shadow-2xs"
            >
              <div className="pl-2 pr-3 text-neutral-400 group-hover:text-primary-700 transition-colors">
                <Search size={18} />
              </div>
              <span className="text-xs sm:text-sm text-neutral-400 group-hover:text-neutral-600 flex-1">
                Search specialists, diagnostics, home nurses, or prescribed medicines...
              </span>
              <span className="hidden sm:inline-block rounded-md bg-white border border-neutral-200 px-2 py-1 text-[11px] font-medium text-neutral-400 shadow-2xs">
                Press to search
              </span>
            </div>

            {/* Tags */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mr-1">Popular:</span>
              {quickSearchTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => navigate(`/search?q=${encodeURIComponent(tag)}`)}
                  className="rounded-lg border border-neutral-200/70 bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-600 hover:border-primary-600/40 hover:text-primary-800 hover:bg-primary-50/50 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Primary Care Services Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-neutral-900 tracking-tight">Clinical Services</h2>
              <p className="text-xs text-neutral-500">Accredited healthcare and wellness solutions</p>
            </div>
            <Link to="/explore" className="text-xs font-semibold text-primary-800 hover:underline flex items-center gap-1">
              All Services <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {careServices.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.title}
                  to={service.to}
                  className="group relative flex flex-col justify-between rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-subtle hover:shadow-card-hover hover:border-primary-600/40 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${service.iconBg} shadow-xs`}>
                        <Icon size={20} />
                      </div>
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-600">
                        {service.badge}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-neutral-900 group-hover:text-primary-800 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      {service.subtitle}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-neutral-700 group-hover:text-primary-800">
                    <span>Explore</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Today's Schedule & Quick Action Cards */}
        <section className="grid lg:grid-cols-12 gap-6">
          {/* Upcoming Schedule */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <h2 className="text-base font-bold text-neutral-900 tracking-tight">Scheduled Care & Visits</h2>
                <p className="text-xs text-neutral-500">Confirmed orders and medical appointments</p>
              </div>
              <Link to="/care" className="text-xs font-semibold text-primary-800 hover:underline flex items-center gap-1">
                Full Plan <ChevronRight size={14} />
              </Link>
            </div>

            <div className="rounded-2xl border border-neutral-200/80 bg-white divide-y divide-neutral-100 shadow-subtle overflow-hidden">
              {upcomingCare.length > 0 ? (
                upcomingCare.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => navigate('/orders')}
                    className="p-4 sm:p-5 flex items-start gap-4 hover:bg-neutral-50/70 transition-colors cursor-pointer group"
                  >
                    <div className="flex flex-col items-center justify-center rounded-xl bg-neutral-100 px-3 py-2 text-center min-w-[3.5rem] border border-neutral-200/60">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Date</span>
                      <span className="text-xs font-bold text-neutral-800">{order.date.substring(5)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-neutral-900 group-hover:text-primary-800 transition-colors truncate">
                          {order.title}
                        </h3>
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 border border-emerald-200/60 shrink-0">
                          {order.type}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1 line-clamp-1">{order.details}</p>
                      <div className="mt-2 flex items-center gap-3 text-[11px] text-neutral-400">
                        <span className="flex items-center gap-1 text-emerald-700 font-medium">
                          <CheckCircle2 size={12} /> Confirmed Coordinator
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-neutral-400 group-hover:translate-x-0.5 transition-transform shrink-0 self-center" />
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <Clock size={28} className="mx-auto text-neutral-300 mb-2" />
                  <p className="text-sm font-semibold text-neutral-700">No appointments scheduled today</p>
                  <p className="text-xs text-neutral-400 mt-1">Book a consultation or arrange a home nurse anytime.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Management Shortcuts */}
          <div className="lg:col-span-5">
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <h2 className="text-base font-bold text-neutral-900 tracking-tight">Health Records & Tools</h2>
                <p className="text-xs text-neutral-500">Quick access to medical files</p>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200/80 bg-white divide-y divide-neutral-100 shadow-subtle overflow-hidden">
              <Link to="/health-records" className="group flex items-center gap-3.5 p-4 hover:bg-neutral-50 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-200/50">
                  <FileText size={19} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-primary-800 transition-colors">
                    Prescriptions & Reports
                  </h3>
                  <p className="text-[11px] text-neutral-500 truncate">Access verified lab slips and digital prescriptions</p>
                </div>
                <ChevronRight size={16} className="text-neutral-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </Link>

              <Link to="/pharmacies" className="group flex items-center gap-3.5 p-4 hover:bg-neutral-50 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                  <Pill size={19} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-primary-800 transition-colors">
                    Medication Refill Request
                  </h3>
                  <p className="text-[11px] text-neutral-500 truncate">Re-order regular dosages for {selectedPatient?.name}</p>
                </div>
                <ChevronRight size={16} className="text-neutral-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </Link>

              <Link to="/equipment" className="group flex items-center gap-3.5 p-4 hover:bg-neutral-50 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700 border border-purple-200/50">
                  <ShieldCheck size={19} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-primary-800 transition-colors">
                    Medical Equipment Rental
                  </h3>
                  <p className="text-[11px] text-neutral-500 truncate">Hospital beds, monitors & oxygen concentrators</p>
                </div>
                <ChevronRight size={16} className="text-neutral-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </Link>
            </div>
          </div>
        </section>

        {/* Verified Nearby Providers */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-neutral-900 tracking-tight">Verified Providers Near You</h2>
              <p className="text-xs text-neutral-500">Licensed nursing and healthcare agencies in {user.location}</p>
            </div>
            <Link to="/home-care" className="text-xs font-semibold text-primary-800 hover:underline flex items-center gap-1">
              View Directory <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {providers.slice(0, 4).map((provider) => (
              <div
                key={provider.id}
                onClick={() => navigate(`/home-care/provider/${provider.id}`)}
                className="group rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-subtle hover:shadow-card-hover hover:border-primary-600/40 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      {provider.providerType}
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200/50">
                      ★ {provider.rating}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900 group-hover:text-primary-800 transition-colors line-clamp-1">
                    {provider.name}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
                    {provider.services.join(', ')}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-neutral-400" /> {provider.distance} km away
                  </span>
                  <span className="font-semibold text-primary-800 group-hover:translate-x-0.5 transition-transform">
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
