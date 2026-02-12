"use client";

import { motion } from "framer-motion";
import gamesData from "./games-data.json";
import { useRef } from "react";

export default function GamesPage() {
  const constraintsRef = useRef(null);

  // Fusion des données pour le mapping
  const allBoxes = [
    ...gamesData.dailyCategories.map(c => ({ ...c, isSpecial: false })),
    { nom: "Friendslop", isSpecial: true }
  ];

  return (
    <main className="h-screen bg-discord-dark overflow-hidden relative">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 select-none">
        <h1 className="font-(family-name:--font-squidwod) text-main-yellow text-[25vw] uppercase leading-none">
          Games
        </h1>
      </div>

      <div ref={constraintsRef} className="absolute inset-0 p-8">
        {allBoxes.map((cat: any, index) => (
          <motion.div
            key={cat.nom}
            drag
            dragConstraints={constraintsRef}
            dragTransition={{ 
              power: 0.2, 
              timeConstant: 200 
            }}
            dragElastic={0.2}
            initial={{ 
              x: 100 + (index * 60), 
              y: 100 + (index * 40) 
            }}
            whileDrag={{ scale: 1.05, zIndex: 50 }}
            // On utilise md:w-100 comme demandé pour les boites normales
            className={`absolute p-6 rounded-2xl border-2 shadow-2xl cursor-grab active:cursor-grabbing touch-none
              ${cat.isSpecial 
                ? "bg-main-yellow/5 border-main-yellow backdrop-blur-md w-80 md:w-100" 
                : "bg-discord-black/90 border-main-green/30 backdrop-blur-xl w-72 md:w-100"
              }`}
          >
            <h3 className={`font-black uppercase tracking-widest mb-4 
              ${cat.isSpecial ? "text-white text-2xl" : "text-main-green text-xs"}`}>
              {cat.nom}
            </h3>

            {cat.isSpecial ? (
              <div className="flex flex-wrap gap-2">
                {gamesData.friendslop.map((item: any) => (
                  <a 
                    key={item.name} 
                    href={item.url} 
                    target="_blank"
                    className="bg-white/10 px-3 py-1.5 rounded text-sm hover:bg-main-green hover:text-black transition-colors font-bold"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            ) : (
              <nav className="flex flex-col gap-3">
                {cat.jeux?.map((jeu: any) => (
                  <a 
                    key={jeu.name} 
                    href={jeu.url} 
                    target="_blank"
                    className="text-gray-300 hover:text-white font-bold text-xl transition-colors flex items-center gap-2"
                  >
                    <span className="text-main-green text-xs">●</span>
                    {jeu.name}
                  </a>
                ))}
              </nav>
            )}
          </motion.div>
        ))}
      </div>
    </main>
  );
}