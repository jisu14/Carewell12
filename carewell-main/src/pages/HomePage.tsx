import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell, MapPin, Search, ChevronRight, Stethoscope, FlaskConical, Pill, Home, Heart, FileText, ArrowRight
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

  return (
    <div className="min-h-screen bg-neutral-50 pb-20 lg:pb-8">
      {/* Header Area */}
      <header className="bg-white border-b border-neutral-200 px-4 py-4 lg:px-8 sticky top-0 z-20">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div>
            <PatientSelector
              patients={allPatients}
              selectedId={selectedPatientId}
              onSelect={setSelectedPatientId}
              label="Caring for"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-neutral-500 bg-neutral-100 px-3 py-1.5 rounded-full">
              <MapPin size={14} />
              {user.location}
            </div>
            <Link
              to="/notifications"
              className="relative text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              <Bell size={22} />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-error-600 text-[9px] font-bold text-white ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </Link>
            <Link
              to="/profile"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-200"
            >
              {user.name.charAt(0)}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 lg:px-8 py-6 space-y-10">
        
        {/* Search */}
        <section>
          <div className="relative max-w-2xl mx-auto shadow-sm rounded-xl overflow-hidden bg-white border border-neutral-200 flex items-center focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all">
            <div className="pl-4 text-neutral-400">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search for doctors, medicines, tests..."
              className="w-full py-4 pl-3 pr-4 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none"
              onClick={() => navigate('/search')}
              readOnly
            />
          </div>
        </section>

        {/* Find Care (Core Actions) */}
        <section>
          <h2 className="text-base font-bold text-neutral-800 mb-4">Find Care</h2>
          <div className="grid grid-cols-4 gap-3 lg:gap-6">
            <Link to="/doctors" className="flex flex-col items-center gap-2 group">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-neutral-200 text-primary-600 group-hover:border-primary-600 group-hover:bg-primary-50 transition-colors shadow-sm">
                <Stethoscope size={24} />
              </div>
              <span className="text-xs font-medium text-neutral-700 text-center">Doctors</span>
            </Link>
            <Link to="/labs" className="flex flex-col items-center gap-2 group">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-neutral-200 text-primary-600 group-hover:border-primary-600 group-hover:bg-primary-50 transition-colors shadow-sm">
                <FlaskConical size={24} />
              </div>
              <span className="text-xs font-medium text-neutral-700 text-center">Lab Tests</span>
            </Link>
            <Link to="/pharmacies" className="flex flex-col items-center gap-2 group">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-neutral-200 text-primary-600 group-hover:border-primary-600 group-hover:bg-primary-50 transition-colors shadow-sm">
                <Pill size={24} />
              </div>
              <span className="text-xs font-medium text-neutral-700 text-center">Medicines</span>
            </Link>
            <Link to="/home-care" className="flex flex-col items-center gap-2 group">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-neutral-200 text-primary-600 group-hover:border-primary-600 group-hover:bg-primary-50 transition-colors shadow-sm">
                <Heart size={24} />
              </div>
              <span className="text-xs font-medium text-neutral-700 text-center">Home Care</span>
            </Link>
          </div>
        </section>

        {/* Current & Upcoming Care */}
        <section className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-neutral-800">Happening Today</h2>
              <Link to="/care" className="text-sm font-semibold text-primary-600 hover:underline flex items-center">
                My Care <ChevronRight size={16} />
              </Link>
            </div>
            <div className="bg-white border border-neutral-200 rounded-xl divide-y divide-neutral-100 shadow-sm">
              {upcomingCare.length > 0 ? (
                upcomingCare.map(order => (
                  <div key={order.id} className="p-4 flex gap-4 hover:bg-neutral-50 transition-colors cursor-pointer" onClick={() => navigate('/orders')}>
                    <div className="flex flex-col items-center min-w-[3.5rem]">
                      <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{order.date.substring(5)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-neutral-800">{order.title}</span>
                        <span className="text-[10px] font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                          {order.type}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1 line-clamp-1">{order.details}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-sm text-neutral-500">
                  No upcoming care scheduled for today.
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-neutral-800">Quick Actions</h2>
            </div>
            <div className="bg-white border border-neutral-200 rounded-xl divide-y divide-neutral-100 shadow-sm">
              <Link to="/health-records" className="flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors">
                <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg">
                  <FileText size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-neutral-800">Health Records</h3>
                  <p className="text-xs text-neutral-500">View recent lab reports and prescriptions</p>
                </div>
                <ChevronRight size={18} className="text-neutral-400" />
              </Link>
              <Link to="/pharmacies" className="flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors">
                <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-lg">
                  <Pill size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-neutral-800">Active Medicines</h3>
                  <p className="text-xs text-neutral-500">Manage refills for {selectedPatient?.name}</p>
                </div>
                <ChevronRight size={18} className="text-neutral-400" />
              </Link>
              <Link to="/equipment" className="flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors">
                <div className="bg-purple-50 text-purple-600 p-2.5 rounded-lg">
                  <Home size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-neutral-800">Medical Equipment</h3>
                  <p className="text-xs text-neutral-500">Rent hospital beds, oxygen cylinders</p>
                </div>
                <ChevronRight size={18} className="text-neutral-400" />
              </Link>
            </div>
          </div>
        </section>

        {/* Local Services */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-neutral-800">Available Nearby</h2>
            <Link to="/home-care" className="text-sm font-semibold text-primary-600 hover:underline flex items-center">
              View Directory <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {providers.slice(0, 4).map(provider => (
              <div key={provider.id} className="bg-white border border-neutral-200 rounded-xl p-4 hover:border-primary-300 transition-colors cursor-pointer shadow-sm" onClick={() => navigate(`/home-care/${provider.id}`)}>
                <h3 className="text-sm font-bold text-neutral-800 line-clamp-1">{provider.name}</h3>
                <p className="text-xs text-neutral-500 mt-1 line-clamp-1">{provider.services.join(', ')}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs font-semibold text-neutral-700">
                    <span className="text-warning-500">★</span> {provider.rating}
                  </div>
                  <span className="text-xs text-neutral-500">{provider.distance} km</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
