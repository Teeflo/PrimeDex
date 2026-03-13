'use client';

import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import dynamic from "next/dynamic";

const CompareBar = dynamic(() => import("@/components/pokemon/CompareBar"), { ssr: false });
const Toaster = dynamic(() => import("@/components/ui/sonner").then(m => m.Toaster), { ssr: false });

export function AppContent({ children }: { children: React.ReactNode }) {
  useKeyboardShortcuts();
  
  return (
    <>
      {children}
      <CompareBar />
      <Toaster />
    </>
  );
}
