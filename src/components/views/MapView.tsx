import React from 'react';
import { useMeshStore } from '../../store/useMeshStore';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

export function MapView() {
  const { emergency, myLocation, peers } = useMeshStore();

  return (
    <div className="flex flex-col h-full relative pt-10">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-6 mb-6 shrink-0 z-10 flex justify-between items-end">
        <div>
          <h2 className="text-[24px] font-bold tracking-[-0.02em] text-white">
            Floor<br/>Plan
          </h2>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-[0.1em] text-white/40 block mb-1">Status</span>
          {emergency.isActive ? (
            <span className="text-[12px] font-mono text-[#FF4D00]">EVACUATE</span>
          ) : (
            <span className="text-[12px] font-mono text-white/40">NORMAL</span>
          )}
        </div>
      </div>

      <div className={cn(
        "flex-1 relative overflow-hidden flex items-center justify-center border border-white/5",
        emergency.isActive ? "bg-[#FF4D00]/5" : "bg-transparent"
      )}>
        {/* Abstract Floor Plan SVG */}
        <svg viewBox="0 0 400 600" className="w-full max-w-[400px] h-full max-h-[600px] text-white/20 transition-all duration-300">
          <g transform="translate(40, 40)">
            {/* Outer walls */}
            <rect x="0" y="0" width="320" height="520" fill="none" stroke="currentColor" strokeWidth="2" />
            
            {/* Inner Rooms */}
            <rect x="0" y="0" width="140" height="200" fill="none" stroke="currentColor" strokeWidth="1" />
            <rect x="180" y="0" width="140" height="200" fill="none" stroke="currentColor" strokeWidth="1" />
            <rect x="0" y="320" width="140" height="200" fill="none" stroke="currentColor" strokeWidth="1" />
            <rect x="180" y="320" width="140" height="200" fill="none" stroke="currentColor" strokeWidth="1" />
            
            {/* Corridors */}
            <path d="M140 0 v520" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
            <path d="M180 0 v520" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
            <path d="M0 200 h320" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
            <path d="M0 320 h320" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />

            {/* Exits */}
            <g transform="translate(160, -10)">
               <rect x="0" y="0" width="40" height="10" className="fill-white" />
               <text x="20" y="-10" textAnchor="middle" className="text-[8px] fill-white tracking-[0.2em]">EXIT_N</text>
            </g>
            <g transform="translate(160, 520)">
               <rect x="0" y="0" width="40" height="10" className="fill-white" />
               <text x="20" y="25" textAnchor="middle" className="text-[8px] fill-white tracking-[0.2em]">EXIT_S</text>
            </g>

            {/* Peers */}
            {peers.map((peer) => (
              <g key={peer.id} transform={`translate(${peer.location.x}, ${peer.location.y})`} className="transition-all duration-500">
                <circle cx="0" cy="0" r="4" className={cn(peer.role === 'staff' ? "fill-blue-500" : "fill-white/40")} />
                <text x="10" y="3" textAnchor="start" className="text-[8px] fill-white/40 tracking-[0.1em]">{peer.id}</text>
              </g>
            ))}

            {/* User Location */}
            <g transform={`translate(${myLocation.x}, ${myLocation.y})`} className="transition-all duration-300">
              <circle cx="0" cy="0" r="6" className={cn(emergency.isActive ? "fill-[#FF4D00]" : "fill-white")} />
              <circle cx="0" cy="0" r="14" className={cn("fill-none animate-ping", emergency.isActive ? "stroke-[#FF4D00]" : "stroke-white")} />
              <text x="15" y="3" textAnchor="start" className={cn("text-[8px] tracking-[0.2em]", emergency.isActive ? "fill-[#FF4D00]" : "fill-white")}>YOU</text>
            </g>

            {/* Emergency UI Overlay inside Map */}
            {emergency.isActive && (
              <>
                {/* Danger Zone */}
                <circle cx="250" cy="100" r="60" className="fill-[#FF4D00]/20" />
                <circle cx="250" cy="100" r="4" className="fill-[#FF4D00] animate-pulse" />
                <text x="250" y="100" textAnchor="middle" className="text-[8px] fill-[#FF4D00] tracking-[0.2em] translate-y-4">DANGER_ZONE</text>
                
                {/* Evacuation Route Line */}
                <motion.path 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, repeat: Infinity }}
                  d={`M${myLocation.x} ${myLocation.y} L160 520`} 
                  fill="none" 
                  stroke="#ffffff" 
                  strokeWidth="3" 
                  strokeDasharray="6 6" 
                />
              </>
            )}
          </g>
        </svg>

        {/* Floating guidance banner */}
        {emergency.isActive && (
          <div className="absolute top-10 left-10 p-6 border border-white/20 bg-[#050505] shadow-2xl z-10 flex flex-col gap-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#FF4D00]">Instruction</p>
            <p className="text-[14px] leading-relaxed text-white">Proceed to South Exit.</p>
            <p className="text-[12px] text-white/40">Follow dotted path.</p>
          </div>
        )}
      </div>
    </div>
  );
}
