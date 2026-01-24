import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";
import { X, Send, Loader2, Sparkles, Cpu, Zap, Binary, Terminal, ChevronRight, MessageSquare } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const SUGGESTED_QUESTIONS = [
  "How can I save tax legally?",
  "What is FinSight AI?",
  "Explain Old vs New Tax Regime",
  "Services provided by CA Sriharri?"
];

// --- Tech UI Components ---

const CircuitPattern = () => (
  <div className="absolute inset-0 overflow-hidden opacity-[0.03] pointer-events-none">
    <svg width="100%" height="100%">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  </div>
);

const FloatingTechIcon = ({ icon: Icon, delay, x, y }: { icon: any, delay: number, x: string, y: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0.1, 0.3, 0.1], 
      scale: [1, 1.2, 1],
      y: [0, -20, 0],
      rotate: [0, 45, 0]
    }}
    transition={{ 
      duration: 8, 
      repeat: Infinity, 
      delay: delay,
      ease: "easeInOut" 
    }}
    className={`absolute ${x} ${y} text-primary-500 pointer-events-none`}
  >
    <Icon size={24} />
  </motion.div>
);

const AudioVisualizer = () => (
  <div className="flex items-center gap-[2px] h-4">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        animate={{ height: ["20%", "100%", "20%"] }}
        transition={{ 
          duration: 0.8, 
          repeat: Infinity, 
          delay: i * 0.1,
          ease: "easeInOut" 
        }}
        className="w-1 bg-green-400 rounded-full"
      />
    ))}
  </div>
);

// Custom Animated Winking Bot Icon
const WinkingBot = ({ isHovered }: { isHovered: boolean }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="28" 
    height="28" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect width="18" height="10" x="3" y="11" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    {/* Left Eye */}
    <line x1="8" y1="16" x2="8.01" y2="16" />
    {/* Right Eye - Animated Wink */}
    <motion.path
      initial={false}
      animate={isHovered ? { d: "M14.5 16h3" } : { d: "M16 16l0.01 0" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    />
  </svg>
);

// --- Main Component ---

const BotCompanion: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [tooltipText, setTooltipText] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasPlayedAnimation = useRef(false);

  // Scroll listener to hide tooltip
  useEffect(() => {
    const handleScroll = () => {
      if (showTooltip && !isHovered) setShowTooltip(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showTooltip, isHovered]);

  // Initial Auto-Show Animation for Tooltip
  useEffect(() => {
    if (isOpen || hasPlayedAnimation.current) {
      if (isOpen) setShowTooltip(false);
      return;
    }

    let isCancelled = false;

    const runTooltipSequence = async () => {
      await new Promise(r => setTimeout(r, 2500));
      if (isCancelled || isOpen || hasPlayedAnimation.current) return;

      hasPlayedAnimation.current = true;
      if (!isHovered) setShowTooltip(true);
      const text = "Click me !!!";
      setTooltipText("");
      
      for (let i = 0; i <= text.length; i++) {
        if (isCancelled || isOpen) {
            setShowTooltip(false);
            return;
        }
        setTooltipText(text.slice(0, i));
        await new Promise(r => setTimeout(r, 100));
      }
    };

    runTooltipSequence();
    return () => { isCancelled = true; };
  }, [isOpen, isHovered]);

  // Typing effect for Welcome Message
  useEffect(() => {
    if (isOpen && welcomeMessage === "") {
      const fullText = "Hi there, this is your Fintech companion. Ask away ...";
      let i = 0;
      const interval = setInterval(() => {
        setWelcomeMessage(fullText.slice(0, i + 1));
        i++;
        if (i === fullText.length) clearInterval(interval);
      }, 40);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, welcomeMessage]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text: text };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Include the welcome message context if needed, but usually user history is enough
      const history = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...history, { role: 'user', parts: [{ text }] }],
        config: {
          systemInstruction: "You are 'FinBot', a highly intelligent AI assistant for CA Sriharri's portfolio. You are knowledgeable about Finance, Taxation, Audit, and AI Technology. Your tone is professional yet futuristic and engaging. Keep answers concise.",
        }
      });

      const botText = response.text || "I apologize, I couldn't process that request right now.";
      setMessages(prev => [...prev, { role: 'model', text: botText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "System Error: Connection interrupted. Please retry." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* --- Trigger Button (Top Left) --- */}
      <motion.div
        className="fixed top-6 left-6 z-50"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        onMouseEnter={() => {
          setIsHovered(true);
          if (!isOpen) {
            setTooltipText("Click me !!!");
            setShowTooltip(true);
          }
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowTooltip(false);
        }}
      >
        <AnimatePresence>
            {!isOpen && showTooltip && (
                <motion.div 
                  initial={{ opacity: 0, x: 20, scale: 0.5 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="absolute left-16 top-2 w-48 pointer-events-none z-50"
                >
                  <div className="relative">
                      <div className="absolute top-4 -left-1.5 w-3 h-3 bg-white dark:bg-surface-darkVariant border-l border-b border-gray-200 dark:border-white/10 transform rotate-45 shadow-sm"></div>
                      <div className="relative bg-white/90 dark:bg-surface-darkVariant/90 backdrop-blur-md border border-gray-200 dark:border-white/10 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2">
                          <p className="text-sm font-bold text-gray-800 dark:text-white font-mono">{tooltipText}</p>
                          <motion.span 
                            animate={{ opacity: [0, 1, 0] }} 
                            transition={{ repeat: Infinity, duration: 0.8 }} 
                            className="w-2 h-4 bg-primary-500 block"
                          />
                      </div>
                  </div>
                </motion.div>
            )}
        </AnimatePresence>

        <motion.button
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.8, rotate: -10 }}
            animate={{ 
              y: [0, -6, 0],
              boxShadow: isOpen 
                ? "0px 10px 30px -5px rgba(99, 102, 241, 0.6)" 
                : "0px 5px 15px -5px rgba(0, 0, 0, 0.1)"
            }}
            transition={{ 
              y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
              default: { type: "spring", stiffness: 400, damping: 17 }
            }}
            className={`
              relative w-14 h-14 flex items-center justify-center rounded-full backdrop-blur-xl border border-white/20 transition-colors
              ${isOpen 
                ? 'bg-gradient-to-tr from-primary-600 to-purple-600 text-white' 
                : 'bg-white/40 dark:bg-surface-darkVariant/40 text-primary-600 dark:text-white hover:bg-white/60'
              }
            `}
            aria-label="Toggle Chatbot"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X size={26} strokeWidth={2.5} />
              </motion.div>
            ) : (
              <motion.div key="open" className="relative z-10" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <WinkingBot isHovered={isHovered} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* --- Main Chat Interface --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 100, scale: 0.95, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-24 left-6 md:left-24 w-[90vw] md:w-[420px] h-[600px] max-h-[80vh] z-50 flex flex-col overflow-hidden rounded-[2rem] bg-[#0a0a0a]/95 dark:bg-[#050505]/95 backdrop-blur-2xl border border-white/10 shadow-2xl origin-top-left"
          >
            {/* Background Decor */}
            <CircuitPattern />
            <FloatingTechIcon icon={Binary} delay={0} x="top-20" y="left-10" />
            <FloatingTechIcon icon={Cpu} delay={2} x="bottom-40" y="right-10" />
            <FloatingTechIcon icon={Zap} delay={4} x="top-1/2" y="right-1/4" />

            {/* Header: HUD Style */}
            <div className="relative z-10 bg-white/5 border-b border-white/5 p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="relative w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-black border border-white/10 shadow-inner">
                    <Sparkles className="text-primary-400 animate-pulse" size={20} />
                    {/* Rotating Ring */}
                    <motion.div 
                       className="absolute inset-0 border border-dashed border-primary-500/30 rounded-xl"
                       animate={{ rotate: 360 }}
                       transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    />
                 </div>
                 <div>
                    <h3 className="text-white font-heading font-bold tracking-wide text-lg flex items-center gap-2">
                       Fintech AI
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                       <span className="text-xs text-gray-400 font-mono tracking-wider">ONLINE</span>
                    </div>
                 </div>
              </div>
              <AudioVisualizer />
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-none relative z-10">
               
               {/* Welcome Message */}
               <motion.div
                 initial={{ opacity: 0, y: 10, scale: 0.95 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 className="flex justify-start"
               >
                  <div className="max-w-[85%] relative group text-left">
                     <div className="absolute -left-8 top-0">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center">
                           <Terminal size={12} className="text-primary-400" />
                        </div>
                     </div>
                     <div className="inline-block px-5 py-3 rounded-2xl text-sm leading-relaxed backdrop-blur-md bg-white/10 border border-white/10 text-gray-200 rounded-tl-sm font-mono shadow-md">
                        {welcomeMessage}
                        <motion.span 
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ repeat: Infinity, duration: 0.8 }}
                          className="inline-block w-2 h-4 bg-primary-500 ml-1 align-middle"
                        />
                     </div>
                  </div>
               </motion.div>

               {/* Interaction Suggestions (Only show when no messages exchanged) */}
               {messages.length === 0 && welcomeMessage.length > 20 && (
                  <div className="flex flex-col gap-2 w-full max-w-[280px] ml-auto mr-auto mt-4">
                        {SUGGESTED_QUESTIONS.map((q, i) => (
                           <motion.button
                              key={i}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: i * 0.1 }}
                              onClick={() => handleSend(q)}
                              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
                              className="group flex items-center justify-between px-4 py-3 rounded-lg bg-white/5 border border-white/5 hover:border-primary-500/50 text-left transition-all"
                           >
                              <span className="text-xs text-gray-300 group-hover:text-white font-medium">{q}</span>
                              <ChevronRight size={14} className="text-gray-600 group-hover:text-primary-400" />
                           </motion.button>
                        ))}
                  </div>
               )}

               {messages.map((msg, i) => (
                  <motion.div
                     key={i}
                     initial={{ opacity: 0, y: 10, scale: 0.95 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                     <div className={`max-w-[85%] relative group ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                        {msg.role === 'model' && (
                           <div className="absolute -left-8 top-0">
                              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center">
                                 <Terminal size={12} className="text-primary-400" />
                              </div>
                           </div>
                        )}
                        
                        <div className={`
                           inline-block px-5 py-3 rounded-2xl text-sm leading-relaxed backdrop-blur-md
                           ${msg.role === 'user' 
                              ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-tr-sm shadow-lg shadow-primary-900/20' 
                              : 'bg-white/10 border border-white/10 text-gray-200 rounded-tl-sm font-mono'
                           }
                        `}>
                           {msg.text}
                        </div>
                     </div>
                  </motion.div>
               ))}
               
               {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start pl-8">
                     <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
                        <Loader2 size={14} className="animate-spin text-primary-400" />
                        <span className="text-xs text-gray-400 font-mono animate-pulse">PROCESSING_DATA...</span>
                     </div>
                  </motion.div>
               )}
               <div ref={messagesEndRef} />
            </div>

            {/* Input Area: Command Line Style */}
            <div className="relative z-20 p-4 bg-black/40 border-t border-white/5 backdrop-blur-md">
               <form 
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="relative group"
               >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none" />
                  
                  <div className="relative flex items-center bg-[#1a1a1a] rounded-xl border border-white/10 focus-within:border-primary-500/50 transition-colors overflow-hidden">
                     <div className="pl-3 pr-2 text-gray-500">
                        <ChevronRight size={18} />
                     </div>
                     <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter command..."
                        className="flex-1 bg-transparent py-4 text-sm text-white placeholder-gray-600 focus:outline-none font-mono"
                     />
                     <motion.button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="mr-2 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                     >
                        <Send size={16} />
                     </motion.button>
                  </div>
               </form>
               <div className="flex justify-between mt-2 px-1">
                  <span className="text-[10px] text-gray-600 font-mono">SECURE_CONNECTION: ENCRYPTED</span>
                  <span className="text-[10px] text-gray-600 font-mono">LATENCY: 12ms</span>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BotCompanion;