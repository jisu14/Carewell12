import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppHeader } from '@/components/layout';
import { dataService } from '@/services/dataService';
import { EmptyState } from '@/components/ui';
import { CheckCircle2, ChevronRight, User, MapPin, Calendar, Clock, ArrowRight, CheckCircle } from 'lucide-react';

export function HomeCareBookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const provider = dataService.providers.getById(id || '');
  const patients = dataService.patients.getAll();
  const user = dataService.user.getCurrent();

  const [step, setStep] = useState(1);
  const [patientId, setPatientId] = useState(patients[1]?.id ?? patients[0].id);
  const [service, setService] = useState('');
  const [duration, setDuration] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [requirements, setRequirements] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!provider) {
    return (
      <div className="pb-20 lg:pb-8">
        <AppHeader title="Book Service" showBack />
        <EmptyState title="Provider not found" description="Cannot book this service" actionLabel="Go Back" actionTo="/home-care" />
      </div>
    );
  }

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleConfirm = () => {
    const selectedPatient = patients.find(p => p.id === patientId);
    
    // Add to mock persistence
    dataService.orders.addOrder({
      id: `o${Date.now()}`,
      type: 'home-care',
      title: provider.name,
      status: 'upcoming',
      amount: provider.startingPrice * (duration === '12h' ? 1.5 : duration === '24h' ? 2.5 : 1),
      date: date,
      details: `${service} for ${selectedPatient?.name} — ${duration}`,
    });

    setIsConfirmed(true);
  };

  const renderProgress = () => (
    <div className="mb-6">
      <div className="flex items-center justify-between px-2">
        {[1, 2, 3, 4, 5, 6, 7].map(num => (
          <div key={num} className="flex flex-col items-center">
            <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors ${
              step >= num ? 'bg-primary-600 text-white' : 'bg-neutral-200 text-neutral-500'
            }`}>
              {step > num ? <CheckCircle2 size={12} /> : num}
            </div>
          </div>
        ))}
      </div>
      <div className="relative mt-2 h-1 w-full rounded-full bg-neutral-200">
        <div 
          className="absolute left-0 top-0 h-full rounded-full bg-primary-600 transition-all"
          style={{ width: `${((step - 1) / 6) * 100}%` }}
        />
      </div>
    </div>
  );

  const durations = [
    { id: '4h', label: '4 Hours', desc: 'Short visit' },
    { id: '8h', label: '8 Hours', desc: 'Day shift' },
    { id: '12h', label: '12 Hours', desc: 'Extended day' },
    { id: '24h', label: '24 Hours', desc: 'Round the clock' },
  ];

  const timeSlots = ['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM'];

  if (isConfirmed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 text-center">
        <div className="mb-6 rounded-full bg-emerald-100 p-6 text-emerald-600 shadow-sm animate-in zoom-in">
          <CheckCircle size={64} />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-neutral-800">Booking Confirmed!</h1>
        <p className="mb-8 max-w-sm text-neutral-500">
          Your request for {service} with {provider.name} has been confirmed. A caregiver will be assigned shortly.
        </p>
        <div className="flex w-full max-w-sm flex-col gap-3">
          <Link to="/orders" className="rounded-2xl bg-primary-600 py-3.5 font-bold text-white shadow-sm transition-colors hover:bg-primary-700">
            View Booking in Orders
          </Link>
          <Link to="/home" className="rounded-2xl border border-neutral-200 bg-white py-3.5 font-bold text-neutral-600 transition-colors hover:bg-neutral-50">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-24 lg:pb-8">
      <AppHeader title="Book Service" showBack onBack={step > 1 ? handleBack : undefined} />
      
      <div className="mx-auto max-w-2xl px-4 py-6 lg:px-8">
        {renderProgress()}

        <div className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm">
          {step === 1 && (
            <div className="animate-in slide-in-from-right-8">
              <h2 className="mb-4 text-xl font-bold text-neutral-800">Who needs care?</h2>
              <div className="space-y-3">
                {patients.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPatientId(p.id)}
                    className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-colors ${
                      patientId === p.id ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-600' : 'border-neutral-200 hover:border-primary-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-neutral-800">{p.name}</div>
                      <div className="text-sm text-neutral-500 capitalize">{p.relationship} • {p.age} yrs • {p.gender}</div>
                    </div>
                    {patientId === p.id && <CheckCircle2 className="text-primary-600" />}
                  </button>
                ))}
              </div>
              <button 
                disabled={!patientId}
                onClick={handleNext}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-600 py-3.5 font-bold text-white shadow-sm disabled:opacity-50"
              >
                Continue <ArrowRight size={18} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in slide-in-from-right-8">
              <h2 className="mb-4 text-xl font-bold text-neutral-800">Select Service</h2>
              <div className="space-y-3">
                {provider.services.map(s => (
                  <button
                    key={s}
                    onClick={() => setService(s)}
                    className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-colors ${
                      service === s ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-600' : 'border-neutral-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="font-bold text-neutral-800">{s}</div>
                    {service === s && <CheckCircle2 className="text-primary-600" />}
                  </button>
                ))}
              </div>
              <button 
                disabled={!service}
                onClick={handleNext}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-600 py-3.5 font-bold text-white shadow-sm disabled:opacity-50"
              >
                Continue <ArrowRight size={18} />
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in slide-in-from-right-8">
              <h2 className="mb-4 text-xl font-bold text-neutral-800">Select Duration</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {durations.map(d => (
                  <button
                    key={d.id}
                    onClick={() => setDuration(d.id)}
                    className={`flex w-full flex-col rounded-2xl border p-4 text-left transition-colors ${
                      duration === d.id ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-600' : 'border-neutral-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="font-bold text-neutral-800">{d.label}</div>
                    <div className="mt-1 text-sm text-neutral-500">{d.desc}</div>
                  </button>
                ))}
              </div>
              <button 
                disabled={!duration}
                onClick={handleNext}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-600 py-3.5 font-bold text-white shadow-sm disabled:opacity-50"
              >
                Continue <ArrowRight size={18} />
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in slide-in-from-right-8">
              <h2 className="mb-4 text-xl font-bold text-neutral-800">When do you need it?</h2>
              
              <h3 className="mb-2 text-sm font-semibold text-neutral-700">Date</h3>
              <input 
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="mb-6 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />

              <h3 className="mb-2 text-sm font-semibold text-neutral-700">Start Time</h3>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map(t => (
                  <button
                    key={t}
                    onClick={() => setTime(t)}
                    className={`rounded-xl border py-2 text-sm font-medium transition-colors ${
                      time === t ? 'border-primary-600 bg-primary-50 text-primary-600' : 'border-neutral-200 bg-white text-neutral-600 hover:border-primary-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <button 
                disabled={!date || !time}
                onClick={handleNext}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-600 py-3.5 font-bold text-white shadow-sm disabled:opacity-50"
              >
                Continue <ArrowRight size={18} />
              </button>
            </div>
          )}

          {step === 5 && (
            <div className="animate-in slide-in-from-right-8">
              <h2 className="mb-4 text-xl font-bold text-neutral-800">Select Address</h2>
              <button
                onClick={() => handleNext()}
                className="flex w-full items-start gap-4 rounded-2xl border border-primary-600 bg-primary-50 p-4 text-left ring-1 ring-primary-600"
              >
                <div className="mt-0.5 rounded-full bg-primary-100 p-2 text-primary-600">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="font-bold text-neutral-800">Home</div>
                  <div className="mt-1 text-sm text-neutral-600">{user.location}</div>
                  <div className="mt-1 text-xs font-semibold text-primary-600">Default address</div>
                </div>
              </button>
              
              <button className="mt-3 flex w-full items-center justify-center rounded-2xl border border-dashed border-neutral-300 py-4 font-medium text-neutral-500 hover:bg-neutral-50 transition-colors">
                + Add new address
              </button>
            </div>
          )}

          {step === 6 && (
            <div className="animate-in slide-in-from-right-8">
              <h2 className="mb-2 text-xl font-bold text-neutral-800">Any specific requirements?</h2>
              <p className="mb-4 text-sm text-neutral-500">Provide details that will help the caregiver assist you better.</p>
              
              <textarea
                value={requirements}
                onChange={e => setRequirements(e.target.value)}
                placeholder="E.g., Needs help with mobility, specific diet, etc."
                rows={5}
                className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />

              <button 
                onClick={handleNext}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-600 py-3.5 font-bold text-white shadow-sm"
              >
                Continue to Review <ArrowRight size={18} />
              </button>
            </div>
          )}

          {step === 7 && (
            <div className="animate-in slide-in-from-right-8">
              <h2 className="mb-4 text-xl font-bold text-neutral-800">Review Booking</h2>
              
              <div className="mb-6 overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50">
                <div className="border-b border-neutral-200 p-4">
                  <div className="font-bold text-neutral-800">{provider.name}</div>
                  <div className="text-sm text-neutral-500">{service}</div>
                </div>
                <div className="grid grid-cols-2 gap-y-4 p-4 text-sm">
                  <div>
                    <div className="font-medium text-neutral-500 flex items-center gap-1.5"><User size={14}/> Patient</div>
                    <div className="mt-1 font-semibold text-neutral-800">{patients.find(p => p.id === patientId)?.name}</div>
                  </div>
                  <div>
                    <div className="font-medium text-neutral-500 flex items-center gap-1.5"><Clock size={14}/> Duration</div>
                    <div className="mt-1 font-semibold text-neutral-800">{durations.find(d => d.id === duration)?.label}</div>
                  </div>
                  <div>
                    <div className="font-medium text-neutral-500 flex items-center gap-1.5"><Calendar size={14}/> Starts</div>
                    <div className="mt-1 font-semibold text-neutral-800">{date} at {time}</div>
                  </div>
                  <div>
                    <div className="font-medium text-neutral-500 flex items-center gap-1.5"><MapPin size={14}/> Location</div>
                    <div className="mt-1 font-semibold text-neutral-800">Home</div>
                  </div>
                </div>
              </div>

              <div className="mb-8 space-y-3 rounded-2xl bg-primary-50 p-5">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Base Price (Per day/visit)</span>
                  <span className="font-medium">₹{provider.startingPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Duration Multiplier</span>
                  <span className="font-medium">x {duration === '12h' ? 1.5 : duration === '24h' ? 2.5 : 1}</span>
                </div>
                <div className="flex justify-between border-t border-primary-200 pt-3">
                  <span className="font-bold text-neutral-800">Total Amount</span>
                  <span className="font-bold text-primary-700 text-lg">
                    ₹{provider.startingPrice * (duration === '12h' ? 1.5 : duration === '24h' ? 2.5 : 1)}
                  </span>
                </div>
              </div>

              <button 
                onClick={handleConfirm}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-600 py-3.5 font-bold text-white shadow-sm hover:bg-primary-700 transition-colors"
              >
                Confirm Booking
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
