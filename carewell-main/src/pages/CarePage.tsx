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
    <div className="pb-20 lg:pb-8 bg-neutral-50 min-h-screen">
      <AppHeader title="Care Timeline" />
      
      <main className="mx-auto max-w-3xl px-4 py-6 lg:px-8">
        
        {/* Patient Header */}
        <header className="mb-8">
          <PatientSelector
            patients={allPatients}
            selectedId={selectedPatientId}
            onSelect={setSelectedPatientId}
            label="Care context"
          />
          {selectedPatient && (
            <div className="mt-4 border-l-2 border-neutral-300 pl-4 text-sm text-neutral-600">
              <p>{selectedPatient.age} years • {selectedPatient.gender}</p>
              {selectedPatient.conditions && selectedPatient.conditions.length > 0 && (
                <p className="mt-1">Conditions: {selectedPatient.conditions.join(', ')}</p>
              )}
            </div>
          )}
        </header>

        {/* Timeline */}
        <section className="mb-12">
          {timelineGroups.length > 0 ? (
            <div className="space-y-10">
              {timelineGroups.map((group) => (
                <div key={group.label}>
                  <h2 className="mb-4 text-lg font-bold text-neutral-800 border-b border-neutral-200 pb-2">
                    {group.label}
                  </h2>
                  <div className="space-y-6">
                    {group.items.map((item) => (
                      <div key={item.id} className="flex gap-4 group">
                        <div className="w-16 shrink-0 pt-0.5 text-right">
                          <span className="text-sm font-semibold text-neutral-800 block">{item.time}</span>
                          <span className="text-xs text-neutral-500 capitalize mt-1 block">{item.type}</span>
                        </div>
                        <div className="relative pb-6 border-l border-neutral-200 pl-6 group-last:border-transparent group-last:pb-0">
                          <div className="absolute -left-[1.1rem] top-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-white border border-neutral-200 shadow-sm text-neutral-600">
                            {getIconForType(item.type)}
                          </div>
                          <div>
                            <h3 className="font-bold text-neutral-800">{item.title}</h3>
                            <p className="text-sm text-neutral-600 mt-1">{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-white rounded-xl border border-neutral-200">
              <Calendar size={48} className="mx-auto mb-4 text-neutral-200" />
              <p className="text-sm font-medium text-neutral-500">No scheduled care events</p>
            </div>
          )}
        </section>

        {/* Current Active Care */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-neutral-800 border-b border-neutral-200 pb-2">Current Care</h2>
          <div className="space-y-4">
            {activeServices.length > 0 ? activeServices.map((service) => (
              <div key={service.id} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
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
