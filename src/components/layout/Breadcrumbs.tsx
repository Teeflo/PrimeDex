'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export function Breadcrumbs() {
  const pathname = usePathname();
  const { t } = useTranslation();

  if (pathname === '/') return null;

  const pathSegments = pathname.split('/').filter(Boolean);
  
  const breadcrumbs = [
    { label: t('common.home'), href: '/', icon: true },
    ...pathSegments.map((segment, index) => {
      const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
      
      // Handle special cases for labels
      let label = segment;
      if (segment === 'pokemon') label = t('common.pokemon');
      else if (segment.match(/^[0-9]+$/)) label = `#${segment}`; // Pokemon ID
      else label = segment.charAt(0).toUpperCase() + segment.slice(1);

      return { label, href, icon: false };
    })
  ];

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="flex items-center space-x-2 text-xs font-medium text-foreground/40 py-4 px-6 md:px-12 bg-background/50 backdrop-blur-md border-b border-white/5 sticky top-16 z-40"
    >
      <ol className="flex items-center space-x-2 list-none p-0 m-0">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center">
            {index > 0 && <ChevronRight className="w-3 h-3 mx-2 opacity-30" />}
            <Link
              href={crumb.href}
              className={cn(
                "hover:text-primary transition-colors flex items-center gap-1.5",
                index === breadcrumbs.length - 1 ? "text-foreground/80 font-bold pointer-events-none" : ""
              )}
              aria-current={index === breadcrumbs.length - 1 ? "page" : undefined}
            >
              {crumb.icon && <Home className="w-3 h-3" />}
              {crumb.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
