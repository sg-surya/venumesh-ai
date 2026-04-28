import React, { useState } from 'react';
import { useMeshStore, IncidentType } from '../../store/useMeshStore';
import { Mic, MicOff, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function DashboardView({ 
  isDetecting, 
  onToggleDetection, 
  audioLevel 
}: { 
  isDetecting: boolean, 
  onToggleDetection: () => void,
  audioLevel: number
}) {
  const { emergency, triggerEmergency, clearEmergency, role, peers, networkMode } = useMeshStore();
  const [showSosConfirm, setShowSosConfirm] = useState(false);

  const handleSOS = (type: IncidentType) => {
    triggerEmergency(type, 'Self-Reported');
    setShowSosConfirm(false);
  };

  return (
    <div className="flex flex-col h-full relative pt-6 z-10 w-full overflow-y-auto">
      <div className="flex items-end justify-between mb-8 pb-6 border-b border-white/10 shrink-0">
        <h1 className="text-[32px] md:text-[40px] font-black tracking-tighter uppercase leading-none text-white">
          System<span className="text-[#FF4D00]">_Dash</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 content-start pb-10">
        {/* Security Status */}
        <div className={cn(
          "p-6 border flex flex-col gap-4 transition-colors",
          emergency.isActive ? "border-[#FF4D00] bg-[#FF4D00]/10" : "border-white/10 bg-white/5"
        )}>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Current Status</span>
          <h2 className={cn("text-[24px] font-bold uppercase tracking-[-0.02em]", emergency.isActive ? "text-[#FF4D00]" : "text-white")}>
            {emergency.isActive ? "Emergency Protocol Active" : "Venue Secure"}
          </h2>
          <p className="text-[14px] text-white/70 leading-relaxed">
            {emergency.isActive 
              ? `Critical event detected: ${emergency.type?.replace('_', ' ').toUpperCase()} at ${emergency.location}. Evacuation routing engaged.` 
              : 'All environmental sensors and network relays are operating within normal parameters.'}
          </p>
          {emergency.isActive && role !== 'guest' && (
            <button onClick={clearEmergency} className="mt-4 self-start text-[10px] uppercase tracking-[0.2em] border border-white/30 px-4 py-2 hover:bg-white hover:text-black transition-colors">
              Clear Alert (Staff)
            </button>
          )}
        </div>

        {/* Network Health */}
        <div className="p-6 border border-white/10 bg-white/5 flex flex-col gap-4">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Network Health</span>
          <div className="flex justify-between items-start">
            <h2 className="text-[24px] font-bold uppercase tracking-[-0.02em] text-white">Topology</h2>
            <span className={cn("text-[10px] font-bold px-3 py-1 uppercase tracking-[0.1em]", networkMode === 'online' ? "bg-white/10 text-white" : "bg-[#FF4D00] text-[#050505]")}>
              {networkMode === 'online' ? 'Global' : 'Mesh Only'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <span className="text-[24px] font-bold text-white block leading-none mb-1">{peers.length}</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Active Peers</span>
            </div>
            <div>
              <span className="text-[24px] font-bold text-[#FF4D00] block leading-none mb-1 animate-pulse">AES-256</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Encryption</span>
            </div>
          </div>
        </div>

        {/* AI Listener */}
        <div className="p-6 border border-white/10 bg-white/5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Local AI Intelligence</span>
            <button onClick={onToggleDetection} className="text-white/40 hover:text-white transition-colors">
              {isDetecting ? <Mic size={16} /> : <MicOff size={16} />}
            </button>
          </div>
          <h2 className="text-[24px] font-bold uppercase tracking-[-0.02em] text-white">Acoustic Monitor</h2>
          <p className="text-[12px] text-white/40 mt-[-4px]">On-device detection for alarms and screams</p>
          
          {isDetecting ? (
            <div className="h-12 flex items-end gap-[3px] w-full mt-2">
              {Array.from({ length: 32 }).map((_, i) => {
                const isActive = (i / 32) < audioLevel;
                return (
                  <div 
                    key={i} 
                    className={cn(
                      "flex-1 transition-all duration-75",
                      isActive ? "bg-[#FF4D00]" : "bg-white/10"
                    )}
                    style={{ height: isActive ? '100%' : '30%' }}
                  />
                );
              })}
            </div>
          ) : (
            <div className="h-12 flex items-center justify-center text-[10px] uppercase tracking-[0.2em] text-white/30 border border-white/10 mt-2">
              Offline / Disabled
            </div>
          )}
        </div>

        {/* SOS Trigger */}
        <div className="p-6 border border-white/10 bg-white/5 flex flex-col gap-4">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Manual Override</span>
          {!showSosConfirm ? (
            <button
              onClick={() => !emergency.isActive ? setShowSosConfirm(true) : null}
              disabled={emergency.isActive}
              className="mt-2 flex-1 min-h-[80px] flex items-center justify-center gap-4 bg-[#FF4D00]/10 border border-[#FF4D00]/50 hover:bg-[#FF4D00] hover:text-[#050505] transition-colors disabled:opacity-30 disabled:cursor-not-allowed group text-[#FF4D00]"
            >
              <AlertTriangle className="group-hover:text-[#050505]" size={20} />
              <span className="text-[18px] font-bold uppercase tracking-[0.1em]">Trigger SOS</span>
            </button>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              <button onClick={() => handleSOS('fire')} className="text-left text-[14px] uppercase tracking-[0.1em] font-bold py-2 hover:text-[#FF4D00] transition-colors border-b border-white/10">Fire / Smoke</button>
              <button onClick={() => handleSOS('active_shooter')} className="text-left text-[14px] uppercase tracking-[0.1em] font-bold py-2 hover:text-[#FF4D00] transition-colors border-b border-white/10">Active Attack</button>
              <button onClick={() => handleSOS('medical')} className="text-left text-[14px] uppercase tracking-[0.1em] font-bold py-2 hover:text-[#FF4D00] transition-colors border-b border-white/10">Medical Incident</button>
              <button onClick={() => setShowSosConfirm(false)} className="text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white mt-4 self-start">Cancel</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
