'use client';

import { usePrimeDexStore } from '@/store/primedex';
import { Search, X } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/lib/i18n';
import { useQueryClient } from '@tanstack/react-query';
import { pokemonKeys } from '@/lib/api/keys';
import { getAllPokemonSummary } from '@/lib/api';

export default function SearchBar() {
  const { searchTerm, setSearchTerm, language, systemLanguage } = usePrimeDexStore();
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const resolvedLang = language === 'auto' ? systemLanguage : language;

  const prefetchIndex = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: pokemonKeys.allSummary(resolvedLang),
      queryFn: () => getAllPokemonSummary(),
      staleTime: 24 * 60 * 60 * 1000,
    });
  }, [queryClient, resolvedLang]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update local search when store search changes (e.g. clear filters)
  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  // Debounce search term update to the store
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, setSearchTerm]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <m.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="relative flex items-center w-full max-w-2xl mx-auto my-8 px-4 group"
    >
      <div className="absolute left-8 pointer-events-none text-foreground/40 group-focus-within:text-primary transition-colors z-10">
        <Search className="w-5 h-5" />
      </div>
      
      <div className="w-full relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-full blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={t('search.placeholder')}
          value={mounted ? localSearch : ''}
          onFocus={prefetchIndex}
          onChange={(e) => {
            setLocalSearch(e.target.value);
            prefetchIndex();
          }}
          className="w-full pl-12 pr-12 py-7 rounded-full bg-secondary/30 backdrop-blur-xl border border-white/20 dark:border-white/10 text-foreground placeholder:text-foreground/40 text-lg font-medium shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/50"
          aria-label={t('search.placeholder')}
          id="pokemon-search"
        />
      </div>

      <AnimatePresence>
        {localSearch && (
          <m.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => {
              setLocalSearch('');
              setSearchTerm('');
            }}
            className="absolute right-6 p-2 rounded-full text-foreground/40 hover:text-primary hover:bg-primary/10 transition-colors focus:outline-none"
            aria-label={t('search.clear')}
          >
            <X className="w-5 h-5" />
          </m.button>
        )}
      </AnimatePresence>
    </m.div>
  );
}


