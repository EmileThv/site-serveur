"use client";

import React from "react";

export default function Jack({ id, onRegistered, onClick, active, activeColor }: {
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
