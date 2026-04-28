import { useEffect, useRef } from 'react';
import { useMeshStore, Peer } from '../store/useMeshStore';

export function useSimulation() {
  const { 
    simulationState, setSimulationState, setNetworkMode, 
    triggerEmergency, addPeer, addMessage, clearMessages, resetState,
    setMyLocation, myLocation
  } = useMeshStore();
  
  const timeoutsRef = useRef<number[]>([]);
  const intervalRef = useRef<number | null>(null);

  const startSimulation = () => {
    if (simulationState !== 'idle') return;
    
    // Clear any previous state
    stopSimulation();
    
    setSimulationState('running', 'Initializing Scenario: Hotel Fire Response...');
    
    // Initial Setup
    addPeer({ id: 'guest-24', role: 'guest', location: { x: 50, y: 400 } });
    addPeer({ id: 'guest-89', role: 'guest', location: { x: 100, y: 450 } });
    
    const schedule = (delay: number, action: () => void) => {
      const id = window.setTimeout(action, delay);
      timeoutsRef.current.push(id);
    };

    // Phase 1: Network Failure & Mesh Formation
    schedule(2000, () => {
      setSimulationState('running', 'Phase 1: Network Offline. Establishing Mesh...');
      setNetworkMode('mesh-only');
      addPeer({ id: 'sec-alpha', role: 'staff', location: { x: 260, y: 150 } });
    });

    // Phase 2: AI audio detection -> Alarm Detected
    schedule(5000, () => {
      setSimulationState('running', 'Phase 2: Local AI detects fire alarm. Triggering SOS...');
      triggerEmergency('fire', '3rd Floor - West Wing', 92);
      addMessage('Automatic detection: Fire alarm pattern recognized locally. Confidence 92%.', 'system', 'admin');
    });

    // Phase 3: Mesh Broadcast & Multi-device verification
    schedule(8000, () => {
      setSimulationState('running', 'Phase 3: Mesh Broadcast & Peer Validation...');
      addMessage('Smell smoke near room 312!', 'guest-24', 'guest');
    });

    // Phase 4: Staff Notified & Guests Guided
    schedule(11000, () => {
      setSimulationState('running', 'Phase 4: Staff Notified & Guests Guided...');
      addMessage('Security confirming visual on smoke. Evacuate via South Exit immediately. North corridor blocked.', 'sec-alpha', 'staff');
    });

    // Phase 5: Evacuation Tracking
    schedule(14000, () => {
      setSimulationState('running', 'Phase 5: Evacuating & Tracking via Mesh...');
      
      let moveCount = 0;
      intervalRef.current = window.setInterval(() => {
        setMyLocation((prev) => {
          let newX = prev.x;
          let newY = prev.y;
          
          if (newX < 160) newX += 4;
          if (newY < 510) newY += 4;
          return { x: newX, y: newY };
        });
        
        moveCount++;
        if (moveCount > 25) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setSimulationState('running', 'Phase 6: Responder Handoff & Safe Zone Reached');
          addMessage('You have reached the Safe Zone. Awaiting Fire Dept handoff.', 'system', 'admin');
          
          setTimeout(() => {
             setSimulationState('completed', 'Simulation Finished');
          }, 4000);
        }
      }, 500);
    });
  };
  
  const stopSimulation = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    resetState();
  };
  
  useEffect(() => {
    return stopSimulation;
  }, []);
  
  return { startSimulation, stopSimulation };
}
