import { useParams, useNavigate } from 'react-router-dom';
import { AppHeader } from '@/components/layout';
import { Rating, VerificationBadge, PriceDisplay, BookingButton, EmptyState } from '@/components/ui';
import { dataService } from '@/services/dataService';
import { MapPin, Clock, Home, CheckCircle2 } from 'lucide-react';

export function LabDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lab = id ? dataService.laboratories.getById(id) : undefined;

  if (!lab) {
    return (
      <div className="pb-20 lg:pb-8">
        <AppHeader title="Lab" showBack />
        <EmptyState title="Lab not found" description="This lab may no longer be available" actionLabel="Back to Labs" actionTo="/labs" />
      </div>
    );
  }

  const categories = Array.from(new Set(lab.tests.map((t) => t.category)));

  return (
    <div className="pb-24 lg:pb-8">
      <AppHeader title={lab.name} showBack />
      <div className="mx-auto max-w-4xl px-4 py-5 lg:px-8">
        {/* Header */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-card">
          <h1 className="text-xl font-bold text-neutral-800">{lab.name}</h1>
          <div className="mt-2 flex items-center gap-3">
            <VerificationBadge status={lab.verification} size="md" />
            <Rating rating={lab.rating} reviewCount={lab.reviewCount} />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-neutral-400">
            <span className="flex items-center gap-1"><MapPin size={16} /> {lab.location}</span>
            <span className="flex items-center gap-1"><Clock size={16} /> {lab.timings}</span>
          </div>
          {lab.homeCollection && (
            <div className="mt-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-700">
                <Home size={14} /> Home sample collection available
              </span>
            </div>
          )}
        </div>

        {/* About */}
        <section className="mt-5 rounded-2xl border border-neutral-100 bg-white p-5 shadow-card">
          <h2 className="mb-2 font-semibold text-neutral-800">About</h2>
          <p className="text-sm leading-relaxed text-neutral-600">{lab.about}</p>
        </section>

        {/* Tests by category */}
        {categories.map((cat) => (
          <section key={cat} className="mt-5 rounded-2xl border border-neutral-100 bg-white p-5 shadow-card">
            <h2 className="mb-3 font-semibold text-neutral-800">{cat}</h2>
            <div className="space-y-4">
              {lab.tests.filter((t) => t.category === cat).map((test) => (
                <div key={test.id} className="border-b border-neutral-50 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-primary-500" />
                        <h3 className="font-semibold text-neutral-800">{test.name}</h3>
                      </div>
                      {test.description && <p className="mt-1 ml-6 text-sm text-neutral-500">{test.description}</p>}
                      {test.preparation && <p className="mt-1 ml-6 text-xs text-neutral-400">Preparation: {test.preparation}</p>}
                      {test.homeCollection && (
                        <span className="mt-2 ml-6 inline-flex items-center gap-1 text-xs font-medium text-success-600">
                          <Home size={12} /> Home Collection Available
                        </span>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <PriceDisplay price={test.price} size="sm" />
                      <button 
                        onClick={() => navigate(`/labs/${lab.id}/book/${test.id}`)}
                        className="mt-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-primary-700"
                      >
                        Book Test
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Reviews */}
        <section className="mt-5 mb-8 rounded-2xl border border-neutral-100 bg-white p-5 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-neutral-800">Reviews</h2>
            <Rating rating={lab.rating} reviewCount={lab.reviewCount} showCount />
          </div>
          <div className="space-y-4">
            {lab.reviews.map((review) => (
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

        {/* Floating CTA Helper */}
        <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-neutral-100 bg-white/95 p-4 backdrop-blur-md lg:bottom-0 lg:left-64">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-neutral-800">Ready to book?</p>
              <p className="text-xs text-neutral-500">Select a specific test from the list above.</p>
            </div>
            <button 
              onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}
              className="rounded-2xl bg-neutral-100 px-6 py-3 text-sm font-bold text-neutral-700 transition-colors hover:bg-neutral-200"
            >
              Browse Tests
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
