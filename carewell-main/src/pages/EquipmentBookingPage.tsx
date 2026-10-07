import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppHeader } from '@/components/layout';
import { dataService } from '@/services/dataService';
import { EmptyState } from '@/components/ui';
import { CheckCircle2, User, Calendar, Truck, ArrowRight, CheckCircle, Package } from 'lucide-react';
import type { ActiveService } from '@/types';

export function EquipmentBookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const equipment = dataService.equipment.getAll().find(e => e.id === id);
  const patients = dataService.patients.getAll();
  const addresses = dataService.addresses.getAll();

  const [step, setStep] = useState(1);
  const [patientId, setPatientId] = useState(patients[0]?.id);
  const [duration, setDuration] = useState<'day' | 'week' | 'month'>('week');
  const [durationCount, setDurationCount] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [addressId, setAddressId] = useState(addresses[0]?.id);
  
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!equipment) {
    return (
      <div className="pb-20 lg:pb-8">
        <AppHeader title="Rent Equipment" showBack />
        <EmptyState title="Equipment not found" description="Cannot rent this equipment" actionLabel="Go Back" actionTo="/equipment" />
      </div>
    );
  }

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const getPricePerUnit = () => {
    switch (duration) {
      case 'day': return equipment.rentalPriceDay;
      case 'week': return equipment.rentalPriceWeek;
      case 'month': return equipment.rentalPriceMonth;
      default: return equipment.rentalPriceDay;
    }
  };

  const rentalTotal = getPricePerUnit() * durationCount;
  const deposit = equipment.deposit;
  const deliveryFee = equipment.delivery ? 150 : 0;
  const totalAmount = rentalTotal + deposit + deliveryFee;

  const handleConfirm = () => {
    const selectedPatient = patients.find(p => p.id === patientId);
    const orderId = `eq-${Date.now()}`;
    const serviceId = `srv-${Date.now()}`;
    
    // Add to Orders
    dataService.orders.addOrder({
      id: orderId,
      type: 'equipment',
      title: equipment.name,
      status: 'upcoming',
      amount: totalAmount,
      date: startDate,
      details: `${durationCount} ${duration}(s) rental from ${equipment.provider}`,
    });

    // Add to Active Services in Care
    const newService: ActiveService = {
      id: serviceId,
      type: 'equipment',
      title: `Rental: ${equipment.name}`,
      patientName: selectedPatient?.name || 'Self',
      startDate: startDate,
      status: 'upcoming',
      details: `Rented for ${durationCount} ${duration}(s). Provider: ${equipment.provider}`,
    };
    dataService.care.getActiveServices().unshift(newService);

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
        <h1 className="mb-2 text-2xl font-bold text-neutral-800">Rental Confirmed!</h1>
        <p className="mb-8 max-w-sm text-neutral-500">
          Your rental request for {equipment.name} has been placed. It will be delivered on {startDate}.
        </p>
        <div className="flex w-full max-w-sm flex-col gap-3">
          <Link to="/orders" className="rounded-2xl bg-primary-600 py-3.5 font-bold text-white shadow-sm transition-colors hover:bg-primary-700">
            View in Orders
          </Link>
          <Link to="/care" className="rounded-2xl border border-neutral-200 bg-white py-3.5 font-bold text-neutral-600 transition-colors hover:bg-neutral-50">
            View in My Care
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-24 lg:pb-8">
      <AppHeader title="Rent Equipment" showBack onBack={step > 1 ? handleBack : undefined} />
      
      <div className="mx-auto max-w-2xl px-4 py-6 lg:px-8">
        {renderProgress()}

        <div className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm">
          {/* Step 1: Patient */}
          {step === 1 && (
            <div className="animate-in slide-in-from-right-8">
              <h2 className="mb-4 text-xl font-bold text-neutral-800">Who is this for?</h2>
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

          {/* Step 2: Duration */}
          {step === 2 && (
            <div className="animate-in slide-in-from-right-8">
              <h2 className="mb-4 text-xl font-bold text-neutral-800">Rental Duration</h2>
              
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { id: 'day', label: 'Daily', price: equipment.rentalPriceDay },
                  { id: 'week', label: 'Weekly', price: equipment.rentalPriceWeek },
                  { id: 'month', label: 'Monthly', price: equipment.rentalPriceMonth }
                ].map(type => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setDuration(type.id as 'day' | 'week' | 'month');
                      setDurationCount(1);
                    }}
                    className={`flex flex-col items-center justify-center rounded-2xl border p-4 transition-colors ${
                      duration === type.id ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-600' : 'border-neutral-200 hover:border-primary-300'
                    }`}
                  >
                    <span className="font-bold text-neutral-800 mb-1">{type.label}</span>
                    <span className="text-xs text-neutral-500">₹{type.price}</span>
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-neutral-700">How many {duration}s?</label>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setDurationCount(Math.max(1, durationCount - 1))}
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-200 bg-white text-xl font-bold text-neutral-600 hover:bg-neutral-50"
                  >-</button>
                  <span className="text-xl font-bold text-neutral-800 w-8 text-center">{durationCount}</span>
                  <button 
                    onClick={() => setDurationCount(durationCount + 1)}
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-200 bg-white text-xl font-bold text-neutral-600 hover:bg-neutral-50"
                  >+</button>
                </div>
              </div>

              <button 
                onClick={handleNext}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-600 py-3.5 font-bold text-white shadow-sm"
              >
                Continue <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* Step 3: Date */}
          {step === 3 && (
            <div className="animate-in slide-in-from-right-8">
              <h2 className="mb-4 text-xl font-bold text-neutral-800">Start Date</h2>
              <input 
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <button 
                disabled={!startDate}
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
              <h2 className="mb-4 text-xl font-bold text-neutral-800">Delivery Address</h2>
              {equipment.delivery ? (
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
                        <Truck size={18} />
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
                <div className="rounded-2xl border border-warning-200 bg-warning-50 p-4">
                  <p className="text-sm font-semibold text-warning-800">Pick-up Only</p>
                  <p className="mt-1 text-xs text-warning-700">This equipment must be picked up from the provider's location.</p>
                </div>
              )}

              <button 
                disabled={equipment.delivery && !addressId}
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
              <h2 className="mb-4 text-xl font-bold text-neutral-800">Review Rental</h2>
              
              <div className="mb-6 overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50">
                <div className="border-b border-neutral-200 p-4">
                  <div className="font-bold text-neutral-800">{equipment.name}</div>
                  <div className="text-sm text-neutral-500">{equipment.provider}</div>
                </div>
                <div className="grid grid-cols-2 gap-y-4 p-4 text-sm">
                  <div>
                    <div className="font-medium text-neutral-500 flex items-center gap-1.5"><User size={14}/> Patient</div>
                    <div className="mt-1 font-semibold text-neutral-800">{patients.find(p => p.id === patientId)?.name}</div>
                  </div>
                  <div>
                    <div className="font-medium text-neutral-500 flex items-center gap-1.5"><Calendar size={14}/> Starts</div>
                    <div className="mt-1 font-semibold text-neutral-800">{startDate}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="font-medium text-neutral-500 flex items-center gap-1.5"><Package size={14}/> Duration</div>
                    <div className="mt-1 font-semibold text-neutral-800">{durationCount} {duration}(s)</div>
                  </div>
                </div>
              </div>

              <div className="mb-8 space-y-3 rounded-2xl border border-neutral-100 bg-white p-5">
                <h3 className="font-semibold text-neutral-800 border-b border-neutral-50 pb-2 mb-3">Price Details</h3>
                
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Rental Fee ({durationCount} {duration}s)</span>
                  <span className="font-medium text-neutral-800">₹{rentalTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Refundable Deposit</span>
                  <span className="font-medium text-neutral-800">₹{deposit}</span>
                </div>
                {equipment.delivery && (
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Delivery & Setup</span>
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
                Confirm Rental & Pay
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
