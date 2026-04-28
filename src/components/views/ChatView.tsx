import React, { useState, useRef, useEffect } from 'react';
import { useMeshStore } from '../../store/useMeshStore';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function ChatView() {
  const { messages, addMessage, deviceId, role, peers } = useMeshStore();
  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    addMessage(text.trim());
    setText('');
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full relative pt-10">
      {/* Visual Element */}
      <div className="absolute top-1/2 left-[-20%] -translate-y-1/2 w-[450px] h-[450px] border border-white/5 rounded-full z-0 pointer-events-none" />

      {/* Mesh Info Header */}
      <div className="border-b border-white/10 pb-6 mb-6 flex items-end justify-between shrink-0 z-10">
        <div>
          <h2 className="text-[24px] font-bold tracking-[-0.02em] text-white">
            Mesh<br/>Comms
          </h2>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-[0.1em] text-white/40 mb-1">Status</span>
          <div className="flex items-center gap-2 text-[#FF4D00] text-[12px] uppercase font-bold tracking-[0.1em]">
            {peers.length} Nodes Active
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-8 pr-2 z-10 flex flex-col">
        <AnimatePresence initial={false}>
          {messages.length === 0 ? (
            <div className="h-full flex items-center gap-10">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 writing-vertical-rl rotate-180">Sys_Log</span>
              <p className="text-[14px] leading-relaxed text-white/60 max-w-[200px]">Network silence. Awaiting transmissions across mesh nodes.</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === deviceId;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  layout
                  className={cn(
                    "max-w-[70%] border border-white/10 p-4",
                    isMe 
                      ? "ml-auto border-[#FF4D00]/50 bg-[#FF4D00]/5" 
                      : msg.senderRole === 'staff' || msg.senderRole === 'admin'
                        ? "mr-auto border-white/30"
                        : "mr-auto bg-white/5"
                  )}
                >
                  <div className="flex justify-between items-end mb-3 border-b border-white/10 pb-2">
                     <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/40">
                       {isMe ? 'Local' : `Node-${msg.senderId.slice(0, 4)}`}
                     </span>
                     <span className={cn(
                       "text-[10px] uppercase tracking-[0.1em] font-medium",
                       msg.senderRole === 'guest' ? 'text-white/30' : 'text-[#FF4D00]'
                     )}>
                       {msg.senderRole}
                     </span>
                  </div>
                  <p className="text-[14px] leading-relaxed text-white">{msg.text}</p>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="shrink-0 relative z-10 flex gap-4">
        <input 
          type="text" 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Transmit message..."
          className="flex-1 bg-transparent border-b border-white/20 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#FF4D00] transition-colors rounded-none text-[14px]"
        />
        <button 
          type="submit"
          className="text-[10px] uppercase tracking-[0.2em] text-[#FF4D00] hover:text-white transition-colors border-b border-[#FF4D00] hover:border-white py-4 whitespace-nowrap disabled:opacity-30 disabled:border-white/10 disabled:text-white/30"
          disabled={!text.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}
