import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppHeader } from '@/components/layout';
import { dataService } from '@/services/dataService';
import { EmptyState } from '@/components/ui';
import { CheckCircle2, User, Calendar, MapPin, ArrowRight, CheckCircle, Clock, Home } from 'lucide-react';
import type { CareItem } from '@/types';

export function LabBookingPage() {
  const { id, testId } = useParams();
  const navigate = useNavigate();
  const lab = dataService.laboratories.getAll().find(l => l.id === id);
  const test = lab?.tests.find(t => t.id === testId);
  const patients = dataService.patients.getAll();
  const addresses = dataService.addresses.getAll();

  const [step, setStep] = useState(1);
  const [patientId, setPatientId] = useState(patients[0]?.id);
  const [visitType, setVisitType] = useState<'home' | 'lab'>('home');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [addressId, setAddressId] = useState(addresses[0]?.id);
  
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [generatedRecordId, setGeneratedRecordId] = useState('');

  if (!lab || !test) {
    return (
      <div className="pb-20 lg:pb-8">
        <AppHeader title="Book Test" showBack />
        <EmptyState title="Test not found" description="Cannot book this test" actionLabel="Go Back" actionTo="/labs" />
      </div>
    );
  }

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const deliveryFee = visitType === 'home' ? 100 : 0;
  const totalAmount = test.price + deliveryFee;

  const handleConfirm = () => {
    const selectedPatient = patients.find(p => p.id === patientId);
    const orderId = `o-${Date.now()}`;
    const careItemId = `ci-${Date.now()}`;
    
    // Add to Orders
    dataService.orders.addOrder({
      id: orderId,
      type: 'lab',
      title: lab.name,
      status: 'upcoming',
      amount: totalAmount,
      date: date,
      details: `${test.name} — ${visitType === 'home' ? 'Home collection' : 'Lab visit'}`,
    });

    // Add to Today's Care / Upcoming Care
    const newCareItem: CareItem = {
      id: careItemId,
      type: 'lab',
      title: `${test.name} (${lab.name})`,
      patientName: selectedPatient?.name || 'Self',
      time: time,
      status: 'upcoming',
      details: visitType === 'home' ? 'Home sample collection' : 'Visit lab for sample',
    };
    // Add to orders
    dataService.orders.addOrder({
      id: `o${Date.now()}`,
      type: 'lab',
      title: `${test.name} at ${lab.name}`,
      status: 'upcoming',
      amount: totalAmount,
      date: date,
      details: visitType === 'home' ? 'Home Sample Collection' : 'Lab Visit',
    });

    // Mocking adding to care schedule by inserting at the top
    dataService.care.getTodaysCare().unshift(newCareItem);

    // MOCK: Auto-generate the lab report (for demonstration of the report workflow)
    // Normally this would happen days later, but we'll do it instantly for testing
    const recordId = `rec-${Date.now()}`;
    dataService.healthRecords.addRecord({
      id: recordId,
      type: 'lab-report',
      title: test.name,
      date: date,
      doctor: lab.name,
      patientName: selectedPatient?.name || 'Self',
      details: `Mock results for ${test.name}. All parameters are within normal limits.`,
      status: 'completed'
    });
    setGeneratedRecordId(recordId);

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

  if (isConfirmed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 text-center">
        <div className="mb-6 rounded-full bg-emerald-100 p-6 text-emerald-600 shadow-sm animate-in zoom-in">
          <CheckCircle size={64} />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-neutral-800">Booking Confirmed!</h1>
        <p className="mb-4 max-w-sm text-neutral-500">
          Your test has been scheduled.
        </p>
        
        <div className="mb-8 rounded-2xl bg-white p-4 border border-neutral-100 shadow-sm text-sm text-left max-w-sm w-full">
          <p className="font-semibold text-neutral-800 flex justify-between">
            Test: <span className="font-normal text-neutral-600">{test.name}</span>
          </p>
          <p className="font-semibold text-neutral-800 flex justify-between mt-1">
            Time: <span className="font-normal text-neutral-600">{date} at {time}</span>
          </p>
        </div>

        <div className="flex w-full max-w-sm flex-col gap-3">
          {/* Automatically skipping time to view the report */}
          <Link to={`/health-records/${generatedRecordId}`} className="rounded-2xl bg-primary-600 py-3.5 font-bold text-white shadow-sm transition-colors hover:bg-primary-700">
            View Lab Report (Mock)
          </Link>
          <Link to="/home" className="rounded-2xl border border-neutral-200 bg-white py-3.5 font-bold text-neutral-600 transition-colors hover:bg-neutral-50">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-24 lg:pb-8">
      <AppHeader title="Book Test" showBack onBack={step > 1 ? handleBack : undefined} />
      
      <div className="mx-auto max-w-2xl px-4 py-6 lg:px-8">
        {renderProgress()}

        <div className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm">
          {/* Step 1: Patient */}
          {step === 1 && (
            <div className="animate-in slide-in-from-right-8">
              <h2 className="mb-4 text-xl font-bold text-neutral-800">Select Patient</h2>
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

          {/* Step 2: Visit Type */}
          {step === 2 && (
            <div className="animate-in slide-in-from-right-8">
              <h2 className="mb-4 text-xl font-bold text-neutral-800">Collection Method</h2>
              
              <div className="space-y-3">
                <button
                  onClick={() => setVisitType('home')}
                  disabled={!test.homeCollection}
                  className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-colors ${
                    visitType === 'home' ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-600' : 'border-neutral-200 hover:border-primary-300'
                  } ${!test.homeCollection && 'opacity-50 cursor-not-allowed'}`}
                >
                  <div className={`rounded-full p-3 ${visitType === 'home' ? 'bg-primary-100 text-primary-600' : 'bg-neutral-100 text-neutral-500'}`}>
                    <Home size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-neutral-800">Home Collection</div>
                    <div className="text-sm text-neutral-500 mt-1">
                      {test.homeCollection ? 'A phlebotomist will visit your home to collect the sample.' : 'Not available for this test.'}
                    </div>
                  </div>
                  {visitType === 'home' && <CheckCircle2 className="text-primary-600" />}
                </button>

                <button
                  onClick={() => setVisitType('lab')}
                  className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-colors ${
                    visitType === 'lab' ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-600' : 'border-neutral-200 hover:border-primary-300'
                  }`}
                >
                  <div className={`rounded-full p-3 ${visitType === 'lab' ? 'bg-primary-100 text-primary-600' : 'bg-neutral-100 text-neutral-500'}`}>
                    <MapPin size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-neutral-800">Lab Visit</div>
                    <div className="text-sm text-neutral-500 mt-1">Visit {lab.name} at {lab.location}</div>
                  </div>
                  {visitType === 'lab' && <CheckCircle2 className="text-primary-600" />}
                </button>
              </div>

              <button 
                onClick={handleNext}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-600 py-3.5 font-bold text-white shadow-sm"
              >
                Continue <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* Step 3: Date & Time */}
          {step === 3 && (
            <div className="animate-in slide-in-from-right-8">
              <h2 className="mb-4 text-xl font-bold text-neutral-800">Select Date & Time</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700">Date</label>
                  <input 
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700">Time Slot</label>
                  <select 
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="">Select a time</option>
                    <option value="07:00 AM - 08:00 AM">07:00 AM - 08:00 AM</option>
                    <option value="08:00 AM - 09:00 AM">08:00 AM - 09:00 AM</option>
                    <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                    <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                  </select>
                </div>
              </div>
              <button 
                disabled={!date || !time}
                onClick={handleNext}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-600 py-3.5 font-bold text-white shadow-sm disabled:opacity-50"
              >
                Continue <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* Step 4: Address */}
          {step === 4 && (
            <div className="animate-in slide-in-from-right-8">
              <h2 className="mb-4 text-xl font-bold text-neutral-800">
                {visitType === 'home' ? 'Home Address' : 'Lab Details'}
              </h2>
              {visitType === 'home' ? (
                <div className="space-y-3">
                  {addresses.map(a => (
                    <button
                      key={a.id}
                      onClick={() => setAddressId(a.id)}
                      className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-colors ${
                        addressId === a.id ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-600' : 'border-neutral-200 hover:border-primary-300'
                      }`}
                    >
                      <div className="mt-0.5 rounded-full bg-white p-2 text-neutral-500 shadow-sm">
                        <Home size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-neutral-800">{a.label}</div>
                        <div className="text-sm text-neutral-500 mt-1">{a.address}</div>
                      </div>
                      {addressId === a.id && <CheckCircle2 className="text-primary-600" />}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
                  <p className="font-semibold text-neutral-800">{lab.name}</p>
                  <p className="mt-1 text-sm text-neutral-500">{lab.location}</p>
                  <p className="mt-2 text-xs text-neutral-400 flex items-center gap-1"><Clock size={14}/> Open: {lab.timings}</p>
                </div>
              )}

              <button 
                disabled={visitType === 'home' && !addressId}
                onClick={handleNext}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-600 py-3.5 font-bold text-white shadow-sm disabled:opacity-50"
              >
                Continue to Review <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div className="animate-in slide-in-from-right-8">
              <h2 className="mb-4 text-xl font-bold text-neutral-800">Review Booking</h2>
              
              <div className="mb-6 overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50">
                <div className="border-b border-neutral-200 p-4">
                  <div className="font-bold text-neutral-800">{test.name}</div>
                  <div className="text-sm text-neutral-500">{lab.name}</div>
                  {test.preparation && (
                    <div className="mt-2 text-xs font-medium text-warning-700 bg-warning-50 p-2 rounded-lg inline-block">
                      {test.preparation}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-y-4 p-4 text-sm">
                  <div>
                    <div className="font-medium text-neutral-500 flex items-center gap-1.5"><User size={14}/> Patient</div>
                    <div className="mt-1 font-semibold text-neutral-800">{patients.find(p => p.id === patientId)?.name}</div>
                  </div>
                  <div>
                    <div className="font-medium text-neutral-500 flex items-center gap-1.5"><Calendar size={14}/> Date</div>
                    <div className="mt-1 font-semibold text-neutral-800">{date}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="font-medium text-neutral-500 flex items-center gap-1.5">
                      {visitType === 'home' ? <Home size={14} /> : <MapPin size={14} />} 
                      {visitType === 'home' ? 'Home Collection' : 'Lab Visit'}
                    </div>
                    <div className="mt-1 font-semibold text-neutral-800">{time}</div>
                  </div>
                </div>
              </div>

              <div className="mb-8 space-y-3 rounded-2xl border border-neutral-100 bg-white p-5">
                <h3 className="font-semibold text-neutral-800 border-b border-neutral-50 pb-2 mb-3">Price Details</h3>
                
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Test Fee</span>
                  <span className="font-medium text-neutral-800">₹{test.price}</span>
                </div>
                {visitType === 'home' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Home Collection Fee</span>
                    <span className="font-medium text-neutral-800">₹{deliveryFee}</span>
                  </div>
                )}
                
                <div className="flex justify-between border-t border-neutral-100 pt-3 mt-1">
                  <span className="font-bold text-neutral-800">Total Payable</span>
                  <span className="font-bold text-primary-700 text-lg">
                    ₹{totalAmount}
                  </span>
                </div>
              </div>

              <button 
                onClick={handleConfirm}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-600 py-3.5 font-bold text-white shadow-sm hover:bg-primary-700 transition-colors"
              >
                Confirm & Pay
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
