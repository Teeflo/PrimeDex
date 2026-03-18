import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PrimeDex — The Ultimate Online Pokédex',
    short_name: 'PrimeDex',
    description: 'The most complete Pokédex online. Browse all 1025 Pokémon with stats, evolutions, team builder, competitive builds, type matchups, and interactive quiz.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#1a1a2e',
    theme_color: '#e94560',
    lang: 'en',
    categories: ['games', 'entertainment', 'education'],
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/icon.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  };
}
