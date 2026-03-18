'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPokemonCards } from '@/lib/api';
import { TCGCard } from '@/lib/api/tcg';
import { pokemonKeys } from '@/lib/api/keys';
import { Loader2, ExternalLink, X } from 'lucide-react';
import { m, AnimatePresence, Variants } from 'framer-motion';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n';

interface PokemonCardsProps {
  name: string;
  localizedName?: string;
  lang?: string;
}

export const PokemonCards: React.FC<PokemonCardsProps> = ({ name, localizedName, lang }) => {
  const { t } = useTranslation();
  const queryName = localizedName || name;
  const tcgLang = lang || 'en';
  
  const [selectedCard, setSelectedCard] = useState<TCGCard | null>(null);

  const { data: cards, isLoading, error } = useQuery({
    queryKey: [...pokemonKeys.tcg.cards(name), tcgLang],
    queryFn: () => getPokemonCards(queryName, tcgLang),
    enabled: !!queryName,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  console.log(`[PokemonCards] Render - name: ${queryName}, lang: ${tcgLang}, isLoading: ${isLoading}, hasError: ${!!error}, cardsCount: ${cards?.length || 0}`);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 min-h-[300px]">
        <Loader2 className="w-10 h-10 animate-spin text-primary/40" />
      </div>
    );
  }

  if (error || !cards || cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center min-h-[300px] glass-panel rounded-[2.5rem]">
        <p className="text-foreground/50 font-bold uppercase tracking-widest text-sm mb-2">
          {t('detail.no_cards_found', { defaultValue: 'No cards found' })}
        </p>
        <p className="text-xs text-foreground/40">
          {t('detail.no_cards_desc', { defaultValue: 'There might not be any cards available for this Pokémon yet.' })}
        </p>
      </div>
    );
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="glass-panel p-6 md:p-8 rounded-[2.5rem]">
      <h3 className="text-2xl font-black mb-8 border-b border-white/10 pb-4 flex items-center gap-3">
        <span className="text-foreground/90">{t('detail.cards')}</span>
        <span className="px-2 py-1 bg-secondary/50 rounded-md text-xs font-bold text-foreground/60">
          {cards.length}
        </span>
      </h3>

      <m.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
      >
        {cards.map((card) => (
          <m.div key={card.id} variants={itemVariants} className="group relative perspective-1000">
            <button 
              onClick={() => setSelectedCard(card)}
              className="block w-full relative transform-style-3d group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-300 ease-out text-left"
              aria-label={t('detail.view_card_aria', { name: card.name, defaultValue: `View ${card.name} card` })}
            >
              <div className="relative w-full aspect-[63/88] rounded-xl overflow-hidden shadow-lg group-hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.4)] transition-shadow duration-300">
                <div className="absolute inset-0 bg-transparent group-hover:bg-white/10 z-10 transition-colors duration-300 pointer-events-none mix-blend-overlay" />
                <Image
                  src={`${card.image}/high.webp`}
                  alt={card.name}
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              
              <div className="absolute -bottom-2 -left-2 -right-2 bg-background/80 backdrop-blur-md rounded-xl p-3 border border-white/10 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 z-20 shadow-xl pointer-events-none">
                <p className="text-xs font-black truncate text-foreground/90">{card.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[9px] font-bold text-foreground/60 truncate uppercase tracking-widest">#{card.localId} ({card.id.split('-')[0].toUpperCase()})</p>
                </div>
              </div>
            </button>
          </m.div>
        ))}
      </m.div>

      <AnimatePresence>
        {selectedCard && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCard(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <m.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex flex-col items-center"
            >
              <button
                onClick={() => setSelectedCard(null)}
                className="fixed top-4 right-4 md:top-8 md:right-8 p-3 text-white/70 hover:text-white bg-black/60 hover:bg-black/90 rounded-full backdrop-blur-md transition-all z-[60] hover:scale-110"
              >
                <X className="w-6 h-6" />
              </button>
              
              <Image
                src={`${selectedCard.image}/high.webp`}
                alt={selectedCard.name}
                width={733}
                height={1024}
                className="w-auto h-auto max-h-[65vh] md:max-h-[75vh] max-w-[85vw] rounded-xl sm:rounded-2xl md:rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] object-contain"
                quality={100}
                priority
              />
              
              <div className="mt-4 text-center">
                <h4 className="text-xl md:text-2xl font-black text-white">{selectedCard.name}</h4>
                <p className="text-sm md:text-base text-white/60 font-medium uppercase tracking-widest mt-1">
                  #{selectedCard.localId} • {selectedCard.id.split('-')[0].toUpperCase()}
                </p>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};
