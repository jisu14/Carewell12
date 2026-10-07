import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppHeader } from '@/components/layout';
import { dataService } from '@/services/dataService';
import { EmptyState } from '@/components/ui';
import { Loader2, Sparkles, ShoppingBag, Store, MapPin, CheckCircle2, ChevronRight, CheckCircle } from 'lucide-react';

export function PrescriptionCartPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const record = dataService.healthRecords.getAll().find(r => r.id === id);
  const pharmacies = dataService.pharmacies.getAll();
  const user = dataService.user.getCurrent();

  const [processingState, setProcessingState] = useState<'initial' | 'processing' | 'done'>('initial');
  const [selectedPharmacyId, setSelectedPharmacyId] = useState(pharmacies[0]?.id);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    if (processingState === 'initial') {
      setProcessingState('processing');
      const timer = setTimeout(() => {
        setProcessingState('done');
      }, 2500); // simulate Heera processing
      return () => clearTimeout(timer);
    }
  }, [processingState]);

  if (!record || record.type !== 'prescription' || !record.medicines) {
    return (
      <div className="pb-20 lg:pb-8">
        <AppHeader title="Cart" showBack />
        <EmptyState title="Invalid Request" description="No valid prescription found." actionLabel="Go Back" actionTo="/home" />
      </div>
    );
  }

  const handleCheckout = () => {
    const pharmacy = pharmacies.find(p => p.id === selectedPharmacyId);
    const orderId = `med-${Date.now()}`;
    const totalItems = record.medicines?.length || 0;
    const totalAmount = totalItems * 150 + 40; // mock math: 150 per med + 40 delivery

    dataService.orders.addOrder({
      id: orderId,
      type: 'medicine',
      title: `Medicines from ${pharmacy?.name}`,
      status: 'upcoming',
      amount: totalAmount,
      date: new Date().toISOString().split('T')[0],
      details: `${totalItems} items. Ordered via prescription: ${record.title}`,
    });

    if (record.medicines) {
      record.medicines.forEach((med, index) => {
        dataService.medications.addMedication({
          id: `${orderId}-med-${index}`,
          patientName: record.patientName,
          name: med.name,
          strength: 'Standard', // inferred from mock
          dosage: med.dosage,
          frequency: med.frequency,
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          prescribingDoctor: record.doctor,
          remainingDays: parseInt(med.duration) || 30,
          status: 'active',
        });
      });
    }

    setIsConfirmed(true);
  };

  if (processingState === 'processing') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 text-center">
        <div className="relative mb-8">
          <div className="absolute -inset-4 animate-pulse rounded-full bg-primary-100 opacity-50 blur-xl"></div>
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-primary-600 to-primary-400 text-white shadow-xl">
            <Sparkles size={40} className="animate-pulse" />
          </div>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-neutral-800">Preparing your medicine cart...</h1>
        <p className="max-w-xs text-neutral-500">Heera is interpreting the authorized prescription to ensure accurate cart preparation.</p>
        <Loader2 className="mx-auto mt-8 h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (isConfirmed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 text-center">
        <div className="mb-6 rounded-full bg-emerald-100 p-6 text-emerald-600 shadow-sm animate-in zoom-in">
          <CheckCircle size={64} />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-neutral-800">Order Placed!</h1>
        <p className="mb-8 max-w-sm text-neutral-500">
          Your medicine order has been successfully placed. It will be delivered to your address shortly.
        </p>
        <div className="flex w-full max-w-sm flex-col gap-3">
          <Link to="/orders" className="rounded-2xl bg-primary-600 py-3.5 font-bold text-white shadow-sm transition-colors hover:bg-primary-700">
            Track Order
          </Link>
          <Link to="/home" className="rounded-2xl border border-neutral-200 bg-white py-3.5 font-bold text-neutral-600 transition-colors hover:bg-neutral-50">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const selectedPharmacy = pharmacies.find(p => p.id === selectedPharmacyId);
  const medTotal = (record.medicines?.length || 0) * 150;
  const deliveryFee = 40;

  return (
    <div className="min-h-screen bg-neutral-50 pb-28 lg:pb-12">
      <AppHeader title="Medicine Cart" showBack />
      
      <div className="mx-auto max-w-3xl px-4 py-6 lg:px-8">
        
        <div className="mb-6 rounded-2xl bg-emerald-50 p-4 border border-emerald-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-bold text-emerald-900">Your prescription has been converted into a medicine cart.</p>
            <p className="text-xs text-emerald-700 mt-1">Please review the cart carefully before checkout.</p>
          </div>
        </div>

        {/* Medicines Review */}
        <section className="mb-6 rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <ShoppingBag className="text-primary-600" size={20} />
            <h2 className="text-lg font-bold text-neutral-800">Items from Prescription</h2>
          </div>
          
          <div className="space-y-4">
            {record.medicines?.map((med, idx) => (
              <div key={idx} className="flex justify-between border-b border-neutral-50 pb-4 last:border-0 last:pb-0">
                <div>
                  <h3 className="font-bold text-neutral-800">{med.name}</h3>
                  <p className="mt-1 text-sm text-neutral-500">10 units • {med.dosage}</p>
                  <p className="mt-1 text-xs text-primary-600 bg-primary-50 inline-block px-2 py-0.5 rounded-md font-medium">
                    {med.frequency} for {med.duration}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-neutral-800">₹150</p>
                  <p className="text-xs text-emerald-600 font-medium">In Stock</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pharmacy Selection */}
        <section className="mb-6 rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Store className="text-primary-600" size={20} />
              <h2 className="text-lg font-bold text-neutral-800">Fulfilling Pharmacy</h2>
            </div>
          </div>
          
          <div className="space-y-3">
            {pharmacies.slice(0, 3).map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPharmacyId(p.id)}
                className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                  selectedPharmacyId === p.id ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-600' : 'border-neutral-200 hover:border-primary-300'
                }`}
              >
                <div>
                  <div className="font-bold text-neutral-800">{p.name}</div>
                  <div className="text-sm text-neutral-500 mt-0.5">{p.distance} km away • ⭐ {p.rating}</div>
                  <div className="text-xs font-medium text-emerald-600 mt-1">Delivery in {p.deliveryTime}</div>
                </div>
                {selectedPharmacyId === p.id && <CheckCircle2 className="text-primary-600" />}
              </button>
            ))}
          </div>
        </section>

        {/* Address */}
        <section className="mb-6 rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-neutral-800">Delivery Address</h2>
          <div className="flex w-full items-start gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
            <div className="mt-0.5 rounded-full bg-white p-2 text-neutral-500 shadow-sm">
              <MapPin size={20} />
            </div>
            <div>
              <div className="font-bold text-neutral-800">Home</div>
              <div className="mt-1 text-sm text-neutral-600">{user.location}</div>
            </div>
          </div>
        </section>

      </div>

      {/* Checkout Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-neutral-200 bg-white p-4 pb-6 sm:pb-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] lg:left-64">
        <div className="mx-auto flex max-w-3xl flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex flex-col">
            <div className="flex items-center gap-4 text-sm text-neutral-500">
              <span>Items: ₹{medTotal}</span>
              <span>Delivery: ₹{deliveryFee}</span>
            </div>
            <div className="text-xl font-bold text-neutral-800 mt-1">Total: ₹{medTotal + deliveryFee}</div>
          </div>

          <button 
            onClick={handleCheckout}
            className="flex items-center justify-center gap-2 rounded-2xl bg-primary-600 px-8 py-3.5 font-bold text-white shadow-sm transition-colors hover:bg-primary-700"
          >
            Checkout Securely <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
