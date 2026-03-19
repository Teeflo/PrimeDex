import Header from '@/components/layout/Header';
import PokemonList from '@/components/pokemon/PokemonList';
import SearchBar from '@/components/pokemon/SearchBar';
import TypeFilter from '@/components/pokemon/TypeFilter';
import RegionFilter from '@/components/pokemon/RegionFilter';
import FavoriteToggle from '@/components/pokemon/FavoriteToggle';
import CaughtFilter from '@/components/pokemon/CaughtFilter';
import SortSelector from '@/components/pokemon/SortSelector';
import RecentlyViewed from '@/components/pokemon/RecentlyViewed';
import AdvancedFiltersWrapper from '@/components/pokemon/AdvancedFilters';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getPokemonList } from '@/lib/api';
import { pokemonKeys } from '@/lib/api/keys';
import { t } from '@/lib/server-i18n';

export default async function Home() {
  const queryClient = new QueryClient();

  // Prefetch the first page of pokemon
  await queryClient.prefetchInfiniteQuery({
    queryKey: pokemonKeys.lists('en'),
    queryFn: getPokemonList,
    initialPageParam: 0,
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'PrimeDex',
    url: 'https://primedex.vercel.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://primedex.vercel.app/?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  const softwareAppJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'PrimeDex Dashboard',
    operatingSystem: 'All',
    applicationCategory: 'GameApplication',
    description: 'A high-performance Gaming Dashboard for Pokémon tracking and team building.',
    url: 'https://primedex.vercel.app',
  };

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
      />
      <div className="min-h-screen bg-transparent relative">
        <Header />

        <main className="container mx-auto px-4 py-8 relative z-10">
          {/* ── HERO SECTION ── */}
          <section className="text-center mb-16 pt-14 relative">
            {/* Decorative orbs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-primary/15 rounded-full blur-[100px] animate-pulse-glow" />
              <div className="absolute top-1/3 left-1/3 w-[200px] h-[100px] bg-indigo-500/10 rounded-full blur-[80px] animate-pulse-glow" style={{ animationDelay: '-1.5s' }} />
              <div className="absolute top-2/3 right-1/4 w-[150px] h-[80px] bg-purple-500/8 rounded-full blur-[60px] animate-pulse-glow" style={{ animationDelay: '-3s' }} />
            </div>

            <div className="relative z-10">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] backdrop-blur-xl mb-8">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-foreground/40">
                  {t('home.hero_subtitle')}
                </span>
              </div>

              {/* Main title */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter drop-shadow-sm leading-[0.9] mb-6">
                <span className="gradient-text-hero">
                  {t('home.hero_title')}
                </span>
              </h1>

              {/* Decorative line */}
              <div className="flex items-center justify-center gap-4 mb-10">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/30" />
                <div className="w-2 h-2 rounded-full bg-primary/40" />
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/30" />
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-8">
                <SearchBar />

                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                  <div className="flex items-center gap-2">
                    <FavoriteToggle />
                    <CaughtFilter />
                    <AdvancedFiltersWrapper />
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent hidden md:block" />
                  <SortSelector />
                </div>

                <div className="w-full space-y-3">
                  <RegionFilter />
                  <TypeFilter />
                </div>
              </div>
            </div>
          </section>

          <PokemonList />
          <RecentlyViewed />
        </main>

        {/* ── FOOTER ── */}
        <footer className="relative z-10 mt-24 border-t border-white/[0.04]">
          <div className="py-16 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/20" />
              <span className="text-lg font-black gradient-text-primary tracking-tighter">PrimeDex</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/20" />
            </div>
            <p className="text-[11px] font-semibold text-foreground/25 tracking-wider">
              {t('home.footer_copyright', { year: new Date().getFullYear() })}
            </p>
            <p className="mt-3 text-[10px] text-foreground/15 tracking-wide">
              {t('home.footer_data')}
            </p>
          </div>
        </footer>
      </div>
    </HydrationBoundary>
  );
}
