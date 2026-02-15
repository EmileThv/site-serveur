// app/page.tsx
import HeroBg from "@/components/HeroBg";
import Leaderboard from "@/components/Leaderboard";
import FilmCard from "@/components/FilmCard"; // Import here

export default function Home() {
  return (
    <main className="relative h-dvh w-screen bg-discord-black text-white overflow-hidden flex flex-col">
      
      <section className="h-60 bg-main-green/10 w-full relative flex justify-center shrink-0 z-20">
        <h2 className="mt-10 text-lg font-bold opacity-30 uppercase tracking-widest text-black">Bannière</h2>
      </section>

      <section className="relative flex-1 flex items-center overflow-hidden">
        <HeroBg />

        <div className="relative z-10 w-full px-6 md:px-16 lg:px-24 flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Bloc Classement */}
          <div className="bg-discord-black/40 backdrop-blur-md rounded-3xl h-64 md:h-80 w-full md:w-100 flex flex-col border border-white/10 shadow-2xl hover:border-main-green/50 transition-all group shrink-0 relative overflow-hidden">
             <Leaderboard />
          </div>

          {/* Bloc Film - INTEGRATED */}
          <div className="bg-discord-black/40 backdrop-blur-md rounded-3xl h-64 md:h-80 w-full md:w-100 flex flex-col border border-white/10 shadow-2xl hover:border-main-green/50 transition-all group shrink-0 relative overflow-hidden">
            <FilmCard />
          </div>

        </div>
      </section>
    </main>
  );
}