import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useVelocity, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Mail, Phone, Building2, Linkedin, Github, Instagram, ArrowDown, ExternalLink, Sparkles, PieChart, Zap, Binary, Terminal, LineChart, Coins, Database, ScanFace, Activity, Wifi, Cpu, Code2 } from 'lucide-react';
import ThemeToggle from './components/ThemeToggle';
import ProductsDropdown from './components/ProductsDropdown';
import Header from './components/Header';
import ProjectCard from './components/ProjectCard';
import BotCompanion from './components/BotCompanion';
import { PERSONAL_INFO, PROJECTS, CONTACT_INFO, SOCIAL_LINKS } from './constants';
import { smoothScrollTo } from './utils';

// --- Magnetic Button Component ---
const MagneticButton = ({ children, className, onClick }: { children?: React.ReactNode, className?: string, onClick?: () => void }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 };
    const center = { x: left + width / 2, y: top + height / 2 };
    const distance = { x: clientX - center.x, y: clientY - center.y };
    
    x.set(distance.x * 0.15);
    y.set(distance.y * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.button>
  );
};

// --- Tech Decorative Components ---
const Barcode = ({ className }: { className?: string }) => (
  <div className={`flex items-end gap-[2px] h-6 opacity-30 select-none pointer-events-none ${className}`}>
    {[...Array(15)].map((_, i) => (
      <motion.div
        key={i}
        animate={{ height: [4, 24, 8, 16, 4] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
        className="w-[2px] bg-current"
      />
    ))}
  </div>
);

const Crosshair = ({ className }: { className?: string }) => (
  <motion.div 
    animate={{ rotate: 360 }}
    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    className={`opacity-20 pointer-events-none ${className}`}
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="12" cy="12" r="10" strokeDasharray="4 4" />
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
    </svg>
  </motion.div>
);

const TechTicker = () => (
  <div className="flex flex-col gap-1 text-[9px] font-mono text-primary-500/50 select-none pointer-events-none uppercase tracking-widest">
     <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 3, repeat: Infinity }}>
        :: 01011001 PROCESSING DATA ::
     </motion.div>
     <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }}>
        :: ENCRYPTION: SHA-256 ::
     </motion.div>
     <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}>
        :: MEMORY: 64TB ALLOCATED ::
     </motion.div>
  </div>
);

const StatusBadge = () => (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-sm shadow-sm">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
        </span>
        <span className="text-[9px] font-mono font-bold tracking-widest text-gray-500 dark:text-gray-400">NET.OPTIMAL</span>
    </div>
);

// --- New Glassmorphic Glitch Text Component ---
const GlassyGlitchText = ({ text, className, highlight = false }: { text: string, className?: string, highlight?: boolean }) => {
    const [glitch, setGlitch] = useState(false);

    useEffect(() => {
      const loop = () => {
        // Random delay between 6s and 8s
        const nextDelay = Math.random() * 2000 + 6000; 
        setTimeout(() => {
          setGlitch(true);
          // Glitch duration 60ms - 100ms
          setTimeout(() => {
              setGlitch(false);
              loop();
          }, Math.random() * 40 + 60); 
        }, nextDelay);
      };
      loop();
    }, []);

    const words = text.split(" ");

    return (
        <span className={`relative inline-block group ${className}`}>
             <span className="sr-only">{text}</span>
             {/* Render Text */}
             <span 
                className={`
                    relative z-10 block transition-transform duration-75
                    ${glitch ? 'skew-x-12 translate-x-1 scale-[1.01]' : ''}
                `}
             >
                {words.map((word, wIdx) => (
                    <span key={wIdx} className="inline-block whitespace-nowrap">
                        {word.split("").map((char, cIdx) => {
                            // Tech Accents on specific letters
                            const isTechChar = ['A', 'F', 'I', 'E', 'B'].includes(char);
                            return (
                                <span key={cIdx} className="relative inline-block">
                                    <span 
                                        className={`
                                            bg-clip-text text-transparent
                                            ${highlight 
                                                ? 'bg-gradient-to-b from-primary-400 via-purple-400 to-primary-600' 
                                                : 'bg-gradient-to-b from-gray-800 via-gray-500 to-gray-900 dark:from-white dark:via-white/50 dark:to-white/80'
                                            }
                                        `}
                                        style={{
                                            // Glass/Etch Effect
                                            WebkitTextStroke: highlight ? '1px rgba(168, 85, 247, 0.3)' : '1px rgba(128,128,128,0.2)',
                                            filter: highlight ? 'drop-shadow(0 0 15px rgba(168, 85, 247, 0.4))' : 'drop-shadow(0 0 10px rgba(255,255,255,0.15))'
                                        }}
                                    >
                                        {char}
                                    </span>
                                    
                                    {/* Tech Visual Decorations */}
                                    {isTechChar && !glitch && (
                                        <>
                                            <span className="absolute -top-[2px] right-0 w-[2px] h-[2px] bg-primary-500/50 rounded-full opacity-60" />
                                            {char === 'F' && <span className="absolute bottom-1 left-0 w-full h-[1px] bg-current opacity-20" />}
                                        </>
                                    )}
                                </span>
                            );
                        })}
                        {wIdx < words.length - 1 && <span className="inline-block w-[0.2em]">&nbsp;</span>}
                    </span>
                ))}
             </span>

             {/* Glitch Layers (Red/Cyan Split) */}
             {glitch && (
                <>
                    <span 
                        className={`absolute top-0 left-0 z-0 text-red-500/40 mix-blend-screen animate-pulse translate-x-[3px] select-none pointer-events-none`}
                        aria-hidden="true"
                    >
                        {text}
                    </span>
                    <span 
                        className={`absolute top-0 left-0 z-0 text-cyan-500/40 mix-blend-screen animate-pulse -translate-x-[3px] select-none pointer-events-none`}
                        aria-hidden="true"
                    >
                        {text}
                    </span>
                </>
             )}
        </span>
    );
};

// --- Sticky Header with Physics ---
const StickySectionHeader = ({ title, subtitle }: { title: string | React.ReactNode, subtitle?: string }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });
    
    const scale = useTransform(scrollYProgress, [0.1, 0.2, 0.9, 1], [0.95, 1, 1, 0.95]);
    const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

    return (
        <motion.div 
            ref={ref}
            style={{ scale, opacity }}
            className="sticky top-24 z-30 py-4 md:py-6 -mx-4 px-4 md:-mx-6 md:px-6 bg-white/70 dark:bg-black/60 backdrop-blur-xl rounded-2xl border-b border-white/20 dark:border-white/5 shadow-sm transition-all mb-8 flex justify-between items-end"
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
                <div>
                     {subtitle && (
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-8 h-1 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full"></span>
                            <span className="text-gray-500 dark:text-gray-400 font-bold tracking-[0.2em] uppercase text-xs">{subtitle}</span>
                        </div>
                     )}
                     <h2 className="font-heading text-4xl md:text-5xl font-black dark:text-white leading-tight">
                        {typeof title === 'string' ? title : title}
                     </h2>
                </div>
            </div>
            {/* Tech Decoration in Header */}
            <div className="hidden md:block opacity-50">
               <Crosshair className="text-gray-400 dark:text-gray-600 w-8 h-8" />
            </div>
        </motion.div>
    );
};

const BackgroundDecorations = () => {
  const { scrollY } = useScroll();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    // Optimized: Only attach listener on desktop if needed, or keep lightweight
    const handleMove = (e: MouseEvent) => {
        if (window.innerWidth > 768) {
             mouseX.set(e.clientX);
             mouseY.set(e.clientY);
        }
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mouseX, mouseY]);

  const blob1X = useSpring(useTransform(mouseX, [0, window.innerWidth], [0, 50]), { stiffness: 50, damping: 20 });
  const blob1Y = useSpring(useTransform(mouseY, [0, window.innerHeight], [0, 50]), { stiffness: 50, damping: 20 });

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern text-gray-200/20 dark:text-gray-800/20 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
      
      {/* Interactive Blobs - Added will-change-transform for performance */}
      <motion.div 
        style={{ x: blob1X, y: blob1Y }}
        className="absolute top-0 -left-20 w-[500px] h-[500px] bg-purple-500/20 rounded-full mix-blend-multiply filter blur-[80px] md:blur-[100px] opacity-40 animate-blob will-change-transform transform-gpu" 
      />
      <motion.div 
        animate={{ 
            x: [0, 50, 0], 
            y: [0, -50, 0],
            scale: [1, 1.1, 1] 
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 -right-20 w-[600px] h-[600px] bg-blue-500/20 rounded-full mix-blend-multiply filter blur-[80px] md:blur-[100px] opacity-40 will-change-transform transform-gpu" 
      />
      
      {/* Floating Icons */}
      {[PieChart, Binary, Coins, Database, LineChart, Terminal].map((Icon, i) => (
        <motion.div 
          key={i}
          animate={{ 
            y: [0, -30, 0], 
            rotate: [0, 10, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 8 + i, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: i * 2 
          }}
          className={`absolute text-gray-300 dark:text-white/5 will-change-transform`}
          style={{
            top: `${15 + (i * 15)}%`,
            left: `${i % 2 === 0 ? 10 + (i * 5) : 80 - (i * 5)}%`
          }}
        >
          <Icon size={40 + (i * 5)} strokeWidth={1} />
        </motion.div>
      ))}

      {/* Floating Tech Elements Background */}
      <div className="absolute top-1/4 left-10 hidden lg:block opacity-30">
        <Crosshair className="text-primary-300 dark:text-primary-800 w-16 h-16" />
      </div>
      <div className="absolute bottom-1/4 right-10 hidden lg:block opacity-30">
        <Crosshair className="text-purple-300 dark:text-purple-800 w-24 h-24" />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  // Hero Card Tilt Effect
  const heroRef = useRef<HTMLDivElement>(null);
  const hX = useMotionValue(0);
  const hY = useMotionValue(0);
  const hRotateX = useSpring(useTransform(hY, [-0.5, 0.5], [5, -5]), { stiffness: 100, damping: 20 });
  const hRotateY = useSpring(useTransform(hX, [-0.5, 0.5], [-5, 5]), { stiffness: 100, damping: 20 });

  const handleHeroMove = (e: React.MouseEvent<HTMLDivElement>) => {
      // Disable tilt on mobile/touch devices for performance
      if(window.innerWidth < 768 || !heroRef.current) return;
      
      const rect = heroRef.current.getBoundingClientRect();
      const xPct = (e.clientX - rect.left) / rect.width - 0.5;
      const yPct = (e.clientY - rect.top) / rect.height - 0.5;
      hX.set(xPct);
      hY.set(yPct);
  };
  const handleHeroLeave = () => { hX.set(0); hY.set(0); };

  // Synchronized color animation values (Removed Teal)
  const auroraColors = [
    "rgba(99, 102, 241, 0.5)", // Indigo
    "rgba(168, 85, 247, 0.5)", // Purple
    "rgba(99, 102, 241, 0.5)"  // Back to Indigo
  ];
  
  const textGlowColors = [
    "#6366f1", // Indigo
    "#a855f7", // Purple
    "#6366f1"  // Back to Indigo
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden transition-colors duration-700 font-sans selection:bg-primary-500/30">
      <Header />
      <div className="flex items-center">
        <ProductsDropdown />
        <ThemeToggle />
      </div>
      <BotCompanion />
      <BackgroundDecorations />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:px-12 lg:py-20 flex flex-col gap-16">
        
        {/* 1. HERO SECTION - REDESIGNED TYPOGRAPHY & REDUCED SPACING */}
        <motion.section 
          id="home"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="flex flex-col justify-center items-center relative pt-20 md:pt-10 pb-2"
        >
          {/* Tech Decor: Left Side Barcode */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="absolute left-0 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-8 items-center"
          >
             <div className="h-32 w-[1px] bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
             <div className="-rotate-90 text-[10px] font-mono tracking-[0.3em] text-gray-400">SCROLL_DYN</div>
             <Barcode className="rotate-90 text-gray-400 dark:text-gray-600" />
          </motion.div>

          {/* Main Hero Card Container */}
          <motion.div
            ref={heroRef}
            onMouseMove={handleHeroMove}
            onMouseLeave={handleHeroLeave}
            style={{ 
                rotateX: typeof window !== 'undefined' && window.innerWidth > 768 ? hRotateX : 0, 
                rotateY: typeof window !== 'undefined' && window.innerWidth > 768 ? hRotateY : 0, 
                transformStyle: "preserve-3d" 
            }}
            variants={{ hidden: { y: 100, opacity: 0, scale: 0.9 }, visible: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 60, damping: 20 } } }}
            className="relative w-full max-w-6xl mx-auto group perspective-1000"
          >
             {/* Tech Decor: Floating Corner Brackets */}
             <div className="absolute -top-10 -left-10 w-20 h-20 border-t border-l border-gray-300 dark:border-white/20 rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none hidden md:block" />
             <div className="absolute -bottom-10 -right-10 w-20 h-20 border-b border-r border-gray-300 dark:border-white/20 rounded-br-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none hidden md:block" />

             {/* Aurora Background Glow */}
             <motion.div 
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] -z-50 pointer-events-none rounded-full blur-[60px] md:blur-[100px] transform-gpu will-change-transform"
               animate={{ 
                  backgroundColor: auroraColors,
                  rotate: [0, 360],
                  scale: [0.9, 1.1, 0.9]
               }}
               transition={{ 
                  backgroundColor: { duration: 8, repeat: Infinity, ease: "linear" },
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
               }}
             />

             {/* The Monolith Card - TAGLINE VERSION */}
             <div className="relative bg-white/40 dark:bg-black/40 backdrop-blur-3xl rounded-[3rem] border border-white/40 dark:border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] dark:shadow-black/50 overflow-hidden">
                
                {/* Noise Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
                
                <div className="relative z-10 px-4 py-12 md:px-12 md:py-16 flex flex-col items-center text-center">
                    
                    {/* Updated Tagline Typography with Glassy Glitch Tech */}
                    <motion.div
                        variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
                        className="flex flex-col items-center gap-2 md:gap-4 mb-6 w-full max-w-5xl"
                    >
                        {/* Line 1 */}
                        <div className="relative font-heading font-black text-3xl sm:text-5xl md:text-6xl tracking-tight leading-[1.2]">
                           <Glass