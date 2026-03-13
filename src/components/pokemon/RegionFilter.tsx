'use client';

import { usePrimeDexStore } from '@/store/primedex';
import { cn } from '@/lib/utils';
import { X, Map } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n';

const REGIONS = [
  { key: 'kanto', gen: '1' },
  { key: 'johto', gen: '2' },
  { key: 'hoenn', gen: '3' },
  { key: 'sinnoh', gen: '4' },
  { key: 'unova', gen: '5' },
  { key: 'kalos', gen: '6' },
  { key: 'alola', gen: '7' },
  { key: 'galar', gen: '8' },
  { key: 'paldea', gen: '9' },
];

export default function RegionFilter() {
  const { selectedGeneration, setSelectedGeneration } = usePrimeDexStore();
  const { t } = useTranslation();

  return (
    <m.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="w-full pb-4 pt-2"
    >
      <div className="flex flex-wrap lg:flex-nowrap gap-2 md:gap-3 justify-start lg:justify-center px-4 mx-auto w-full max-w-7xl overflow-x-auto scrollbar-hide">
        <div className="hidden sm:flex items-center gap-2 mr-2 px-3 py-2 bg-primary/10 rounded-full border border-primary/20">
          <Map className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">{t('regions.title')}</span>
        </div>

        <AnimatePresence mode="popLayout">
          {selectedGeneration && (
            <m.button
              initial={{ scale: 0.8, opacity: 0, width: 0 }}
              animate={{ scale: 1, opacity: 1, width: 'auto' }}
              exit={{ scale: 0.8, opacity: 0, width: 0 }}
              onClick={() => setSelectedGeneration(null)}
              className="flex items-center gap-1 bg-destructive/10 border border-destructive/20 px-4 py-2 rounded-full text-xs text-destructive hover:bg-destructive/20 transition-colors whitespace-nowrap overflow-hidden"
              aria-label={t('filters.reset')}
            >
              <X className="w-3 h-3" />
              <span className="font-bold uppercase tracking-tighter">{t('filters.reset')}</span>
            </m.button>
          )}
        </AnimatePresence>
        
        {REGIONS.map((region) => {
          const isActive = selectedGeneration === parseInt(region.gen);
          const label = t(`regions.${region.key}`);
          
          return (
            <button
              key={region.key}
              onClick={() => setSelectedGeneration(isActive ? null : parseInt(region.gen))}
              className={cn(
                "relative px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300 overflow-hidden group border",
                isActive 
                  ? "bg-primary text-white border-primary shadow-[0_8px_20px_-6px_rgba(255,50,50,0.5)] scale-105"
                  : "bg-secondary/40 backdrop-blur-md text-foreground/60 hover:text-foreground border-white/10 hover:border-white/30"
              )}
            >
              <span className="relative z-10 flex items-center gap-2">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </m.div>
  );
}

