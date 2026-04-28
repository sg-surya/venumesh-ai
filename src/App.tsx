import React, { useState, useEffect } from 'react';
import { useMeshStore } from './store/useMeshStore';
import { Radio } from 'lucide-react';
import { DashboardView } from './components/views/DashboardView';
import { MapView } from './components/views/MapView';
import { ChatView } from './components/views/ChatView';
import { SettingsView } from './components/views/SettingsView';
import { cn } from './lib/utils';
import { useAudioDetection } from './hooks/useAudioDetection';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'map' | 'chat' | 'settings'>('dashboard');
  const { emergency, networkMode, simulatePeerConnection } = useMeshStore();
  const { start, stop, isDetecting, level } = useAudioDetection();

  // Simulate finding peers over time
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7 && useMeshStore.getState().connectedPeers < 25) {
        simulatePeerConnection();
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn(
      "min-h-screen flex flex-col font-sans transition-colors duration-500",
      emergency.isActive ? "bg-[#0a0000] text-white" : "bg-[#050505] text-white"
    )}>
      {/* Network Status Header */}
      <header className="px-10 py-10 flex items-center justify-between text-[11px] font-semibold tracking-[0.2em] uppercase shrink-0 z-10 w-full max-w-5xl mx-auto">
        <div className="flex flex-col gap-2">
          <span>VenueMesh AI / System</span>
          <div className="flex items-center gap-2">
            <Radio size={12} className={networkMode === 'mesh-only' ? 'animate-pulse text-[#FF4D00]' : 'text-white/40'} />
            <span className={networkMode === 'online' ? "text-white/40" : "text-[#FF4D00]"}>
              {networkMode === 'online' ? 'Global Network Connected' : 'Mesh Network (Offline-First)'}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-end text-white/40">
          <span>Active Nodes</span>
          <div className="flex items-center gap-2">
            <span className="text-white text-sm font-bold">ALL_{useMeshStore((s) => s.connectedPeers)}</span>
            <div className={cn("w-1.5 h-1.5 rounded-full", networkMode === 'online' ? "bg-white/40" : "bg-[#FF4D00]")} />
          </div>
        </div>
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
