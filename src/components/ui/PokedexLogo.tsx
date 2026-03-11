'use client';

import { motion } from 'framer-motion';

interface PokedexLogoProps {
  className?: string;
}

export default function PokedexLogo({ className = 'w-10 h-10' }: PokedexLogoProps) {
  return (
    <motion.div 
      className={`relative flex items-center justify-center ${className}`}
      whileHover="hover"
      initial="initial"
    >
      {/* Outer Glow */}
      <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Pokéball Main Body */}
      <div className="relative w-full h-full rounded-full border-2 border-black overflow-hidden shadow-lg bg-white">
        {/* Top Half (Red) */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-red-500 to-red-600 border-b-2 border-black" />
        
        {/* Shine Effect */}
        <div className="absolute top-[10%] left-[15%] w-[30%] h-[20%] bg-white/30 rounded-full blur-[2px] rotate-[-20deg]" />
        
        {/* Middle Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-black -translate-y-1/2" />
        
        {/* Center Button Housing */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-black rounded-full flex items-center justify-center z-10 shadow-md">
          {/* Inner Button */}
          <motion.div 
            className="w-2/3 h-2/3 bg-white rounded-full border border-gray-400"
            variants={{
              hover: { 
                backgroundColor: "#fff",
                boxShadow: "0 0 15px rgba(255,255,255,0.8), 0 0 5px rgba(255,255,255,1)",
                scale: 1.1
              }
            }}
          />
        </div>
      </div>

      {/* Optional decorative lights from original for flair */}
      <motion.div 
        className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full border border-black z-20 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
}
