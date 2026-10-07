import { useParams, useNavigate } from 'react-router-dom';
import { AppHeader } from '@/components/layout';
import { Rating, VerificationBadge, PriceDisplay, BookingButton, EmptyState } from '@/components/ui';
import { dataService } from '@/services/dataService';
import { MapPin, Clock, CheckCircle2, Languages } from 'lucide-react';

export function DoctorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const doctor = id ? dataService.doctors.getById(id) : undefined;

  if (!doctor) {
    return (
      <div className="pb-20 lg:pb-8">
        <AppHeader title="Doctor" showBack />
        <EmptyState title="Doctor not found" description="This doctor may no longer be available" actionLabel="Back to Doctors" actionTo="/doctors" />
      </div>
    );
  }

  return (
    <div className="pb-24 lg:pb-8">
      <AppHeader title="Doctor Profile" showBack />
      <div className="mx-auto max-w-4xl px-4 py-5 lg:px-8">
        {/* Header */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-card">
          <div className="flex items-start gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-2xl font-bold text-primary-600">
              {doctor.name.charAt(doctor.name.indexOf(' ') + 1)}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold text-neutral-800">{doctor.name}</h1>
              <p className="text-sm text-primary-600">{doctor.specialty}</p>
              <p className="mt-0.5 text-sm text-neutral-400 capitalize">{doctor.systemOfMedicine} • {doctor.experience} years</p>
              <div className="mt-2 flex items-center gap-3">
                <VerificationBadge status={doctor.verification} size="md" />
                <Rating rating={doctor.rating} reviewCount={doctor.reviewCount} />
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-sm text-neutral-400">
            <MapPin size={16} />
            <span>{doctor.location}</span>
          </div>
        </div>

        {/* Next available */}
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-primary-200 bg-primary-50 p-4">
          <Clock size={20} className="text-primary-600" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-primary-800">Next Available</p>
            <p className="text-sm text-primary-600">{doctor.nextSlot}</p>
          </div>
        </div>

        {/* About */}
        <section className="mt-5 rounded-2xl border border-neutral-100 bg-white p-5 shadow-card">
          <h2 className="mb-2 font-semibold text-neutral-800">About</h2>
          <p className="text-sm leading-relaxed text-neutral-600">{doctor.about}</p>
        </section>

        {/* Qualifications & Registration */}
        <section className="mt-5 rounded-2xl border border-neutral-100 bg-white p-5 shadow-card">
          <h2 className="mb-3 font-semibold text-neutral-800">Qualifications & Registration</h2>
          <div className="space-y-3">
            {doctor.qualifications.map((q) => (
              <div key={q} className="flex items-center gap-2 text-sm text-neutral-600">
                <CheckCircle2 size={16} className="text-primary-500" />
                {q}
              </div>
            ))}
            <div className="flex items-center gap-2 text-sm text-neutral-600 mt-3 pt-3 border-t border-neutral-50">
              <CheckCircle2 size={16} className="text-neutral-400" />
              Registration No: {doctor.id.replace(/\D/g, '')}2048 (Medical Council of India)
            </div>
          </div>
        </section>

        {/* Languages */}
        <section className="mt-5 rounded-2xl border border-neutral-100 bg-white p-5 shadow-card">
          <h2 className="mb-3 flex items-center gap-2 font-semibold text-neutral-800">
            <Languages size={18} className="text-primary-500" />
            Languages
          </h2>
          <div className="flex flex-wrap gap-2">
            {doctor.languages.map((lang) => (
              <span key={lang} className="rounded-lg bg-neutral-100 px-3 py-1 text-sm text-neutral-600">
                {lang}
              </span>
            ))}
          </div>
        </section>

        {/* Consultation Details */}
        <section className="mt-5 rounded-2xl border border-neutral-100 bg-white p-5 shadow-card">
          <h2 className="mb-3 font-semibold text-neutral-800">Consultation Details</h2>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between border-b border-neutral-50 pb-4 mb-4">
            <div>
              <p className="text-sm font-medium text-neutral-700">Fee</p>
              <PriceDisplay price={doctor.consultationFee} label="per 15 min session" size="lg" />
            </div>
            <div className="sm:text-right">
              <p className="text-sm font-medium text-neutral-700">Modes Available</p>
              <div className="mt-1 flex flex-wrap gap-2 sm:justify-end">
                {['Video', 'Audio', 'Chat'].map(mode => (
                  <span key={mode} className="rounded-md border border-neutral-200 px-2 py-1 text-xs font-medium text-neutral-600">
                    {mode}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="mt-5 rounded-2xl border border-neutral-100 bg-white p-5 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-neutral-800">Reviews</h2>
            <Rating rating={doctor.rating} reviewCount={doctor.reviewCount} showCount />
          </div>
          <div className="space-y-4">
            {doctor.reviews.map((review) => (
              <div key={review.id} className="border-b border-neutral-50 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-700">{review.author}</span>
                  <Rating rating={review.rating} showCount={false} />
                </div>
                <p className="mt-1 text-sm text-neutral-500">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-neutral-100 bg-white/95 p-4 backdrop-blur-md lg:left-64">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
            <PriceDisplay price={doctor.consultationFee} label="consultation" size="lg" />
            <BookingButton label="Book Consultation" size="lg" onClick={() => navigate(`/doctors/${doctor.id}/book`)} />
          </div>
        </div>
      </div>
    </div>
  );
}
