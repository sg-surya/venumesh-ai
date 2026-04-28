import React, { useState } from 'react';
import { useMeshStore, IncidentType } from '../../store/useMeshStore';
import { Mic, MicOff } from 'lucide-react';
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
  const { emergency, triggerEmergency, clearEmergency, role } = useMeshStore();
  const [showSosConfirm, setShowSosConfirm] = useState(false);

  const handleSOS = (type: IncidentType) => {
    triggerEmergency(type, 'Self-Reported');
    setShowSosConfirm(false);
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Visual Element */}
      <div className="absolute top-1/2 right-[-20%] md:right-[-100px] -translate-y-1/2 w-[350px] md:w-[450px] h-[350px] md:h-[450px] border border-[#FF4D00]/30 rounded-full z-0 pointer-events-none flex items-center justify-center">
        <div className="w-[200px] md:w-[300px] h-[200px] md:h-[300px] border border-white/5 rounded-full" />
      </div>

      <div className="flex-1 flex flex-col justify-center relative z-10 w-full pt-10">
        <AnimatePresence mode="wait">
          {!showSosConfirm ? (
            <motion.div
              key="sos-btn"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col"
            >
              <h1 
                className={cn(
                  "text-[120px] md:text-[200px] font-black leading-[0.82] tracking-[-0.05em] uppercase mb-4",
                  emergency.isActive ? "text-[#FF4D00]" : "text-white"
                )}
              >
                {emergency.isActive ? (
                  <>
                    Evac<br/>
                    <span className="text-white">Now</span>
                  </>
                ) : (
                  <>
                    Venue<br/>
                    <span className="text-[#FF4D00]">Safe</span>
                  </>
                )}
              </h1>

              <div className="flex flex-wrap gap-10 md:gap-20 mt-10">
                <div className="w-[180px]">
                  <span className="text-[10px] uppercase tracking-[0.1em] text-white/40 mb-3 block">Status</span>
                  <p className="text-[14px] leading-relaxed text-white">
                    {emergency.isActive ? `Critical event detected: ${emergency.type?.replace('_', ' ').toUpperCase()} at ${emergency.location}.` : 'All environmental and network systems are operating normally.'}
                  </p>
                </div>
                
                <div className="w-[180px]">
                  <span className="text-[10px] uppercase tracking-[0.1em] text-white/40 mb-3 block">Actions</span>
                  <div className="flex flex-col gap-2 items-start">
                    <button 
                      onClick={() => !emergency.isActive ? setShowSosConfirm(true) : null}
                      disabled={emergency.isActive}
                      className="text-[14px] leading-relaxed text-[#FF4D00] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {emergency.isActive ? "Network locked." : "Trigger SOS Protocol"}
                    </button>
                    {emergency.isActive && role !== 'guest' && (
                      <button 
                        onClick={clearEmergency}
                        className="text-[14px] leading-relaxed text-white hover:text-white/70 transition-colors"
                      >
                        Clear Alert (Staff)
                      </button>
                    )}
                  </div>
                </div>

                <div className="w-[180px]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase tracking-[0.1em] text-white/40 block">AI Listener</span>
                    <button onClick={onToggleDetection} className="text-white/40 hover:text-white">
                      {isDetecting ? <Mic size={12} /> : <MicOff size={12} />}
                    </button>
                  </div>
                  {isDetecting ? (
                    <div className="h-6 flex items-end gap-0.5 w-full">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "flex-1 transition-all duration-75",
                            (i / 24) < audioLevel ? "bg-[#FF4D00]" : "bg-white/10"
                          )}
                          style={{ height: (i / 24) < audioLevel ? '100%' : '20%' }}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-[14px] leading-relaxed text-white/40">Offline</p>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="sos-confirm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col w-full max-w-[400px]"
            >
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#FF4D00] mb-8 block">Select Incident Type</h3>
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => handleSOS('fire')}
                  className="text-left py-4 border-b border-white/10 text-2xl font-bold tracking-[-0.02em] hover:text-[#FF4D00] hover:border-[#FF4D00] transition-colors"
                >
                  Fire / Smoke
                </button>
                <button 
                  onClick={() => handleSOS('active_shooter')}
                  className="text-left py-4 border-b border-white/10 text-2xl font-bold tracking-[-0.02em] hover:text-[#FF4D00] hover:border-[#FF4D00] transition-colors"
                >
                  Active Attack
                </button>
                <button 
                  onClick={() => handleSOS('medical')}
                  className="text-left py-4 border-b border-white/10 text-2xl font-bold tracking-[-0.02em] hover:text-[#FF4D00] hover:border-[#FF4D00] transition-colors"
                >
                  Medical Emergency
                </button>
                <button 
                  onClick={() => setShowSosConfirm(false)}
                  className="mt-8 text-[12px] uppercase tracking-[0.1em] text-white/40 hover:text-white text-left inline-block self-start"
                >
                  Cancel Protocol
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
