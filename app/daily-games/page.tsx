import gamesData from "./games-data.json";

export default function GamesPage() {
  return (
    <main className="min-h-screen bg-discord-dark py-16 px-6">
      {/* TITRE CENTRAL */}
      <div className="text-center mb-24">
        <h1 className="font-(family-name:--font-squidwod) text-[#22B04E] text-8xl md:text-9xl drop-shadow-[0_0_25px_rgba(34,176,78,0.5)] uppercase tracking-tighter">
          Games
        </h1>
        <div className="h-1 w-32 bg-[#22B04E] mx-auto mt-4 opacity-50"></div>
      </div>

      <div className="max-w-none mx-auto flex flex-col gap-24">
        
        {/* SECTION DAILY GAMES */}
        <section className="flex flex-col items-center">
          <h2 className="font-black text-4xl uppercase tracking-tighter text-white mb-12 border-b-4 border-[#22B04E] pb-2">
            Daily Games
          </h2>
          
          <div className="flex flex-col md:flex-row justify-center gap-16 md:gap-32 w-full">
            {gamesData.dailyCategories.map((cat) => (
              <div key={cat.nom} className="flex flex-col items-center md:items-start gap-4">
                <h3 className="text-[#22B04E] text-sm font-black uppercase tracking-[0.2em] opacity-80 mb-2">
                  {cat.nom}
                </h3>
                <nav className="flex flex-col gap-4">
                  {cat.jeux.map((jeu) => (
                    <a 
                      key={jeu.name}
                      href={jeu.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group text-gray-300 hover:text-[#22B04E] text-3xl font-bold flex items-center gap-2 transition-all duration-300 hover:translate-x-2"
                    >
                      <span className="text-[#22B04E] opacity-0 group-hover:opacity-100 transition-opacity font-black">-</span>
                      {jeu.name}
                    </a>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION FRIENDSLOP */}
        <section className="flex flex-col items-center pt-10 border-t border-white/5">
          <h2 className="font-black text-4xl uppercase tracking-tighter text-white mb-12 border-b-4 border-white/20 pb-2">
            Friendslop
          </h2>
          
          <div className="flex flex-wrap justify-center gap-x-20 gap-y-8 max-w-6xl">
            {gamesData.friendslop.map((item) => (
              <a 
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group text-gray-300 hover:text-white text-3xl font-bold flex items-center gap-2 transition-all duration-300 hover:scale-105"
              >
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-black">-</span>
                {item.name}
              </a>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}