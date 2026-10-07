import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppHeader } from '@/components/layout';
import { dataService } from '@/services/dataService';
import { EmptyState } from '@/components/ui';
import { CheckCircle2, User, Calendar, Clock, ArrowRight, CheckCircle, Video, Phone, MessageSquare } from 'lucide-react';

export function DoctorBookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const doctor = dataService.doctors.getById(id || '');
  const patients = dataService.patients.getAll();

  const [step, setStep] = useState(1);
  const [patientId, setPatientId] = useState(patients[0]?.id);
  const [consultType, setConsultType] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [newOrderId, setNewOrderId] = useState('');

  if (!doctor) {
    return (
      <div className="pb-20 lg:pb-8">
        <AppHeader title="Book Consultation" showBack />
        <EmptyState title="Doctor not found" description="Cannot book this consultation" actionLabel="Go Back" actionTo="/doctors" />
      </div>
    );
  }

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleConfirm = () => {
    const selectedPatient = patients.find(p => p.id === patientId);
    const orderId = `tele-${Date.now()}`;
    
    // Add to mock persistence
    dataService.orders.addOrder({
      id: orderId,
      type: 'doctor',
      title: `Consultation with ${doctor.name}`,
      status: 'upcoming',
      amount: doctor.consultationFee,
      date: date,
      details: `${consultType} Consultation for ${selectedPatient?.name} at ${time}`,
    });

    setNewOrderId(orderId);
    setIsConfirmed(true);
  };

  const renderProgress = () => (
    <div className="mb-6">
      <div className="flex items-center justify-between px-2">
        {[1, 2, 3, 4, 5].map(num => (
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
          style={{ width: `${((step - 1) / 4) * 100}%` }}
        />
      </div>
    </div>
  );

  const timeSlots = ['10:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '02:30 PM', '04:00 PM'];
  const consultationTypes = [
    { id: 'Video', icon: <Video size={20} />, desc: 'Face-to-face video call' },
    { id: 'Audio', icon: <Phone size={20} />, desc: 'Voice call only' },
    { id: 'Chat', icon: <MessageSquare size={20} />, desc: 'Text-based consultation' },
  ];

  if (isConfirmed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 text-center">
        <div className="mb-6 rounded-full bg-emerald-100 p-6 text-emerald-600 shadow-sm animate-in zoom-in">
          <CheckCircle size={64} />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-neutral-800">Appointment Confirmed!</h1>
        <p className="mb-8 max-w-sm text-neutral-500">
          Your {consultType.toLowerCase()} consultation with {doctor.name} is scheduled for {date} at {time}.
        </p>
        <div className="flex w-full max-w-sm flex-col gap-3">
          <Link to={`/telemedicine/${newOrderId}`} className="rounded-2xl bg-primary-600 py-3.5 font-bold text-white shadow-sm transition-colors hover:bg-primary-700">
            Join Telemedicine Room Now
          </Link>
          <Link to="/orders" className="rounded-2xl border border-neutral-200 bg-white py-3.5 font-bold text-neutral-600 transition-colors hover:bg-neutral-50">
            View in Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-24 lg:pb-8">
      <AppHeader title="Book Consultation" showBack onBack={step > 1 ? handleBack : undefined} />
      
      <div className="mx-auto max-w-2xl px-4 py-6 lg:px-8">
        {renderProgress()}

        <div className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm">
          {step === 1 && (
            <div className="animate-in slide-in-from-right-8">
              <h2 className="mb-4 text-xl font-bold text-neutral-800">Who is the patient?</h2>
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
              <h2 className="mb-4 text-xl font-bold text-neutral-800">Consultation Type</h2>
              <div className="space-y-3">
                {consultationTypes.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setConsultType(c.id)}
                    className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-colors ${
                      consultType === c.id ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-600' : 'border-neutral-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${consultType === c.id ? 'bg-primary-100 text-primary-600' : 'bg-neutral-100 text-neutral-500'}`}>
                        {c.icon}
                      </div>
                      <div>
                        <div className="font-bold text-neutral-800">{c.id}</div>
                        <div className="text-sm text-neutral-500">{c.desc}</div>
                      </div>
                    </div>
                    {consultType === c.id && <CheckCircle2 className="text-primary-600" />}
                  </button>
                ))}
              </div>
              <button 
                disabled={!consultType}
                onClick={handleNext}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-600 py-3.5 font-bold text-white shadow-sm disabled:opacity-50"
              >
                Continue <ArrowRight size={18} />
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in slide-in-from-right-8">
              <h2 className="mb-4 text-xl font-bold text-neutral-800">Select Date</h2>
              <input 
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <button 
                disabled={!date}
                onClick={handleNext}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-600 py-3.5 font-bold text-white shadow-sm disabled:opacity-50"
              >
                Continue <ArrowRight size={18} />
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in slide-in-from-right-8">
              <h2 className="mb-4 text-xl font-bold text-neutral-800">Select Time</h2>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map(t => (
                  <button
                    key={t}
                    onClick={() => setTime(t)}
                    className={`rounded-xl border py-3 text-sm font-medium transition-colors ${
                      time === t ? 'border-primary-600 bg-primary-50 text-primary-600' : 'border-neutral-200 bg-white text-neutral-600 hover:border-primary-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <button 
                disabled={!time}
                onClick={handleNext}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-600 py-3.5 font-bold text-white shadow-sm disabled:opacity-50"
              >
                Continue to Review <ArrowRight size={18} />
              </button>
            </div>
          )}

          {step === 5 && (
            <div className="animate-in slide-in-from-right-8">
              <h2 className="mb-4 text-xl font-bold text-neutral-800">Review Appointment</h2>
              
              <div className="mb-6 overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50">
                <div className="border-b border-neutral-200 p-4">
                  <div className="font-bold text-neutral-800">{doctor.name}</div>
                  <div className="text-sm text-neutral-500">{doctor.specialty} • {doctor.systemOfMedicine}</div>
                </div>
                <div className="grid grid-cols-2 gap-y-4 p-4 text-sm">
                  <div>
                    <div className="font-medium text-neutral-500 flex items-center gap-1.5"><User size={14}/> Patient</div>
                    <div className="mt-1 font-semibold text-neutral-800">{patients.find(p => p.id === patientId)?.name}</div>
                  </div>
                  <div>
                    <div className="font-medium text-neutral-500 flex items-center gap-1.5"><Video size={14}/> Mode</div>
                    <div className="mt-1 font-semibold text-neutral-800">{consultType}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="font-medium text-neutral-500 flex items-center gap-1.5"><Calendar size={14}/> Schedule</div>
                    <div className="mt-1 font-semibold text-neutral-800">{date} at {time}</div>
                  </div>
                </div>
              </div>

              <div className="mb-8 space-y-3 rounded-2xl bg-primary-50 p-5">
                <div className="flex justify-between border-b border-primary-200 pb-3">
                  <span className="font-bold text-neutral-800">Consultation Fee</span>
                  <span className="font-bold text-primary-700 text-lg">
                    ₹{doctor.consultationFee}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 text-center">Payment will be processed before consultation.</p>
              </div>

              <button 
                onClick={handleConfirm}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-600 py-3.5 font-bold text-white shadow-sm hover:bg-primary-700 transition-colors"
              >
                Confirm Appointment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
