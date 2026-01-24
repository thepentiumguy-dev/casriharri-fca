import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useVelocity, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Mail, Phone, Building2, Linkedin, Github, Instagram, ArrowDown, ExternalLink, Sparkles, PieChart, Zap, Binary, Terminal, LineChart, Coins, Database, ScanFace, Activity, Wifi, Cpu } from 'lucide-react';
import ThemeToggle from './components/ThemeToggle';
import Header from './components/Header';
import ProjectCard from './components/ProjectCard';
import BotCompanion from './components/BotCompanion';
import { PERSONAL_INFO, PROJECTS, CONTACT_INFO, SOCIAL_LINKS } from './constants';

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
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

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
      <ThemeToggle />
      <BotCompanion />
      <BackgroundDecorations />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:px-12 lg:py-20 flex flex-col gap-32">
        
        {/* 1. HERO SECTION - REDESIGNED: MODERN MONOLITH */}
        <motion.section 
          id="profile"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="flex flex-col justify-center items-center min-h-[85vh] relative pt-32 md:pt-0"
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
            className="relative w-full max-w-5xl mx-auto group perspective-1000"
          >
             {/* Tech Decor: Floating Corner Brackets */}
             <div className="absolute -top-10 -left-10 w-20 h-20 border-t border-l border-gray-300 dark:border-white/20 rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none hidden md:block" />
             <div className="absolute -bottom-10 -right-10 w-20 h-20 border-b border-r border-gray-300 dark:border-white/20 rounded-br-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none hidden md:block" />

             {/* 
                Aurora Background Glow - OPTIMIZED FOR MOBILE
             */}
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

             {/* The Monolith Card */}
             <div className="relative bg-white/40 dark:bg-black/40 backdrop-blur-3xl rounded-[3rem] border border-white/40 dark:border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] dark:shadow-black/50 overflow-hidden">
                
                {/* Noise Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
                
                <div className="relative z-10 px-8 py-16 md:px-16 md:py-24 flex flex-col items-center text-center">
                    
                    {/* Top Tech Badge */}
                    <motion.div 
                        variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }}
                        className="mb-8 flex items-center gap-3 px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/10 backdrop-blur-md"
                    >
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] md:text-xs font-mono font-bold tracking-[0.2em] text-gray-600 dark:text-gray-300 uppercase">
                            System Online
                        </span>
                    </motion.div>

                    {/* Main Massive Name Typography with Synchronized Glow */}
                    <div className="relative mb-6 group">
                        {/* 1. Behind Glow Layer */}
                        <motion.h1 
                            variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 0.9, scale: 1 } }}
                            className="absolute inset-0 font-heading font-black text-6xl sm:text-7xl md:text-9xl leading-[0.9] tracking-tighter select-none pointer-events-none blur-3xl z-0 transform-gpu"
                            animate={{ color: textGlowColors }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        >
                            <span className="block">CA SRIHARRI</span>
                        </motion.h1>

                        {/* 2. Middle Layer: Sharp Text */}
                        <motion.h1 
                            variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
                            className="relative font-heading font-black text-6xl sm:text-7xl md:text-9xl leading-[0.9] tracking-tighter z-10"
                        >
                             <span className="block text-transparent bg-clip-text bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white drop-shadow-xl">
                                CA SRIHARRI
                             </span>
                        </motion.h1>
                        
                        {/* Decorative 'FCA' Badge */}
                        <motion.div 
                            variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                            className="static md:absolute md:-right-8 md:top-2 mt-4 md:mt-0 inline-flex z-20"
                        >
                            <span className="px-3 py-1 bg-gradient-to-r from-primary-600 to-purple-600 text-white text-xs md:text-sm font-bold rounded-lg shadow-lg rotate-3 md:rotate-12 border border-white/20">
                                FCA
                            </span>
                        </motion.div>
                    </div>

                    {/* Split Line */}
                    <motion.div 
                        variants={{ hidden: { width: 0 }, visible: { width: "100px" } }}
                        className="h-1 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full mb-8"
                    />

                    {/* Roles / Subtitle */}
                    <motion.div 
                        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                        className="flex flex-col md:flex-row items-center gap-3 md:gap-8 mb-12"
                    >
                        <div className="text-lg md:text-2xl font-medium text-gray-600 dark:text-gray-300 tracking-wide">
                            FinTech Chartered Accountant
                        </div>
                        <span className="hidden md:block text-gray-300 dark:text-gray-600 text-2xl">/</span>
                        <div className="flex items-center gap-2 text-lg md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400">
                           <Terminal size={24} className="text-primary-500" />
                           AI App Developer
                        </div>
                    </motion.div>

                    {/* Artistic Quote */}
                    <motion.p 
                        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                        className="max-w-xl mx-auto text-gray-500 dark:text-gray-400 text-sm md:text-base font-medium leading-relaxed"
                    >
                        "Blending the precision of <span className="text-gray-900 dark:text-white font-bold">Audit</span> with the infinite scale of <span className="text-gray-900 dark:text-white font-bold">Automation</span>."
                    </motion.p>

                    {/* Tech Aesthetic Footer inside Card */}
                    <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end opacity-30 pointer-events-none hidden md:flex">
                        <ScanFace size={32} strokeWidth={1} />
                        <Barcode className="text-gray-500 dark:text-gray-400" />
                    </div>
                </div>
             </div>
          </motion.div>

          {/* Magnetic Actions - Positioned below the monolith */}
          <motion.div 
            variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
            className="flex flex-wrap justify-center gap-6 mt-16 relative z-10"
          >
            <MagneticButton 
              onClick={() => scrollToSection('works')}
              className="group relative px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold text-lg overflow-hidden shadow-2xl hover:shadow-primary-500/40 transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 flex items-center gap-3">
                Explore AI Tools <ArrowDown size={20} className="group-hover:translate-y-1 transition-transform" />
              </span>
            </MagneticButton>
            
            <MagneticButton 
              onClick={() => scrollToSection('contact')}
              className="px-8 py-4 bg-white/40 dark:bg-white/5 backdrop-blur-lg border border-white/40 dark:border-white/10 text-gray-900 dark:text-white rounded-2xl font-bold text-lg hover:bg-white/60 dark:hover:bg-white/10 transition-all shadow-lg hover:shadow-xl"
            >
              Reach Out
            </MagneticButton>
          </motion.div>
        </motion.section>

        {/* 2. ABOUT SECTION */}
        <section id="about" className="relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-5 relative sticky top-36 z-10">
              <motion.div 
                whileHover={{ rotate: 2, scale: 1.02 }}
                className="relative bg-white/70 dark:bg-surface-darkVariant/60 backdrop-blur-2xl border border-white/40 dark:border-white/10 p-10 rounded-[2.5rem] shadow-2xl overflow-hidden group"
              >
                 {/* Tech Decor: CPU Badge */}
                 <div className="absolute top-6 right-6 opacity-30">
                    <Cpu size={32} strokeWidth={1} />
                 </div>

                 <div className="flex items-center gap-5 mb-8">
                   <div className="p-5 bg-primary-100/50 dark:bg-primary-900/30 rounded-2xl text-primary-600 dark:text-primary-300 shadow-inner">
                     <Building2 size={36} />
                   </div>
                   <div>
                     <h3 className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold mb-1">Base of Operations</h3>
                     <p className="text-2xl font-heading font-bold dark:text-white">{PERSONAL_INFO.organization}</p>
                   </div>
                 </div>
                 
                 <div className="flex flex-wrap gap-3">
                    {['Automator', 'FinTech', 'Developer'].map((tag) => (
                      <span key={tag} className="px-4 py-2 rounded-full bg-white dark:bg-white/10 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/5 shadow-sm">
                        {tag}
                      </span>
                    ))}
                 </div>
                 
                 <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5">
                    <TechTicker />
                 </div>
              </motion.div>
            </div>
            
            <div className="md:col-span-7">
              <StickySectionHeader 
                title={
                    <span>Decoding <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-purple-500">Finance</span> with Code</span>
                } 
                subtitle="About Me"
              />
              
              <div className="space-y-8 text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-medium px-4 relative">
                {/* Tech Decor: Margin line */}
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-gray-200 dark:from-gray-800 to-transparent"></div>

                <p>Spreadsheets are great, but <span className="text-primary-600 dark:text-primary-400 font-bold bg-primary-100 dark:bg-primary-900/30 px-2 py-0.5 rounded-md">intelligent systems</span> are better.</p>
                <p>{PERSONAL_INFO.bio}</p>
                <p>I bridge the gap between regulatory complexity and software simplicity, building tools that don't just calculate—they think.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. WORKS SECTION */}
        <section id="works" className="relative">
          <div className="flex justify-between items-end mb-8">
             <StickySectionHeader 
                title={<span>AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-purple-500">Fintech</span> Tools</span>}
                subtitle="Portfolio"
             />
             <div className="hidden md:block mb-8">
                 <StatusBadge />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        {/* 4. CONTACT SECTION */}
        <section id="contact" className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-10">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            viewport={{ once: true }}
            className="bg-white/80 dark:bg-surface-darkVariant/60 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-[3rem] p-10 md:p-14 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-primary-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 group-hover:scale-110 transition-transform duration-1000"></div>
            
            {/* Tech Decor: Signal Icon */}
            <div className="absolute top-10 right-10">
                <Wifi size={24} className="text-gray-400 opacity-30" />
            </div>

            <h2 className="font-heading text-4xl md:text-5xl font-bold dark:text-white mb-6 relative z-10">Let's Talk Numbers & Nodes</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-12 text-lg relative z-10 font-medium">
              Got a complex financial problem that needs a coded solution? Or just want to geek out over tax laws?
            </p>

            <div className="space-y-6 relative z-10">
              {[
                { icon: Phone, label: "Call Line", value: CONTACT_INFO.phone, href: `tel:${CONTACT_INFO.phone}` },
                { icon: Mail, label: "Digital Mail", value: CONTACT_INFO.email, href: `mailto:${CONTACT_INFO.email}` },
                { icon: Building2, label: "HQ", value: CONTACT_INFO.organization, href: null }
              ].map((item, idx) => (
                <motion.a 
                  key={idx} 
                  href={item.href || '#'} 
                  whileHover={{ scale: 1.02, x: 10 }}
                  className={`flex items-center gap-6 p-5 rounded-3xl transition-all duration-300 ${item.href ? 'hover:bg-white/60 dark:hover:bg-white/5 hover:shadow-lg cursor-pointer' : ''}`}
                >
                  <div className="p-4 rounded-2xl bg-white dark:bg-white/5 shadow-md text-gray-900 dark:text-white border border-gray-100 dark:border-white/5">
                    <item.icon size={26} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary-500 uppercase tracking-wider mb-1 opacity-80">{item.label}</p>
                    <p className="text-xl font-heading font-bold dark:text-white">{item.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          <div className="flex flex-col justify-between py-6">
             <div id="social" className="space-y-8">
               <StickySectionHeader title="Social Proof" subtitle="Connect" />
               
               <div className="flex flex-wrap gap-4">
                 {SOCIAL_LINKS.map((link, i) => (
                   <motion.a 
                    key={i} 
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -5, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative flex items-center gap-3 pl-6 pr-8 py-5 rounded-full bg-white/60 dark:bg-surface-darkVariant/60 border border-white/40 dark:border-white/10 hover:border-primary-500 dark:hover:border-primary-500 transition-colors shadow-lg overflow-hidden backdrop-blur-md"
                   >
                     {link.name === 'LinkedIn' && <Linkedin size={24} className="text-blue-600 dark:text-blue-400" />}
                     {link.name === 'GitHub' && <Github size={24} className="text-gray-900 dark:text-white" />}
                     {link.name === 'Instagram' && <Instagram size={24} className="text-pink-600 dark:text-pink-400" />}
                     <span className="font-bold text-gray-700 dark:text-gray-200 text-lg">{link.name}</span>
                     <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                   </motion.a>
                 ))}
               </div>
             </div>

             <div className="mt-20 lg:mt-0 p-8 rounded-[2rem] bg-gray-50/50 dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/10 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Activity size={48} />
                </div>
                <div className="flex flex-col gap-4 relative z-10">
                    <p className="text-gray-500 dark:text-gray-500 text-sm font-mono">
                      // Designed & Built with <br/>
                      <span className="text-primary-600 dark:text-primary-400 font-bold">Finance + Technology Passion</span>
                    </p>
                    <div className="w-full h-px bg-gray-200 dark:bg-white/10"></div>
                    <div className="flex justify-between items-end">
                      <p className="text-gray-400 dark:text-gray-600 text-xs uppercase tracking-widest font-bold">
                        © {new Date().getFullYear()} CA Sriharri
                      </p>
                      <Sparkles size={16} className="text-yellow-500 animate-pulse" />
                    </div>
                </div>
             </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default App;