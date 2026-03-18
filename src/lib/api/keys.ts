export const pokemonKeys = {
  all: ['pokemon'] as const,
  lists: (lang: string) => [...pokemonKeys.all, 'list', lang] as const,
  list: (filters: Record<string, unknown>, lang: string) => [...pokemonKeys.lists(lang), { filters }] as const,
  details: () => [...pokemonKeys.all, 'detail'] as const,
  detail: (name: string, lang: string) => [...pokemonKeys.details(), name, lang] as const,
  species: (name: string, lang: string) => [...pokemonKeys.all, 'species', name, lang] as const,
  types: () => [...pokemonKeys.all, 'type'] as const,
  type: (type: string) => [...pokemonKeys.types(), type] as const,
  encounters: (id: number) => [...pokemonKeys.all, 'encounters', id] as const,
  names: () => [...pokemonKeys.all, 'names'] as const,
  allDetailed: (lang: string) => [...pokemonKeys.all, 'all-detailed', lang] as const,
  allSummary: (lang: string) => [...pokemonKeys.all, 'all-summary', lang] as const,
  localized: (name: string, langId: number) => [...pokemonKeys.all, 'localized', name, langId] as const,
  tcg: {
    all: () => ['tcg'] as const,
    cards: (name: string) => [...pokemonKeys.tcg.all(), 'cards', name] as const,
  }
};
