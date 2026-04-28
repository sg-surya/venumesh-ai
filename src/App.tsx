import React, { useState } from 'react';
import { useMeshStore } from './store/useMeshStore';
import { Radio } from 'lucide-react';
import { DashboardView } from './components/views/DashboardView';
import { MapView } from './components/views/MapView';
import { ChatView } from './components/views/ChatView';
import { SettingsView } from './components/views/SettingsView';
import { cn } from './lib/utils';
import { useAudioDetection } from './hooks/useAudioDetection';
import { useSimulation } from './hooks/useSimulation';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'map' | 'chat' | 'settings'>('dashboard');
  const { emergency, networkMode, simulationState, simulationPhase } = useMeshStore();
  const { start, stop, isDetecting, level } = useAudioDetection();
  const { startSimulation, stopSimulation } = useSimulation();

  return (
    <div className={cn(
      "min-h-screen flex flex-col font-sans transition-colors duration-500",
      emergency.isActive ? "bg-[#0a0000] text-white" : "bg-[#050505] text-white"
    )}>
      {/* Network Status Header */}
      <header className="px-6 md:px-10 py-8 flex flex-col gap-6 text-[11px] font-semibold tracking-[0.2em] uppercase shrink-0 z-10 w-full max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-white/60">VenueMesh AI / System</span>
            <div className="flex items-center gap-2">
              <Radio size={12} className={networkMode === 'mesh-only' ? 'animate-pulse text-[#FF4D00]' : 'text-white/40'} />
              <span className={networkMode === 'online' ? "text-white/40" : "text-[#FF4D00]"}>
                {networkMode === 'online' ? 'Global Network Connected' : 'Mesh Network (Offline-First)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-2">
            {simulationState === 'idle' || simulationState === 'completed' ? (
              <button onClick={startSimulation} className="bg-[#FF4D00] text-[#050505] text-[10px] uppercase tracking-[0.2em] font-bold px-6 py-2 hover:bg-white transition-colors">
                Run Demo Scenario
              </button>
            ) : (
              <button onClick={stopSimulation} className="border border-white/20 text-white text-[10px] uppercase tracking-[0.2em] font-bold px-6 py-2 hover:bg-white/10 transition-colors">
                Stop Demo
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2 items-start md:items-end text-white/40">
            <span>Active Nodes</span>
            <div className="flex items-center gap-2">
              <span className="text-white text-sm font-bold">ALL_{useMeshStore((s) => s.peers.length)}</span>
              <div className={cn("w-1.5 h-1.5 rounded-full", networkMode === 'online' ? "bg-white/40" : "bg-[#FF4D00]")} />
            </div>
          </div>
        </div>
        
        {/* Active Simulation Banner */}
        {simulationState === 'running' && (
           <div className="w-full bg-[#FF4D00]/10 border border-[#FF4D00]/30 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-2 h-2 bg-[#FF4D00] rounded-full animate-ping" />
                 <span className="text-[#FF4D00] font-bold">{simulationPhase}</span>
              </div>
              <span className="text-white/50 text-[10px]">DEMO MODE</span>
           </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col px-10 pb-32">
        {activeTab === 'dashboard' && <DashboardView isDetecting={isDetecting} onToggleDetection={isDetecting ? stop : start} audioLevel={level} />}
        {activeTab === 'map' && <MapView />}
        {activeTab === 'chat' && <ChatView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full border-t border-white/10 flex px-10 py-10 bg-[#050505]/90 backdrop-blur-md justify-start gap-10 shrink-0 z-50">
        <div className="w-full max-w-5xl mx-auto flex justify-start gap-10">
          <NavItem 
            label="Status" 
            isActive={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
            alert={emergency.isActive}
          />
          <NavItem 
            label="Guide" 
            isActive={activeTab === 'map'} 
            onClick={() => setActiveTab('map')} 
          />
          <NavItem 
            label="Mesh" 
            isActive={activeTab === 'chat'} 
            onClick={() => setActiveTab('chat')} 
          />
          <NavItem 
            label="Net" 
            isActive={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
        </div>
      </nav>
    </div>
  );
}

function NavItem({ label, isActive, onClick, alert }: { label: string, isActive: boolean, onClick: () => void, alert?: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "transition-all relative text-[12px] uppercase tracking-[0.1em]",
        isActive ? "text-white font-bold opacity-100" : "text-white opacity-60 hover:opacity-80"
      )}
    >
      {alert && (
        <span className="absolute -top-1 -right-3 w-1.5 h-1.5 bg-[#FF4D00] rounded-full animate-ping" />
      )}
      {label}
    </button>
  );
}
