import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppHeader } from '@/components/layout';
import { PatientSelector } from '@/components/ui';
import { dataService } from '@/services/dataService';
import { 
  Calendar, Pill, Stethoscope, ChevronRight, Activity, 
  FlaskConical, Clock, HeartPulse
} from 'lucide-react';

export function CarePage() {
  const allPatients = dataService.patients.getAll();
  const [selectedPatientId, setSelectedPatientId] = useState(allPatients[1]?.id ?? allPatients[0].id);

  const selectedPatient = allPatients.find((p) => p.id === selectedPatientId);

  // Data Sources
  const todaysCare = dataService.care.getTodaysCare().filter(c => c.patientName === selectedPatient?.name);
  const activeServices = dataService.care.getActiveServices().filter(s => s.patientName === selectedPatient?.name);
  const records = dataService.healthRecords.getAll().filter(r => r.patientName === selectedPatient?.name);
  const orders = dataService.orders.getAll();
  
  const patientOrders = orders.filter(o => o.details.includes(selectedPatient?.name || ''));
  const activeMeds = records.filter((r) => r.type === 'medication');

  // Compile Timeline Items
  const timelineItems = [
    ...todaysCare.map(item => ({
      id: `tc-${item.id}`,
      day: 'Today',
      time: item.time,
      title: item.title,
      type: item.type,
      desc: item.details
    })),
    ...patientOrders.filter(o => o.status === 'upcoming').map(order => {
      let day = 'Next Week';
      if (order.date.includes('09') || order.date.includes('Tomorrow')) day = 'Tomorrow';
      else if (order.date.includes('10')) day = 'Next Week';
      
      return {
        id: `o-${order.id}`,
        day,
        time: 'Scheduled',
        title: order.title,
        type: order.type,
        desc: order.details
      };
    })
  ];

  // Group by day
  const timelineGroups = [
    { label: 'Today', items: timelineItems.filter(i => i.day === 'Today') },
    { label: 'Tomorrow', items: timelineItems.filter(i => i.day === 'Tomorrow') },
    { label: 'Next Week', items: timelineItems.filter(i => i.day === 'Next Week') },
  ].filter(g => g.items.length > 0);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'medicine': return <Pill size={16} />;
      case 'visit': 
      case 'home-care': return <HeartPulse size={16} />;
      case 'doctor':
      case 'appointment': return <Stethoscope size={16} />;
      case 'lab': return <FlaskConical size={16} />;
      default: return <Activity size={16} />;
    }
  };

  return (
    <div className="pb-24 lg:pb-12 bg-[#fbfcfb] min-h-screen">
      <AppHeader title="Care Plan & Timeline" />
      
      <main className="mx-auto max-w-3xl px-4 py-6 lg:px-8 space-y-8">
        
        {/* Patient Context Card */}
        <section className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-subtle">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <PatientSelector
              patients={allPatients}
              selectedId={selectedPatientId}
              onSelect={setSelectedPatientId}
              label="Selected Patient"
            />
            {selectedPatient && (
              <span className="text-xs font-semibold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-lg self-start sm:self-auto">
                {selectedPatient.age} yrs • {selectedPatient.gender}
              </span>
            )}
          </div>
          {selectedPatient?.conditions && selectedPatient.conditions.length > 0 && (
            <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mr-1">Tracked Conditions:</span>
              {selectedPatient.conditions.map((cond) => (
                <span key={cond} className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200/60">
                  {cond}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Timeline */}
        <section>
          {timelineGroups.length > 0 ? (
            <div className="space-y-8">
              {timelineGroups.map((group) => (
                <div key={group.label} className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-subtle">
                  <div className="flex items-center gap-2 mb-5 pb-3 border-b border-neutral-100">
                    <Calendar size={16} className="text-primary-700" />
                    <h2 className="text-sm font-bold text-neutral-900 tracking-tight">
                      {group.label}
                    </h2>
                  </div>
                  <div className="space-y-6">
                    {group.items.map((item) => (
                      <div key={item.id} className="flex gap-4 group">
                        <div className="w-16 shrink-0 pt-0.5 text-right">
                          <span className="text-xs font-bold text-neutral-900 block">{item.time}</span>
                          <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mt-0.5 block">{item.type}</span>
                        </div>
                        <div className="relative pb-6 border-l border-neutral-200 pl-6 group-last:border-transparent group-last:pb-0">
                          <div className="absolute -left-[1.05rem] top-0 flex h-7 w-7 items-center justify-center rounded-full bg-white border border-neutral-200 shadow-2xs text-primary-700">
                            {getIconForType(item.type)}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-neutral-900">{item.title}</h3>
                            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-white rounded-2xl border border-neutral-200/80 p-8 shadow-subtle">
              <Calendar size={36} className="mx-auto mb-3 text-neutral-300" />
              <p className="text-sm font-semibold text-neutral-800">No scheduled care events</p>
              <p className="text-xs text-neutral-400 mt-1">Visits, lab collections and dosages will show here.</p>
            </div>
          )}
        </section>

        {/* Current Active Care */}
        <section className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-subtle">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
            <h2 className="text-sm font-bold text-neutral-900 tracking-tight">Active Ongoing Care</h2>
            <span className="text-xs font-semibold text-neutral-400">{activeServices.length} Active</span>
          </div>
          <div className="divide-y divide-neutral-100">
            {activeServices.length > 0 ? activeServices.map((service) => (
              <div key={service.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                <div>
                  <h3 className="font-bold text-neutral-800">{service.title}</h3>
                  <p className="text-sm text-neutral-500 mt-1">{service.details}</p>
                </div>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md capitalize">
                  {service.status}
                </span>
              </div>
            )) : null}
            
            {activeMeds.length > 0 ? activeMeds.map((med) => (
              <div key={med.id} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                <div>
                  <h3 className="font-bold text-neutral-800">{med.title || med.details}</h3>
                  <p className="text-sm text-neutral-500 mt-1">Daily medication</p>
                </div>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md capitalize">
                  Active
                </span>
              </div>
            )) : null}

            {activeServices.length === 0 && activeMeds.length === 0 && (
              <p className="text-sm text-neutral-500 italic">No ongoing care services.</p>
            )}
          </div>
        </section>

        {/* Links */}
        <section className="grid grid-cols-2 gap-4">
          <Link to="/health-records" className="flex items-center justify-between p-4 bg-white border border-neutral-200 rounded-xl hover:border-primary-300 transition-colors">
            <div className="flex items-center gap-3">
              <Activity size={20} className="text-primary-600" />
              <span className="font-semibold text-neutral-800">Health Records</span>
            </div>
            <ChevronRight size={18} className="text-neutral-400" />
          </Link>
          <Link to="/orders" className="flex items-center justify-between p-4 bg-white border border-neutral-200 rounded-xl hover:border-primary-300 transition-colors">
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-primary-600" />
              <span className="font-semibold text-neutral-800">All Orders</span>
            </div>
            <ChevronRight size={18} className="text-neutral-400" />
          </Link>
        </section>

      </main>
    </div>
  );
}
