import { Menu, Wallet, Gamepad2, LogIn } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between px-6 py-4 bg-discord-black text-white border-b border-white/10">

            {/* GAUCHE : Logo & Nom (On fixe une largeur min pour aider le centrage du milieu) */}
            {/* GAUCHE : Logo & Nom cliquables */}
            <a href="/" className="flex items-center gap-2 min-w-50 cursor-pointer group">
                <div className="w-10 h-10 bg-discord-blurple rounded-full flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                    C
                </div>
                <span className="font-(family-name:--font-squidwod) text-[#22B04E] text-7xl hidden md:block drop-shadow-[0_0_15px_rgba(34,176,78,0.4)]">
                    SquidHub
                </span>
            </a>

            {/* CENTRE : Navigation (Correction du centrage entre liens) */}
            <div className="hidden md:flex items-center justify-center flex-1">
                <div className="flex items-center">
                    <a href="/daily-games" className="flex items-center justify-center gap-2 hover:text-discord-blurple transition font-bold text-lg w-45">
                        <Gamepad2 size={22} /> Daily Games
                    </a>
                    <a href="#" className="flex items-center justify-center gap-2 hover:text-discord-blurple transition font-bold text-lg w-30">
                        <Wallet size={22} /> Pari
                    </a>
                    <button className="flex items-center justify-center gap-2 hover:text-discord-blurple transition font-bold text-lg w-30 cursor-pointer">
                        <Menu size={22} /> Profils
                    </button>
                </div>
            </div>

            {/* DROITE : Login (On fixe aussi une largeur min) */}
            <div className="flex justify-end min-w-50">
                <button className="bg-discord-blurple hover:bg-[#4752C4] px-5 py-2.5 rounded-md font-semibold flex items-center gap-3 transition-all active:scale-95 shadow-md cursor-pointer">
                    <svg width="32" height="32" viewBox="0 0 127.14 96.36" fill="currentColor">
                        <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.06,72.06,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.71,32.65-1.82,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1,105.25,105.25,0,0,0,32.19-16.14h0C130.46,50.45,121.78,26.71,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                    </svg>
                    Se connecter
                </button>
            </div>
        </nav>
    );
}