"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const LOCAL_IMAGES = [
  "/images/alexis.png",
  "/images/carl.jpg",
  "/images/mty.png",
  "/images/tanguypistolet.jpg",
  "/images/chat.png"
];
// TODO: Ajouter plus d'images
// TODO: Figure out the cropping
// TODO: fine tune the transition
export default function HeroBg() {
  // On initialise avec un index au hasard pour que chaque visite soit unique
  const [index, setIndex] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Pick initial au hasard
    setIndex(Math.floor(Math.random() * LOCAL_IMAGES.length));
    setIsInitialized(true);

    if (LOCAL_IMAGES.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prevIndex) => {
        let nextIndex;
        // On boucle pour être sûr de ne pas afficher deux fois la même image de suite
        do {
          nextIndex = Math.floor(Math.random() * LOCAL_IMAGES.length);
        } while (nextIndex === prevIndex);
        return nextIndex;
      });
    }, 20000); // 20 secondes

    return () => clearInterval(interval);
  }, []);

  // On évite le flash de l'image 0 au chargement
  if (!isInitialized) return <div className="absolute inset-0 bg-discord-black" />;

  return (
    <div className="absolute inset-0 z-0 bg-discord-black">
      <AnimatePresence initial={false}>
        <motion.div
          key={LOCAL_IMAGES[index]}
          // L'image arrive avec un flou et une opacité à 0
          initial={{ opacity: 0, filter: "blur(20px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(20px)" }}
          transition={{ 
            duration: 2.5, // Transition lente et douce
            ease: "easeInOut" 
          }}
          className="absolute inset-0"
        >
          {/* Overlay sombre pour la lisibilité */}
          <div className="absolute inset-0 bg-black/60 z-10" />
          
          <Image
            src={LOCAL_IMAGES[index]}
            alt="Background"
            fill
            priority
            className="object-cover grayscale-[0.3] brightness-50"
            quality={90}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}