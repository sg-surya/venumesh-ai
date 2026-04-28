import { create } from 'zustand';

export type Role = 'guest' | 'staff' | 'admin';
export type IncidentType = 'fire' | 'active_shooter' | 'medical' | 'structural' | null;

export interface Message {
  id: string;
  senderId: string;
  senderRole: Role;
  text: string;
  timestamp: number;
  isMeshRelay?: boolean;
}

export interface Peer {
  id: string;
  role: Role;
  location: { x: number; y: number };
}

export interface EmergencyState {
  isActive: boolean;
  type: IncidentType;
  location: string | null;
  confidence: number; // 0-100 indicating AI confidence/multi-device confirmation
  reportedAt: number | null;
}

interface MeshStore {
  // Device Identity
  deviceId: string;
  role: Role;
  setRole: (role: Role) => void;
  myLocation: { x: number; y: number };
  setMyLocation: (loc: { x: number; y: number }) => void;
  
  // Network State
  networkMode: 'online' | 'mesh-only';
  setNetworkMode: (mode: 'online' | 'mesh-only') => void;
  
  peers: Peer[];
  addPeer: (peer: Peer) => void;
  removePeer: (id: string) => void;
  
  // Emergency State
  emergency: EmergencyState;
  triggerEmergency: (type: IncidentType, location?: string, confidence?: number) => void;
  clearEmergency: () => void;
  
  // Communication
  messages: Message[];
  addMessage: (text: string, senderId?: string, senderRole?: Role) => void;
  clearMessages: () => void;
  
  // Simulation Controls
  simulationState: 'idle' | 'running' | 'completed';
  simulationPhase: string;
  setSimulationState: (state: 'idle' | 'running' | 'completed', phase?: string) => void;
  resetState: () => void;
}

export const useMeshStore = create<MeshStore>((set, get) => ({
  deviceId: Math.random().toString(36).substring(2, 9),
  role: 'guest',
  setRole: (role) => set({ role }),
  
  myLocation: { x: 70, y: 420 },
  setMyLocation: (myLocation) => set({ myLocation }),
  
  networkMode: 'online',
  setNetworkMode: (mode) => set({ networkMode: mode }),
  
  peers: [],
  addPeer: (peer) => set((state) => ({ peers: [...state.peers, peer] })),
  removePeer: (id) => set((state) => ({ peers: state.peers.filter(p => p.id !== id) })),
  
  emergency: {
    isActive: false,
    type: null,
    location: null,
    confidence: 0,
    reportedAt: null,
  },
  
  triggerEmergency: (type, location = 'Auto-detected', confidence = 85) => set((state) => ({
    emergency: {
      isActive: true,
      type,
      location,
      confidence,
      reportedAt: Date.now(),
    }
  })),
  
  clearEmergency: () => set({
    emergency: {
      isActive: false,
      type: null,
      location: null,
      confidence: 0,
      reportedAt: null,
    }
  }),
  
  messages: [],
  addMessage: (text, overrideId, overrideRole) => set((state) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substring(2, 9),
      senderId: overrideId || state.deviceId,
      senderRole: overrideRole || state.role,
      text,
      timestamp: Date.now(),
      isMeshRelay: !!overrideId,
    };
    return { messages: [...state.messages, newMessage] };
  }),
  clearMessages: () => set({ messages: [] }),
  
  simulationState: 'idle',
  simulationPhase: '',
  setSimulationState: (state, phase = '') => set({ simulationState: state, simulationPhase: phase }),
  
  resetState: () => set((state) => ({
    networkMode: 'online',
    peers: [],
    messages: [],
    myLocation: { x: 70, y: 420 },
    emergency: {
      isActive: false,
      type: null,
      location: null,
      confidence: 0,
      reportedAt: null,
    },
    simulationState: 'idle',
    simulationPhase: '',
  }))
}));
