import { AppHeader } from '@/components/layout';
import { CategoryCard } from '@/components/ui';
import { exploreCategories } from '@/data/mockData';
import * as Icons from 'lucide-react';

export function ExplorePage() {
  const getIcon = (name: string) => {
    const Icon = (Icons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[name];
    return Icon ? <Icon size={20} /> : <Icons.Circle size={20} />;
  };

  return (
    <div className="pb-20 lg:pb-8">
      <AppHeader title="Explore" showLogo />
      <div className="mx-auto max-w-6xl px-4 py-5 lg:px-8">
        {/* Care at Home */}
        <section className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-6 w-1 rounded-full bg-primary-500" />
            <h2 className="text-lg font-semibold text-neutral-800">Care at Home</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {exploreCategories.careAtHome.map((cat) => (
              <CategoryCard key={cat.name} name={cat.name} icon={getIcon(cat.icon)} path={cat.path} />
            ))}
          </div>
        </section>

        {/* Medical */}
        <section className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-6 w-1 rounded-full bg-secondary-500" />
            <h2 className="text-lg font-semibold text-neutral-800">Medical</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {exploreCategories.medical.map((cat) => (
              <CategoryCard key={cat.name} name={cat.name} icon={getIcon(cat.icon)} path={cat.path} />
            ))}
          </div>
        </section>

        {/* Other Healthcare */}
        <section className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-6 w-1 rounded-full bg-accent-500" />
            <h2 className="text-lg font-semibold text-neutral-800">Other Healthcare</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {exploreCategories.other.map((cat) => (
              <CategoryCard key={cat.name} name={cat.name} icon={getIcon(cat.icon)} path={cat.path} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
