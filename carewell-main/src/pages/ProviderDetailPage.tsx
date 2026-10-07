import { useParams, useNavigate } from 'react-router-dom';
import { AppHeader } from '@/components/layout';
import { Rating, VerificationBadge, AvailabilityBadge, PriceDisplay, BookingButton, EmptyState } from '@/components/ui';
import { dataService } from '@/services/dataService';
import { MapPin, CheckCircle2, Clock } from 'lucide-react';

export function ProviderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const provider = id ? dataService.providers.getById(id) : undefined;

  if (!provider) {
    return (
      <div className="pb-20 lg:pb-8">
        <AppHeader title="Provider" showBack />
        <EmptyState title="Provider not found" description="This provider may no longer be available" actionLabel="Back to Home Care" actionTo="/home-care" />
      </div>
    );
  }

  return (
    <div className="pb-24 lg:pb-8">
      <AppHeader title={provider.name} showBack />
      <div className="mx-auto max-w-4xl px-4 py-5 lg:px-8">
        {/* Header card */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-card">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-neutral-800">{provider.name}</h1>
              <div className="mt-1.5 flex items-center gap-2">
                <VerificationBadge status={provider.verification} size="md" />
                <span className="text-sm text-neutral-300">•</span>
                <span className="text-sm text-neutral-400 capitalize">{provider.providerType}</span>
              </div>
            </div>
            <div className="text-right">
              <Rating rating={provider.rating} reviewCount={provider.reviewCount} size="md" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-sm text-neutral-400">
            <MapPin size={16} />
            <span>{provider.location}</span>
            <span className="text-neutral-300">•</span>
            <span>{provider.distance} km away</span>
          </div>
          <div className="mt-3">
            <AvailabilityBadge status={provider.availability} />
          </div>
        </div>

        {/* About */}
        <section className="mt-5 rounded-2xl border border-neutral-100 bg-white p-5 shadow-card">
          <h2 className="mb-2 font-semibold text-neutral-800">About</h2>
          <p className="text-sm leading-relaxed text-neutral-600">{provider.about}</p>
        </section>

        {/* Services */}
        <section className="mt-5 rounded-2xl border border-neutral-100 bg-white p-5 shadow-card">
          <h2 className="mb-3 font-semibold text-neutral-800">Services</h2>
          <div className="grid grid-cols-2 gap-2">
            {provider.services.map((service) => (
              <div key={service} className="flex items-center gap-2 text-sm text-neutral-600">
                <CheckCircle2 size={16} className="text-primary-500" />
                {service}
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="mt-5 rounded-2xl border border-neutral-100 bg-white p-5 shadow-card">
          <h2 className="mb-3 font-semibold text-neutral-800">Pricing</h2>
          <div className="flex items-end justify-between">
            <PriceDisplay price={provider.startingPrice} label="starting price" size="lg" period="day" />
            <div className="text-right text-xs text-neutral-400">
              <p>Prices may vary based on</p>
              <p>service type & duration</p>
            </div>
          </div>
        </section>

        {/* Qualifications */}
        <section className="mt-5 rounded-2xl border border-neutral-100 bg-white p-5 shadow-card">
          <h2 className="mb-3 font-semibold text-neutral-800">Qualifications</h2>
          <div className="space-y-2">
            {provider.qualifications.map((q) => (
              <div key={q} className="flex items-center gap-2 text-sm text-neutral-600">
                <CheckCircle2 size={16} className="text-primary-500" />
                {q}
              </div>
            ))}
          </div>
        </section>

        {/* Service area */}
        <section className="mt-5 rounded-2xl border border-neutral-100 bg-white p-5 shadow-card">
          <h2 className="mb-2 font-semibold text-neutral-800">Service Area</h2>
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <MapPin size={16} className="text-primary-500" />
            {provider.serviceArea}
          </div>
        </section>

        {/* Reviews */}
        <section className="mt-5 rounded-2xl border border-neutral-100 bg-white p-5 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-neutral-800">Reviews</h2>
            <Rating rating={provider.rating} reviewCount={provider.reviewCount} showCount />
          </div>
          <div className="space-y-4">
            {provider.reviews.map((review) => (
              <div key={review.id} className="border-b border-neutral-50 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-700">{review.author}</span>
                  <Rating rating={review.rating} showCount={false} />
                </div>
                <p className="mt-1 text-sm text-neutral-500">{review.comment}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-neutral-300">
                  <Clock size={12} />
                  {new Date(review.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Booking CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-neutral-100 bg-white/95 p-4 backdrop-blur-md lg:bottom-0 lg:left-64">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
            <PriceDisplay price={provider.startingPrice} label="starting from" size="lg" period="day" />
            <BookingButton label="Book Service" size="lg" onClick={() => navigate(`/home-care/provider/${provider.id}/book`)} />
          </div>
        </div>
      </div>
    </div>
  );
}
