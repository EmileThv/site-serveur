import HeroBg from "@/components/HeroBg";

export default function Home() {
  return (
    <main className="relative h-dvh w-screen bg-discord-black text-white overflow-hidden flex flex-col">
      
      {/* 1. BANNIÈRE & LOGO */}
      <section className="h-60 bg-main-green/10 w-full relative flex justify-center shrink-0 z-20">
        <h2 className="mt-10 text-lg font-bold opacity-30 uppercase tracking-widest text-black">Bannière</h2>
        
        <div className="absolute -bottom-75 flex items-center justify-center gap-6">
          {/*<div className="w-72 h-96 bg-white border-4 border-black flex items-center justify-center shadow-2xl text-black font-black text-xl uppercase">
            Logo
          </div> */}
        </div>
      </section>

      {/* 2. SECTION CONTENU (Background + Cartes) */}
      <section className="relative flex-1 flex items-center overflow-hidden">
        
        {/* On appelle le fond d'écran ici */}
        <HeroBg />

        {/* CONTENU : Écarté aux bords via justify-between */}
        <div className="relative z-10 w-full px-6 md:px-16 lg:px-24 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* TODO: implement classement */}
          {/* Bloc Classement - Gauche */}
          <div className="bg-discord-black/40 backdrop-blur-md rounded-3xl h-64 md:h-80 w-full md:w-100 flex items-center justify-center border border-white/10 shadow-2xl hover:border-main-green/50 transition-all group shrink-0">
            <h3 className="text-xl font-black uppercase tracking-tighter text-white group-hover:scale-110 transition-transform">
              Classement
            </h3>
          </div>
          {/* TODO: implement film */}
          {/* Bloc Film - Droite */}
          <div className="bg-discord-black/40 backdrop-blur-md rounded-3xl h-64 md:h-80 w-full md:w-100 flex items-center justify-center border border-white/10 shadow-2xl hover:border-main-green/50 transition-all group shrink-0">
            <h3 className="text-xl font-black uppercase tracking-tighter text-white group-hover:scale-110 transition-transform">
              Film
            </h3>
          </div>

        </div>
      </section>
    </main>
  );
}