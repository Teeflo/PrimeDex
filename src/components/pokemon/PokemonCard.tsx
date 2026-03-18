import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { PokemonDetail, PokemonSpecies, TYPE_COLORS } from '@/types/pokemon';
import { m } from 'framer-motion';
import { Heart, ArrowLeftRight, Plus, Minus } from 'lucide-react';
import { usePrimeDexStore } from '@/store/primedex';
import { cn, formatId } from '@/lib/utils';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import Image from 'next/image';
import { SVGProps, memo, useCallback, useState, useEffect } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

interface PokemonCardProps {
  name: string;
  url: string;
  index?: number;
  initialData?: {
    pokemon: Partial<PokemonDetail>;
    species?: Partial<PokemonSpecies>;
  };
}

export function PokemonCardSkeleton() {
  return (
    <div className="py-4 px-2 h-[26rem]">
      <div className="glass-panel h-full p-6 flex flex-col items-center rounded-[2rem] bg-white/5 animate-pulse">
        <div className="flex justify-between items-center w-full mb-4">
          <Skeleton className="h-4 w-12 bg-white/10" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-9 rounded-full bg-white/10" />
            <Skeleton className="h-9 w-9 rounded-full bg-white/10" />
            <Skeleton className="h-9 w-9 rounded-full bg-white/10" />
          </div>
        </div>
        <Skeleton className="w-40 h-40 rounded-full bg-white/10 my-2" />
        <div className="mt-auto w-full flex flex-col items-center gap-4 pt-6">
          <Skeleton className="h-8 w-32 bg-white/10" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full bg-white/10" />
            <Skeleton className="h-6 w-16 rounded-full bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

export const PokemonCard = memo(function PokemonCard({ name, url, index = 0, initialData }: PokemonCardProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Use atomic selectors to prevent unnecessary re-renders
  const language = usePrimeDexStore(s => s.language);
  const systemLanguage = usePrimeDexStore(s => s.systemLanguage);
  const favorites = usePrimeDexStore(s => s.favorites);
  const compareList = usePrimeDexStore(s => s.compareList);
  const team = usePrimeDexStore(s => s.team);
  const caughtPokemon = usePrimeDexStore(s => s.caughtPokemon);
  
  const addFavorite = usePrimeDexStore(s => s.addFavorite);
  const removeFavorite = usePrimeDexStore(s => s.removeFavorite);
  const addToCompare = usePrimeDexStore(s => s.addToCompare);
  const removeFromCompare = usePrimeDexStore(s => s.removeFromCompare);
  const addToTeam = usePrimeDexStore(s => s.addToTeam);
  const removeFromTeam = usePrimeDexStore(s => s.removeFromTeam);
  const toggleCaught = usePrimeDexStore(s => s.toggleCaught);

  const resolvedLang = language === 'auto' ? systemLanguage : language;

  const { data, isLoading } = useQuery<{
    pokemon: Partial<PokemonDetail>;
    species?: Partial<PokemonSpecies>;
  }>({
    queryKey: ['pokemon-card', name, resolvedLang],
    queryFn: async () => {
      const speciesUrl = url.replace('/pokemon/', '/pokemon-species/');
      const [pokemonRes, speciesRes] = await Promise.all([
        axios.get<PokemonDetail>(url),
        axios.get<PokemonSpecies>(speciesUrl).catch(() => null)
      ]);
      return { 
        pokemon: pokemonRes.data, 
        species: speciesRes?.data as PokemonSpecies
      };
    },
    staleTime: 10 * 60 * 1000,
    enabled: !initialData?.species?.names || initialData.species.names.length === 0,
  });

  const displayData = data || initialData;
  
  const prefetchDetails = useCallback(() => {
    if (!name) return;
    const speciesUrl = url.replace('/pokemon/', '/pokemon-species/');
    queryClient.prefetchQuery({
      queryKey: ['pokemon-card', name, resolvedLang],
      queryFn: async () => {
        const [pokemonRes, speciesRes] = await Promise.all([
          axios.get<PokemonDetail>(url),
          axios.get<PokemonSpecies>(speciesUrl).catch(() => null)
        ]);
        return { 
          pokemon: pokemonRes.data, 
          species: speciesRes?.data as PokemonSpecies
        };
      },
      staleTime: 10 * 60 * 1000,
    });
  }, [name, url, queryClient, resolvedLang]);

  if (isLoading && !displayData) {
    return <PokemonCardSkeleton />;
  }

  if (!displayData || !displayData.pokemon) return null;
  const { pokemon, species } = displayData;
  const pokemonId = pokemon.id || 0;

  const isFav = mounted && favorites.includes(pokemonId);
  const isComp = mounted && compareList.includes(pokemonId);
  const isTeam = mounted && team.includes(pokemonId);
  const caught = mounted && caughtPokemon.includes(pokemonId);
  
  const teamFull = mounted && team.length >= 6;
  const compareFull = mounted && compareList.length >= 3;

  const typesRaw = pokemon.types || (pokemon as any).pokemon_v2_pokemontypes || [];
  const types = typesRaw.map((t: any) => {
    if (!t) return null;
    if (typeof t === 'string') return { type: { name: t } };
    if (t.type?.name) return t; // Standard REST API structure
    if (t.pokemon_v2_type?.name) return { type: { name: t.pokemon_v2_type.name } }; // Raw GraphQL structure
    return null;
  }).filter(Boolean);
  const mainType = types[0]?.type?.name || 'normal';
  const color = TYPE_COLORS[mainType] || '#A8A77A';

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    isFav ? removeFavorite(pokemonId) : addFavorite(pokemonId);
  };

  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    isComp ? removeFromCompare(pokemonId) : addToCompare(pokemonId);
  };

  const toggleTeam = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    isTeam ? removeFromTeam(pokemonId) : addToTeam(pokemonId);
  };

  const handleToggleCaught = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    toggleCaught(pokemonId);
  };

  const getLocalizedName = () => {
    if (species?.names?.length) {
      const entry = species.names.find(n => n?.language?.name === resolvedLang) || species.names.find(n => n?.language?.name === 'en');
      if (entry?.name) return entry.name;
    }
    const gqlSpeciesData = pokemon as any;
    if (gqlSpeciesData.localizedNames?.length) {
      const entry = gqlSpeciesData.localizedNames.find((n: any) => n?.language === resolvedLang) || gqlSpeciesData.localizedNames.find((n: any) => n?.language === 'en');
      if (entry?.name) return entry.name;
    }
    return pokemon.name || name;
  };

  const displayName = getLocalizedName();
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

  return (
    <Link href={`/pokemon/${name}`} className="block h-full py-4 px-2" onMouseEnter={prefetchDetails}>
      <m.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="glass-panel type-glow relative h-full p-6 flex flex-col items-center group overflow-hidden rounded-[2rem]"
        style={{ '--type-color': `${color}40` } as React.CSSProperties}
      >
        <button 
          onClick={handleToggleCaught}
          className={cn(
            "absolute bottom-6 left-6 z-20 transition-all duration-500 hover:scale-110 active:scale-90",
            caught ? "opacity-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "opacity-20 grayscale hover:opacity-50"
          )}
          title={caught ? t('card.caught') : t('card.mark_caught')}
          aria-label={caught ? t('card.caught') : t('card.mark_caught')}
        >
          <PokeballIcon className={cn("w-6 h-6", caught ? "text-red-500" : "text-foreground")} />
        </button>

        <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-700" style={{ backgroundColor: color }} />
        
        <div className="flex justify-between items-center w-full z-10 mb-4">
          <span className="text-sm font-black text-foreground/50 group-hover:text-foreground/80 transition-colors">{formatId(pokemonId)}</span>
          <div className="flex items-center gap-2">
            <m.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={toggleTeam} disabled={!isTeam && teamFull}
              className={cn("p-2.5 rounded-full backdrop-blur-md transition-all shadow-sm", isTeam ? "bg-green-500/20 text-green-500 hover:bg-green-500/30" : "bg-secondary/40 text-foreground/40 hover:text-foreground/80 hover:bg-secondary/60", !isTeam && teamFull && "opacity-20 cursor-not-allowed")}
            >
              {isTeam ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </m.button>

            <m.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={toggleCompare} disabled={!isComp && compareFull}
              className={cn("p-2.5 rounded-full backdrop-blur-md transition-all shadow-sm", isComp ? "bg-primary/20 text-primary hover:bg-primary/30" : "bg-secondary/40 text-foreground/40 hover:text-foreground/80 hover:bg-secondary/60", !isComp && compareFull && "opacity-20 cursor-not-allowed")}
            >
              <ArrowLeftRight className={cn("w-4 h-4 transition-transform", isComp && "scale-110")} />
            </m.button>

            <m.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={toggleFavorite}
              className={cn("p-2.5 rounded-full backdrop-blur-md transition-all shadow-sm", isFav ? "bg-red-500/20 text-red-500 hover:bg-red-500/30" : "bg-secondary/40 text-foreground/40 hover:text-foreground/80 hover:bg-secondary/60")}
            >
              <m.div animate={isFav ? { scale: [1, 1.4, 1], transition: { duration: 0.3 } } : {}}>
                <Heart className={cn("w-4 h-4 transition-transform", isFav && "fill-current scale-110")} />
              </m.div>
            </m.button>
          </div>
        </div>

        <div className="relative w-40 h-40 my-2 z-10 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full blur-[30px] opacity-20 group-hover:opacity-50 group-hover:scale-125 transition-all duration-700" style={{ backgroundColor: color }} />
          <Image
            src={spriteUrl} alt={displayName} width={160} height={160}
            className="w-full h-full object-contain drop-shadow-xl transition-transform duration-700 ease-out group-hover:scale-125 group-hover:-translate-y-3 relative z-10"
            priority={index < 10}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        </div>

        <div className="mt-auto w-full text-center z-10 pt-6">
          <h3 className="text-2xl font-black text-foreground capitalize mb-4 tracking-tighter">{displayName}</h3>
          <div className="flex justify-center gap-2 flex-wrap mb-2">
            {types.map((typeItem: any, i: number) => {
              const typeName = typeItem?.type?.name;
              if (!typeName) return null;
              return (
                <span key={`${typeName}-${i}`} className="glass-tag" style={{ backgroundColor: `${TYPE_COLORS[typeName] || '#A8A77A'}cc`, borderColor: TYPE_COLORS[typeName] || '#A8A77A' }}>
                  {t(`types.${typeName}`)}
                </span>
              );
            })}
          </div>
        </div>
      </m.div>
    </Link>
  );
});

function PokeballIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" fill={props.className?.includes('text-red-500') ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
