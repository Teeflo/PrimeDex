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
}

export const getPokemonCards = async (localizedName: string, lang: string): Promise<TCGCard[]> => {
  // Map our internal lang codes to TCGdex lang codes if needed (TCGdex supports en, fr, es, it, pt, de)
  const supportedLangs = ['en', 'fr', 'es', 'it', 'pt', 'de'];
  const tcgLang = supportedLangs.includes(lang) ? lang : 'en';

  const cacheKey = `tcg-cards-tcgdex-${tcgLang}-${localizedName}`;
  
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
    
    await setCachedData(cacheKey, validCards);
    return validCards;
  } catch (error) {
    const cached = await getCachedData<TCGCard[]>(cacheKey, true);
    if (cached) return cached;
    
    // Throw error if no cache available
    console.error('[TCG API] Error fetching cards:', error);
    throw error;
  }
};
