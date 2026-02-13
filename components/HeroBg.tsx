"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const LOCAL_IMAGES = [
  "/images/alexis.png",
  "/images/carl.jpg",
  "/images/mty.png",
];

export default function HeroBg() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Si tu as moins de 2 images, pas besoin d'intervalle
    if (LOCAL_IMAGES.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % LOCAL_IMAGES.length);
    }, 20000); // Change toutes les 20s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-0 bg-discord-black">
      <AnimatePresence initial={false}>
        <motion.div
          key={LOCAL_IMAGES[index]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
        >
          {/* Overlay pour garder le texte de ta landing lisible */}
          <div className="absolute inset-0 bg-black/60 z-10" />
          
          <Image
            src={LOCAL_IMAGES[index]}
            alt="Background"
            fill
            priority // Charge l'image immédiatement (LCP)
            className="object-cover grayscale-[0.3] brightness-50"
            quality={90}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}