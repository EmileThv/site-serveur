// components/FilmCard.tsx
import Image from "next/image";
import filmData from "@/data/featured-film.json";

export default function FilmCard() {
    const { title,realisateur, poster, rating } = filmData;

    // Calculate stars: 5 stars total
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
        <div className="w-full h-full flex flex-col p-6 relative group overflow-hidden">
            {/* Background Poster Blur (Adds depth) */}
            <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                <Image src={poster} alt="" fill className="object-cover blur-xl" />
            </div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-end mb-4 border-b border-white/10 pb-2">
                    <h3 className="text-xl font-black uppercase tracking-tighter text-white">
                        Film du Moment
                    </h3>
                    <span className="text-xs uppercase tracking-widest text-main-green font-bold opacity-80">
                        Recommandé
                    </span>
                </div>

                <div className="flex gap-4 flex-1 items-center">
                    {/* Poster Image */}
                    <div className="relative w-24 h-36 md:w-32 md:h-48 rounded-xl overflow-hidden shadow-2xl border border-white/10 shrink-0 group-hover:scale-105 transition-transform duration-500">
                        <Image
                            src={poster}
                            alt={title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 96px, 128px"
                        />
                    </div>

                    {/* Details */}
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <h4 className="text-lg md:text-2xl font-black leading-tight text-white uppercase drop-shadow-[0_0_15px_rgba(34,176,78,0.4)] italic">
                                {title}
                            </h4>
                            <p className="text-[10px] text-white/40 uppercase font-bold tracking-[0.2em]">
                                {realisateur}
                            </p>
                        </div>

                        <div className="flex flex-col gap-1">
                            <p className="text-[10px] text-white/40 uppercase font-bold tracking-[0.2em]">
                                Note du groupe
                            </p>
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={i < fullStars ? "text-main-yellow" : "text-white/20"}>
                                        ★
                                    </span>
                                ))}
                                <span className="ml-2 font-mono font-bold text-main-yellow text-shadow-main-green">{rating}/5</span>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}