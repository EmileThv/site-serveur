"use client";

import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { createBet } from "@/app/actions/bet";


// --- TYPES ---
type Point = { x: number; y: number };
type Connection = { from: string; to: string; id: string };

export default function BettingPage() {
    // Au début de ton composant BettingPage
    const [players, setPlayers] = useState<{ id: string, name: string, image: string }[]>([]);

    useEffect(() => {
        fetch("/api/users")
            .then(res => res.json())
            .then(data => setPlayers(data));
    }, []);
    const { data: session } = useSession();
    const containerRef = useRef<HTMLDivElement>(null);
    const portsRef = useRef<Record<string, HTMLDivElement | null>>({});

    const [connections, setConnections] = useState<Connection[]>([]);
    const [activeCable, setActiveCable] = useState<{ from: string; startPos: Point } | null>(null);
    const [mousePos, setMousePos] = useState<Point>({ x: 0, y: 0 });
    const [portPositions, setPortPositions] = useState<Record<string, Point>>({});

    const [betAmount, setBetAmount] = useState(500);
    const [betTitle, setBetTitle] = useState("NEW_TRANSACTION");
    const [isSubmitted, setIsSubmitted] = useState(false);

    // 1. REFINED CALCULATION (Fixes the filter/lag and positioning bugs)
    const calculatePositions = () => {
        if (!containerRef.current) return;
        const parentRect = containerRef.current.getBoundingClientRect();
        const newPositions: Record<string, Point> = {};

        Object.entries(portsRef.current).forEach(([id, el]) => {
            if (el) {
                const rect = el.getBoundingClientRect();
                newPositions[id] = {
                    x: rect.left - parentRect.left + rect.width / 2,
                    y: rect.top - parentRect.top + rect.height / 2,
                };
            }
        });
        setPortPositions(newPositions);
    };

    useLayoutEffect(() => {
        // Use requestAnimationFrame to wait for the DOM to paint properly
        const update = () => requestAnimationFrame(calculatePositions);
        update(); // Initial calculation

        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [connections]); // Re-calc if UI shape changes

    // 2. REGISTRATION
    const registerPort = (id: string, el: HTMLDivElement | null) => {
        portsRef.current[id] = el;
    };

    // 3. LOGIC
    const isPathComplete = () => {
        const hasSource = connections.some(c => c.from === "source-out" && c.to === "trans-in-a");
        const hasOpponent = connections.some(c =>
            players.some(p => p.id === c.from) && c.to === "trans-in-b"
        );
        const hasEncoderIn = connections.some(c => c.from === "trans-out" && c.to === "label-in");
        const hasFinalChain = connections.some(c => c.from === "label-out" && c.to === "exec-in");
        return hasSource && hasOpponent && hasEncoderIn && hasFinalChain;
    };

    const isWireLive = (from: string, to: string) => {
        if (!isPathComplete()) return false;
        const isSourcePath = from === "source-out" && to === "trans-in-a";
        const isOpponentPath = from.startsWith("p-") && to === "trans-in-b";
        const isTransformerPath = from === "trans-out" && to === "label-in";
        const isEncoderPath = from === "label-out" && to === "exec-in";
        return isSourcePath || isOpponentPath || isTransformerPath || isEncoderPath;
    };

    const getConnectedPlayer = () => {
        const conn = connections.find(c => c.to === "trans-in-b");
        if (!conn) return "UNKNOWN";
        const player = players.find(p => p.id === conn.from);
        return player ? player.name.toUpperCase() : "UNKNOWN";
    };

    const statusMessage = isPathComplete()
        ? `Bet from ${session?.user?.name || "YOU"} to ${getConnectedPlayer()} for ${betAmount} CR as "${betTitle}"`
        : "Circuit Incomplete";

    // 4. INTERACTION HANDLERS
    const handleJackClick = (id: string) => {
        if (isPathComplete()) return; // Lockout when circuit is live

        if (!activeCable) {
            if (portPositions[id]) {
                setActiveCable({ from: id, startPos: portPositions[id] });
            }
        } else {
            if (activeCable.from !== id) {
                setConnections((prev) => [
                    ...prev,
                    { from: activeCable.from, to: id, id: Math.random().toString() }
                ]);
            }
            setActiveCable(null);
        }
    };

    const deleteConnection = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        setConnections((prev) => prev.filter(c => c.id !== id));
    };

    const handleLeverRelease = async (e: any, info: any) => {
        // Si le levier est tiré vers le bas et le circuit est complet
        if (isPathComplete() && info.point.y > 60) {

            const conn = connections.find(c => c.to === "trans-in-b");
            if (!conn) return;

            const targetPlayerId = conn.from; // C'est directement l'ID Prisma

            try {
                await createBet(targetPlayerId, betAmount, betTitle);

                // Succès visuel
                setIsSubmitted(true);
                setTimeout(() => {
                    setIsSubmitted(false);
                    setConnections([]); // Reset les câbles après le succès
                }, 3000);
            } catch (error: any) {
                console.error("Bet failed:", error.message);
                // Tu peux ajouter un état d'erreur visuel ici (ex: le levier qui devient rouge)
            }
        }
    };

    const drawCable = (start: Point, end: Point) => {
        if (!start || !end) return "";
        const sag = Math.abs(start.x - end.x) * 0.2 + 150;
        return `M ${start.x} ${start.y} C ${start.x} ${start.y + sag}, ${end.x} ${end.y + sag}, ${end.x} ${end.y}`;
    };

    return (
        <main
            ref={containerRef}
            onContextMenu={(e) => {
                e.preventDefault();
                if (activeCable) setActiveCable(null);
            }}
            onMouseMove={(e) => {
                if (!containerRef.current) return;
                const rect = containerRef.current.getBoundingClientRect();
                setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            }}
            className="h-dvh bg-[#0a0a0a] text-white overflow-hidden relative font-mono p-12 select-none flex items-center justify-center"
        >
            {/* BIG DYNAMIC BACKGROUND TEXT */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
                <h1 className={`text-[18vw] font-(family-name:--font-squidwod) font-black tracking-tighter transition-colors duration-700 opacity-10 select-none ${isPathComplete() ? 'text-main-yellow' : 'text-main-green'}`}>
                    GAMBLING
                </h1>
            </div>



            {/* SPACED GRID */}
            <div className="grid grid-cols-4 gap-16 w-full max-w-[1500px] z-20 relative h-full items-center">

                {/* LEFT: POWER SOURCE */}
                <div className="flex justify-center">
                    <Module title="SOURCE UNIT">
                        <div className="flex flex-col items-center py-6 gap-8">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full border-4 border-main-green/20 overflow-hidden shadow-[0_0_20px_rgba(34,197,94,0.1)] bg-black/40 flex items-center justify-center">
                                    {session?.user?.image ? (
                                        <img
                                            src={session.user.image}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                            referrerPolicy="no-referrer"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-discord-blurple/20 animate-pulse">
                                            <span className="text-main-green text-[8px] font-black">SCAN...</span>
                                        </div>
                                    )}
                                </div>
                                <div className={`absolute bottom-0 right-1 w-6 h-6 border-4 border-[#121212] rounded-full shadow-sm ${session ? 'bg-[#23a559]' : 'bg-gray-600'}`} />
                            </div>

                            <Jack id="source-out" onRegistered={registerPort} onClick={handleJackClick} active={activeCable?.from === "source-out"} />

                            <div className="text-center">
                                <p className="text-xs text-main-green font-bold tracking-tighter italic truncate max-w-[120px]">
                                    {session?.user?.name || "GUEST_USER"}
                                </p>
                                <p className="text-sm text-white font-black">5000 CR</p>
                            </div>
                        </div>
                    </Module>
                </div>

                {/* CENTER: LOGIC MODULES */}
                <div className="col-span-2 space-y-16">
                    <div className="grid grid-cols-2 gap-12">
                        <Module title="BET_TRANSFORMER">
                            <div className="flex flex-col items-center py-2 gap-6">
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-[8px] font-black text-main-yellow tracking-widest">SUM_OUT</span>
                                    <Jack id="trans-out" onRegistered={registerPort} onClick={handleJackClick} active={activeCable?.from === "trans-out"} activeColor="#F2C80C" />
                                </div>

                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setBetAmount(p => Math.max(0, p - 100))}
                                        className="w-12 h-12 rounded-full bg-discord-black border-2 border-white/5 hover:border-main-yellow hover:text-main-yellow transition-all font-black text-2xl flex items-center justify-center shadow-lg"
                                    >-</button>

                                    <div className="bg-black text-main-yellow text-4xl px-4 py-2 rounded-lg border-2 border-main-yellow/20 font-black shadow-[inset_0_0_15px_rgba(254,200,12,0.1)] min-w-[120px] text-center">
                                        {betAmount}
                                    </div>

                                    <button
                                        onClick={() => setBetAmount(p => p + 100)}
                                        className="w-12 h-12 rounded-full bg-discord-black border-2 border-white/5 hover:border-main-yellow hover:text-main-yellow transition-all font-black text-2xl flex items-center justify-center shadow-lg"
                                    >+</button>
                                </div>

                                <div className="flex justify-around w-full px-4 border-t border-white/5 pt-4">
                                    <div className="flex flex-col items-center gap-1">
                                        <Jack id="trans-in-a" onRegistered={registerPort} onClick={handleJackClick} active={activeCable?.from === "trans-in-a"} />
                                        <span className="text-[8px] font-black text-white/30 uppercase">In_A</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <Jack id="trans-in-b" onRegistered={registerPort} onClick={handleJackClick} active={activeCable?.from === "trans-in-b"} />
                                        <span className="text-[8px] font-black text-white/30 uppercase">In_B</span>
                                    </div>
                                </div>
                            </div>
                        </Module>

                        <Module title="DATA ENCODER">
                            <div className="flex flex-col items-center justify-center h-full gap-6 px-4">
                                <input
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-xs font-black tracking-widest uppercase text-blue-300 focus:outline-none focus:border-blue-500 transition-colors text-center"
                                    placeholder="INPUT NAME..."
                                    value={betTitle}
                                    onChange={(e) => setBetTitle(e.target.value)}
                                />
                                <div className="flex gap-12 w-full justify-center">
                                    <Jack id="label-in" onRegistered={registerPort} onClick={handleJackClick} active={activeCable?.from === "label-in"} />
                                    <Jack id="label-out" onRegistered={registerPort} onClick={handleJackClick} active={activeCable?.from === "label-out"} />
                                </div>
                            </div>
                        </Module>
                    </div>

                    <Module title="DISTRIBUTION NODES (CONNECTED_USERS)">
                        <div className="grid grid-cols-5 gap-6 py-6 px-4">
                            {players.map((player) => (
                                <div key={player.id} className="flex flex-col items-center gap-2">
                                    {/* Avatar du joueur */}
                                    <div className="w-10 h-10 rounded-full border-2 border-white/5 overflow-hidden bg-black/40 shadow-lg">
                                        {player.image ? (
                                            <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-main-green/10" />
                                        )}
                                    </div>

                                    <span className="text-[8px] opacity-40 font-bold truncate max-w-[60px] uppercase tracking-tighter text-center">
                                        {player.name}
                                    </span>

                                    {/* La prise utilise maintenant l'ID PRISMA unique */}
                                    <Jack
                                        id={player.id}
                                        onRegistered={registerPort}
                                        onClick={handleJackClick}
                                        active={activeCable?.from === player.id}
                                    />
                                </div>
                            ))}

                            {/* Compléter avec des ports vides si moins de 10 joueurs */}
                            {Array.from({ length: Math.max(0, 10 - players.length) }).map((_, i) => (
                                <div key={`empty-${i}`} className="flex flex-col items-center gap-2 opacity-10">
                                    <span className="text-[8px] font-bold">VACANT</span>
                                    <div className="w-12 h-12 rounded-full bg-black border-2 border-dashed border-white/20" />
                                </div>
                            ))}
                        </div>
                    </Module>
                </div>

                {/* RIGHT: EXECUTION */}
                <div className="flex justify-center">
                    <Module title="FINAL BREAKER">
                        <div className="flex flex-col items-center py-12 gap-10">
                            <Jack id="exec-in" onRegistered={registerPort} onClick={handleJackClick} active={activeCable?.from === "exec-in"} />
                            <div className="w-16 h-40 bg-black/60 rounded-xl p-2 border border-white/10 relative shadow-inner">
                                <motion.div
                                    drag="y"
                                    dragConstraints={{ top: 0, bottom: 104 }}
                                    dragElastic={0}
                                    onDragEnd={handleLeverRelease}
                                    className={`w-full h-10 rounded-lg cursor-grab active:cursor-grabbing flex items-center justify-center transition-colors duration-300 ${isPathComplete() ? "bg-main-yellow shadow-[0_0_25px_#F2C80C]" : "bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                                        }`}
                                >
                                    <div className="w-1/2 h-1 bg-white/30 rounded" />
                                </motion.div>
                            </div>

                            <div className="text-center px-2">
                                <span className={`text-[10px] font-black uppercase transition-colors block leading-tight ${isPathComplete() ? "text-main-yellow animate-pulse" : "text-red-500"
                                    }`}>
                                    {statusMessage}
                                </span>
                                {isPathComplete() && (
                                    <span className="text-[8px] text-main-yellow/50 mt-3 block tracking-tighter">
                                        (Right-click any wire to edit circuit)
                                    </span>
                                )}
                            </div>
                        </div>
                    </Module>
                </div>
            </div>

            {/* CABLE LAYER */}
            <svg className="absolute inset-0 pointer-events-none z-30 w-full h-full">
                <defs>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {connections.map((conn) => {
                    const isLive = isWireLive(conn.from, conn.to);
                    return (
                        <motion.path
                            key={conn.id}
                            d={drawCable(portPositions[conn.from], portPositions[conn.to])}
                            className="pointer-events-auto cursor-pointer"
                            fill="none"
                            onContextMenu={(e) => deleteConnection(e, conn.id)}
                            // Only apply the expensive filter if the wire is live
                            filter={isLive ? "url(#glow)" : undefined}
                            stroke={isLive ? "#F2C80C" : "#22c55e"}
                            strokeWidth={isLive ? 6 : 4}
                            animate={{
                                stroke: isLive ? "#F2C80C" : "#22c55e",
                                strokeWidth: isLive ? 6 : 4,
                            }}
                            transition={{ duration: 0.3 }}
                        />
                    );
                })}

                {activeCable && (
                    <path
                        d={drawCable(activeCable.startPos, mousePos)}
                        stroke="#444"
                        strokeWidth="3"
                        strokeDasharray="10 5"
                        fill="none"
                        className="opacity-70"
                    />
                )}
            </svg>

            {/* SUCCESS OVERLAY */}
            <AnimatePresence>
                {isSubmitted && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[100] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center border-4 border-main-yellow/20"
                    >
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="text-center">
                            <div className="w-24 h-24 border-4 border-main-yellow rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_#F2C80C]">
                                <motion.div initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} className="text-main-yellow text-5xl">
                                    ✓
                                </motion.div>
                            </div>
                            <h2 className="text-main-yellow text-5xl font-black italic tracking-tighter mb-4">TRANSACTION_SUBMITTED</h2>
                            <p className="text-white/80 font-mono text-lg max-w-xl mx-auto bg-black/50 p-4 rounded-lg border border-white/10">
                                {statusMessage}
                            </p>
                            <div className="mt-12 flex gap-3 justify-center">
                                {[...Array(3)].map((_, i) => (
                                    <motion.div key={i} animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, delay: i * 0.2 }} className="w-3 h-3 bg-main-yellow rounded-full" />
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}

// --- CLEAN & MODERN SUB-COMPONENTS ---

function Module({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-[#121212]/90 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl relative w-full">
            <h3 className="text-[10px] font-black text-white/30 mb-6 uppercase tracking-[0.2em]">{title}</h3>
            {children}
        </div>
    );
}

function Jack({ id, onRegistered, onClick, active, activeColor }: {
    id: string;
    onRegistered: (id: string, el: HTMLDivElement | null) => void;
    onClick: (id: string) => void;
    active: boolean;
    activeColor?: string;
}) {
    return (
        <div
            ref={(el) => onRegistered(id, el)}
            onClick={() => onClick(id)}
            className={`w-12 h-12 rounded-full bg-[#0a0a0a] border-2 flex items-center justify-center cursor-pointer transition-all duration-300
                ${active ? '' : 'border-white/10 hover:border-white/30 hover:scale-105'}
            `}
            style={active ? { borderColor: activeColor || '#22c55e', boxShadow: `0 0 20px ${activeColor || '#22c55e'}` } : undefined}
        >
            <div className="w-5 h-5 rounded-full bg-[#151515] border border-white/5 shadow-inner flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-black" />
            </div>
        </div>
    );
}