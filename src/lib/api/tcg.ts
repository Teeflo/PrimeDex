import axios from 'axios';
import axiosRetry from 'axios-retry';
import { getCachedData, setCachedData } from './cache';

const tcgClient = axios.create({
  baseURL: 'https://api.tcgdex.net/v2',
  timeout: 10000,
});

axiosRetry(tcgClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status === 429;
  },
});

export interface TCGCard {
  id: string;
  localId: string;
  name: string;
  image?: string;
  rarity?: string;
  category?: string;
  suffix?: string;
  stage?: string;
  types?: string[];
}

/** Detail response shape from TCGdex /cards/{id} endpoint */
interface TCGCardDetail {
  id: string;
  localId: string;
  name: string;
  image?: string;
  rarity?: string;
  category?: string;
  suffix?: string;
  stage?: string;
  types?: string[];
}

/**
 * Fetch rarity details for a batch of cards from their individual detail endpoints.
 * Uses Promise.allSettled so one failure doesn't block the rest.
 */
const enrichCardsWithRarity = async (cards: TCGCard[], lang: string): Promise<TCGCard[]> => {
  const results = await Promise.allSettled(
    cards.map(async (card) => {
      try {
        const { data } = await tcgClient.get<TCGCardDetail>(`/${lang}/cards/${card.id}`);
        return {
          ...card,
          rarity: data.rarity || undefined,
          category: data.category || undefined,
          suffix: data.suffix || undefined,
          stage: data.stage || undefined,
          types: data.types || undefined,
        };
      } catch {
        // If the detail request fails, keep the card as-is
        return card;
      }
    })
  );

  return results.map((result, i) =>
    result.status === 'fulfilled' ? result.value : cards[i]
  );
};

export const getPokemonCards = async (localizedName: string, lang: string): Promise<TCGCard[]> => {
  // Map our internal lang codes to TCGdex lang codes if needed (TCGdex supports en, fr, es, it, pt, de)
  const supportedLangs = ['en', 'fr', 'es', 'it', 'pt', 'de'];
  const tcgLang = supportedLangs.includes(lang) ? lang : 'en';

  const cacheKey = `tcg-cards-tcgdex-v2-${tcgLang}-${localizedName}`;
  
  try {
    const cached = await getCachedData<TCGCard[]>(cacheKey);
    if (cached) {
      console.log(`[TCG API] Returning cached data for: ${localizedName} (${tcgLang})`);
      return cached;
    }
    
    // Fetch directly from the lightweight REST endpoint
    const url = `/${tcgLang}/cards?name=${encodeURIComponent(localizedName)}`;
    console.log(`[TCG API] Calling endpoint: ${url}`);
    
    const { data } = await tcgClient.get<TCGCard[]>(url);
    
    // TCGdex returns all matching cards. Some might not have an image scan in this language.
    // Pick only cards with an image, and limit to 30 for performance.
    const validCards = data.filter(c => c.image).slice(0, 30);
    console.log(`[TCG API] Received ${validCards.length} valid cards with images`);

    // Enrich cards with rarity data from detail endpoints
    const enrichedCards = await enrichCardsWithRarity(validCards, tcgLang);
    console.log(`[TCG API] Enriched ${enrichedCards.filter(c => c.rarity).length}/${enrichedCards.length} cards with rarity data`);
    
    await setCachedData(cacheKey, enrichedCards);
    return enrichedCards;
  } catch (error) {
    const cached = await getCachedData<TCGCard[]>(cacheKey, true);
    if (cached) return cached;
    
    // Throw error if no cache available
    console.error('[TCG API] Error fetching cards:', error);
    throw error;
  }
};
