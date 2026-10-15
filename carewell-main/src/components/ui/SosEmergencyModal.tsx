import { useState, useEffect } from 'react';
import { 
  X, PhoneCall, AlertTriangle, ShieldAlert, 
  MapPin, Send, CheckCircle2, Navigation, Ambulance,
  HeartPulse, Building, Clock
} from 'lucide-react';
import { locationService } from '@/services/locationService';
import { dataService } from '@/services/dataService';

export function SosEmergencyModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [broadcastSent, setBroadcastSent] = useState(false);
  const location = locationService.getLocation();
  const family = dataService.patients.getAll();

  useEffect(() => {
    if (isOpen) {
      setBroadcastSent(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBroadcast = () => {
    setBroadcastSent(true);
    // In real app, sends SMS/WhatsApp alert via backend API
  };

  const hospitals = [
    { name: 'District General Hospital & Trauma Care', distance: '0.8 km', phone: '0491-2534567', time: '3 mins' },
    { name: 'Medical Trust Multi-Specialty & ICU', distance: '1.4 km', phone: '0491-2508899', time: '6 mins' },
    { name: 'CareWell Emergency Response Center', distance: '1.9 km', phone: '+91 98470 12345', time: '8 mins' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/70 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl border-2 border-red-500 max-h-[92vh] flex flex-col">
        {/* Header Alert Strip */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 text-white shadow-inner animate-pulse">
              <Ambulance size={24} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
                <AlertTriangle size={11} /> High Priority Alert
              </div>
              <h3 className="text-base font-black tracking-tight mt-0.5">Emergency SOS Response</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 text-white hover:bg-white/30 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5 space-y-5">
          {/* Direct Emergency Dispatch Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href="tel:108"
              className="flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-b from-red-600 to-red-700 p-4 text-white shadow-lg shadow-red-600/30 hover:from-red-700 hover:to-red-800 transition active:scale-95"
            >
              <PhoneCall size={24} className="animate-bounce" />
              <span className="text-xl font-black">108</span>
              <span className="text-[11px] font-semibold text-red-100">National Ambulance</span>
            </a>

            <a
              href="tel:112"
              className="flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-slate-900 p-4 text-white shadow-lg shadow-slate-900/30 hover:bg-slate-800 transition active:scale-95"
            >
              <ShieldAlert size={24} className="text-amber-400" />
              <span className="text-xl font-black">112</span>
              <span className="text-[11px] font-semibold text-slate-300">All-India Emergency</span>
            </a>
          </div>

          {/* Concierge Hotline */}
          <a
            href="tel:+919847012345"
            className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3.5 text-emerald-950 transition hover:bg-emerald-100/70"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <HeartPulse size={20} />
              </div>
              <div>
                <p className="text-xs font-black text-emerald-950">CareWell 24/7 Clinical Concierge</p>
                <p className="text-[11px] text-emerald-700">Paramedic & Nurse Home Dispatch Team</p>
              </div>
            </div>
            <span className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs">
              Call Now
            </span>
          </a>

          {/* Family Emergency Broadcast */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Family Emergency Broadcast</h4>
                <p className="text-[11px] text-slate-500">
                  Sends live GPS location & SOS notification to {family.length} family members
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-white p-2.5 border border-slate-200 text-xs text-slate-600">
              <MapPin size={15} className="text-red-500 shrink-0" />
              <span className="truncate font-medium">{location.displayName}</span>
              <span className="ml-auto font-mono text-[10px] text-slate-400">
                {location.coordinates.latitude.toFixed(3)}, {location.coordinates.longitude.toFixed(3)}
              </span>
            </div>

            {broadcastSent ? (
              <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-100 p-2.5 text-xs font-bold text-emerald-800">
                <CheckCircle2 size={16} />
                <span>SOS Alert Transmitted to Family Contacts!</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleBroadcast}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-red-700 transition"
              >
                <Send size={14} />
                <span>Transmit Emergency SOS to Family</span>
              </button>
            )}
          </div>

          {/* Nearest Hospitals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
              <Building size={14} className="text-slate-500" /> Nearest Emergency & Trauma Centers
            </h4>
            <div className="space-y-2">
              {hospitals.map((hosp) => (
                <div
                  key={hosp.name}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 text-xs shadow-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-slate-800 truncate">{hosp.name}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                        <Navigation size={11} /> {hosp.distance}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock size={11} /> ~{hosp.time}
                      </span>
                    </div>
                  </div>
                  <a
                    href={`tel:${hosp.phone}`}
                    className="flex items-center gap-1 rounded-lg bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 text-slate-800 font-bold shrink-0 transition"
                  >
                    <PhoneCall size={12} className="text-red-600" />
                    <span>Dial ER</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="border-t border-slate-100 bg-slate-50 p-3 text-center text-[10px] text-slate-400">
          In severe life-threatening emergencies, dial 108 or proceed directly to the nearest Emergency Department.
        </div>
      </div>
    </div>
  );
}
