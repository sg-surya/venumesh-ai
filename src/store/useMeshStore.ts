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
  
  // Network State
  networkMode: 'online' | 'mesh-only';
  setNetworkMode: (mode: 'online' | 'mesh-only') => void;
  connectedPeers: number;
  
  // Emergency State
  emergency: EmergencyState;
  triggerEmergency: (type: IncidentType, location?: string, confidence?: number) => void;
  clearEmergency: () => void;
  
  // Communication
  messages: Message[];
  addMessage: (text: string) => void;
  receiveMeshMessage: (message: Message) => void;
  
  // Simulation Controls
  simulatePeerDisconnection: () => void;
  simulatePeerConnection: () => void;
}

export const useMeshStore = create<MeshStore>((set, get) => ({
  deviceId: Math.random().toString(36).substring(2, 9),
  role: 'guest',
  setRole: (role) => set({ role }),
  
  networkMode: 'online',
  setNetworkMode: (mode) => set({ networkMode: mode }),
  
  connectedPeers: 0,
  
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
  addMessage: (text) => set((state) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substring(2, 9),
      senderId: state.deviceId,
      senderRole: state.role,
      text,
      timestamp: Date.now(),
    };
    return { messages: [...state.messages, newMessage] };
  }),
  
  receiveMeshMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  
  simulatePeerConnection: () => set((state) => ({ connectedPeers: state.connectedPeers + 1 })),
  simulatePeerDisconnection: () => set((state) => ({ connectedPeers: Math.max(0, state.connectedPeers - 1) })),
}));
