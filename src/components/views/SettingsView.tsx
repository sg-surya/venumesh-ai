import React from 'react';
import { useMeshStore, Role } from '../../store/useMeshStore';
import { cn } from '../../lib/utils';

export function SettingsView() {
  const { role, setRole, networkMode, setNetworkMode, deviceId, connectedPeers } = useMeshStore();

  return (
    <div className="flex flex-col h-full relative pt-10">
      {/* Visual Element */}
      <div className="absolute top-1/2 left-[-20%] -translate-y-1/2 w-[450px] h-[450px] border border-[#FF4D00]/10 rounded-full z-0 pointer-events-none" />

      {/* Header */}
      <div className="border-b border-white/10 pb-6 mb-12 shrink-0 z-10 flex justify-between items-end">
        <div>
          <h2 className="text-[24px] font-bold tracking-[-0.02em] text-white">
            System<br/>Config
          </h2>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-[0.1em] text-white/40 block mb-1">Node Identity</span>
          <span className="text-[12px] font-mono text-[#FF4D00]">{deviceId}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-16 z-10 pr-4">
        {/* Role Selection */}
        <section className="flex flex-col md:flex-row gap-8">
          <div className="w-[180px] shrink-0">
            <span className="text-[10px] uppercase tracking-[0.1em] text-white/40 block mb-3">Access Level</span>
            <p className="text-[14px] leading-relaxed text-white/60">Simulate permissions to test emergency routing and broadcast capabilities.</p>
          </div>
          <div className="flex-1 flex flex-col gap-0 border-t border-white/10">
            {(['guest', 'staff', 'admin'] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={cn(
                  "flex items-center justify-between py-5 border-b border-white/10 transition-colors uppercase tracking-[0.1em] text-[12px]",
                  role === r 
                    ? "text-[#FF4D00] font-bold" 
                    : "text-white hover:text-[#FF4D00]"
                )}
              >
                <span>{r}_Access</span>
                {role === r && <span>[ Active ]</span>}
              </button>
            ))}
          </div>
        </section>

        {/* Network Simulation */}
        <section className="flex flex-col md:flex-row gap-8">
          <div className="w-[180px] shrink-0">
            <span className="text-[10px] uppercase tracking-[0.1em] text-white/40 block mb-3">Topology</span>
            <p className="text-[14px] leading-relaxed text-white/60">Simulate infrastructure failure to force mesh fallback routing.</p>
          </div>
          
          <div className="flex-1 border-t border-white/10 py-5">
            <div className="flex items-center justify-between">
              <span className="text-[12px] uppercase tracking-[0.1em] font-bold text-white">Global Internet</span>
              <button 
                onClick={() => setNetworkMode(networkMode === 'online' ? 'mesh-only' : 'online')}
                className={cn(
                  "text-[10px] uppercase tracking-[0.2em] transition-colors border px-4 py-2",
                  networkMode === 'online' ? "border-white border-white/30 text-white hover:text-white/60" : "border-[#FF4D00] text-[#FF4D00]"
                )}
              >
                {networkMode === 'online' ? "Connected" : "Severed"}
              </button>
            </div>
          </div>
        </section>

        {/* Diagnostics */}
        <section className="flex flex-col md:flex-row gap-8">
          <div className="w-[180px] shrink-0">
            <span className="text-[10px] uppercase tracking-[0.1em] text-white/40 block mb-3">Diagnostics</span>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-y-4 gap-x-8 text-[14px] border-t border-white/10 pt-5 text-white/60">
            <div className="flex flex-col border-b border-white/5 pb-4">
              <span className="text-[10px] uppercase tracking-[0.1em] text-white/40 mb-1">State</span>
              <span className="text-white">Active</span>
            </div>
            <div className="flex flex-col border-b border-white/5 pb-4">
              <span className="text-[10px] uppercase tracking-[0.1em] text-white/40 mb-1">Peers Connected</span>
              <span className="text-white">{connectedPeers}</span>
            </div>
            <div className="flex flex-col border-b border-white/5 pb-4">
              <span className="text-[10px] uppercase tracking-[0.1em] text-white/40 mb-1">Encryption</span>
              <span className="text-white">AES-256 (GCM)</span>
            </div>
            <div className="flex flex-col border-b border-white/5 pb-4">
              <span className="text-[10px] uppercase tracking-[0.1em] text-white/40 mb-1">Protocol</span>
              <span className="text-white">Wi-Fi Direct + BLE</span>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}
