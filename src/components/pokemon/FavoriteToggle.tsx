'use client';

import { usePrimeDexStore } from '@/store/primedex';
import { Heart } from 'lucide-react';
import { m } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';

export default function FavoriteToggle() {
  const { showFavoritesOnly, setShowFavoritesOnly, favorites } = usePrimeDexStore();
  const { t } = useTranslation();

  return (
    <m.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
      className={cn(
        "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 border",
        showFavoritesOnly 
          ? "bg-red-500 text-white border-red-500 shadow-[0_8px_20px_-6px_rgba(239,68,68,0.5)]" 
          : "bg-secondary/40 backdrop-blur-md text-foreground/60 hover:text-foreground border-white/10 hover:border-white/30"
      )}
    >
      <Heart className={cn("w-4 h-4 transition-transform", showFavoritesOnly && "fill-current scale-110")} />
      <span>{t('favorites.toggle', { count: favorites.length })}</span>
    </m.button>
  );
}

