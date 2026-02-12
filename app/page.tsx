import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-discord-black text-white">
      <section className="h-80 bg-[#CCCCCC] w-full relative flex justify-center">
        {/* Texte de la bannière */}
        <h2 className="mt-12 text-xl font-bold opacity-30 uppercase tracking-widest">Bannière</h2>

        {/* LE LOGO (Plus grand et plus bas) */}
        <div className="absolute -bottom-28 z-10">
          <div className="w-56 h-64 bg-white border-4 border-black flex items-center justify-center shadow-2xl">
            {/* Zone pour ton futur blason */}
            <span className="text-black font-black text-2xl uppercase">Logo</span>
          </div>
        </div>
      </section>
      {/* SECTION CONTENU (Fond sombre pour les yeux) */}
      <section className="bg-discord-dark pt-32 pb-20 px-4 sm:px-12 min-h-150">
        <div className="max-w-none mx-auto flex flex-col md:flex-row justify-between items-center gap-4">

          {/* Bloc Classement */}
          <div className="bg-discord-black rounded-3xl h-80 w-full md:w-100 flex items-center justify-center border border-white/5 shadow-2xl">
            <h3 className="text-xl font-black uppercase tracking-tighter text-white">Classement</h3>
          </div>

          {/* ZONE CENTRALE : Flèches + Futur Contenu */}
          <div className="flex-1 flex items-center justify-center gap-10">
            {/* Flèche Gauche */}
            <button className="hover:scale-110 transition-transform cursor-pointer bg-discord-black p-4 rounded-full border border-white/10 text-white shadow-lg">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            {/* ESPACE VIDE (C'est ici que ta liste défilante ira) */}
            <div className="hidden lg:flex flex-col items-center opacity-20">
              <div className="w-20 h-20 border-4 border-dashed border-white rounded-xl"></div>
              <span className="text-white text-xs font-bold mt-2 uppercase">Liste</span>
            </div>

            {/* Flèche Droite */}
            <button className="hover:scale-110 transition-transform cursor-pointer bg-discord-black p-4 rounded-full border border-white/10 text-white shadow-lg">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Bloc Film */}
          <div className="bg-discord-black rounded-3xl h-80 w-full md:w-100 flex items-center justify-center border border-white/5 shadow-2xl">
            <h3 className="text-xl font-black uppercase tracking-tighter text-white">Film</h3>
          </div>

        </div>
      </section>
    </main>
  );
}