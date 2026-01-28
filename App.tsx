import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useVelocity, useMotionValue, useMotionTemplate, AnimatePresence } from 'framer-motion';
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

// --- Glitch Component for Line 2 (TV Static Style) ---
const HeadlineGlitch = ({ children, active }: { children: React.ReactNode, active: boolean }) => {
  return (
    <span className="relative inline-block rounded-sm pb-3 md:pb-4 -mb-3 md:-mb-4"> {/* Added padding bottom to prevent clipping */}
      <motion.span
        animate={active ? {
          x: [0, -2, 2, -1, 1, 0],
          y: [0, 1, -1, 0],
          skewX: [0, 5, -5, 2, -2, 0],
          filter: [
            'none',
            'grayscale(100%) contrast(1.5)', 
            'grayscale(100%) contrast(1.2) brightness(1.2)',
            'none'
          ],
        } : {}}
        transition={{ 
            duration: 0.25,
            times: [0, 0.2, 0.4, 0.6, 0.8, 1] 
        }}
        className="relative z-10 block"
      >
        {children}
      </motion.span>
      
      {/* TV Static Noise Overlay - visible only when active */}
      <AnimatePresence>
        {active && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.25 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 pointer-events-none mix-blend-hard-light overflow-hidden rounded-sm"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
                    backgroundSize: '100px 100px'
                }}
            />
        )}
      </AnimatePresence>
    </span>
  );
};

// --- Sticky Header ---
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
            className="sticky top-24 z-30 py-4 md:py-6 -mx-4 px-4 md:-mx-6 md:px-6 bg-white/70 dark:bg-black/60 backdrop-blur-xl rounded-2xl border-b border-white/20 dark:border-white/5 shadow-sm transition-all mb-4 flex justify-between items-end"
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
            <div className="hidden md:block opacity-50">
               <Crosshair className="text-gray-400 dark:text-gray-600 w-8 h-8" />
            </div>
        </motion.div>
    );
};

const BackgroundDecorations = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
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
      <motion.div style={{ x: blob1X, y: blob1Y }} className="absolute top-0 -left-20 w-[500px] h-[500px] bg-purple-500/20 rounded-full mix-blend-multiply filter blur-[80px] md:blur-[100px] opacity-40 animate-blob will-change-transform transform-gpu" />
      <motion.div animate={{ x: [0, 50, 0], y: [0, -50, 0], scale: [1, 1.1, 1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute top-0 -right-20 w-[600px] h-[600px] bg-blue-500/20 rounded-full mix-blend-multiply filter blur-[80px] md:blur-[100px] opacity-40 will-change-transform transform-gpu" />
    </div>
  );
};

// Helper for Social Icons
const getSocialIcon = (id: string) => {
  switch (id) {
    case 'linkedin': return Linkedin;
    case 'github': return Github;
    case 'instagram': return Instagram;
    default: return ExternalLink;
  }
};

const getSocialStyle = (id: string) => {
  switch (id) {
    case 'linkedin': 
      return "text-[#0077b5]";
    case 'github': 
      return "text-gray-900 dark:text-white";
    case 'instagram': 
      return "text-[#E1306C]";
    default: 
      return "text-primary-600";
  }
};

const App: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [isGlitching, setIsGlitching] = useState(false);
  const hX = useMotionValue(0);
  const hY = useMotionValue(0);
  const hRotateX = useSpring(useTransform(hY, [-0.5, 0.5], [5, -5]), { stiffness: 100, damping: 20 });
  const hRotateY = useSpring(useTransform(hX, [-0.5, 0.5], [-5, 5]), { stiffness: 100, damping: 20 });

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 250); // Slightly longer glitch duration for static effect
    }, Math.random() * 2000 + 3000); 
    return () => clearInterval(interval);
  }, []);

  const handleHeroMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if(window.innerWidth < 768 || !heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const xPct = (e.clientX - rect.left) / rect.width - 0.5;
      const yPct = (e.clientY - rect.top) / rect.height - 0.5;
      hX.set(xPct);
      hY.set(yPct);
  };
  const handleHeroLeave = () => { hX.set(0); hY.set(0); };

  const auroraColors = ["rgba(99, 102, 241, 0.5)", "rgba(168, 85, 247, 0.5)", "rgba(99, 102, 241, 0.5)"];

  return (
    <div className="min-h-screen relative overflow-x-hidden transition-colors duration-700 font-sans selection:bg-primary-500/30">
      <Header />
      <div className="flex items-center">
        <ProductsDropdown />
        <ThemeToggle />
      </div>
      <BotCompanion />
      <BackgroundDecorations />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:px-12 lg:py-10 flex flex-col gap-10">
        
        {/* HERO SECTION */}
        <motion.section 
          id="home"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="flex flex-col justify-center items-center relative pt-24 md:pt-16 pb-4"
        >
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
             <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] -z-50 pointer-events-none rounded-full blur-[60px] md:blur-[100px] transform-gpu will-change-transform" animate={{ backgroundColor: auroraColors, rotate: [0, 360], scale: [0.9, 1.1, 0.9] }} transition={{ backgroundColor: { duration: 8, repeat: Infinity, ease: "linear" }, rotate: { duration: 20, repeat: Infinity, ease: "linear" }, scale: { duration: 10, repeat: Infinity, ease: "easeInOut" } }} />

             <div className="relative bg-white/40 dark:bg-black/40 backdrop-blur-3xl rounded-[3rem] border border-white/40 dark:border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] dark:shadow-black/50 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
                
                <div className="relative z-10 px-4 py-12 md:px-12 md:py-20 flex flex-col items-center text-center">
                    <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }} className="flex flex-col items-center gap-3 md:gap-4 mb-6 w-full max-w-5xl">
                        
                        {/* Line 1 (Profile < Line 1 < Line 2) */}
                        <div className="relative font-heading font-black text-2xl sm:text-4xl md:text-5xl tracking-tight leading-[1.2] text-gray-800 dark:text-gray-100">
                           Bridging Financial Intelligence
                        </div>

                        {/* Line 2 (Featured Line, One Line on Mobile, Glitching) */}
                        <div className="relative font-heading font-black text-[1.85rem] sm:text-6xl md:text-8xl tracking-tighter leading-[1.1] flex justify-center items-center gap-2 md:gap-4 whitespace-nowrap overflow-visible py-2">
                            <span className="text-gray-400 dark:text-gray-600 font-serif italic text-xl sm:text-4xl">&</span>
                            <HeadlineGlitch active={isGlitching}>
                              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-purple-500 to-primary-600 dark:from-primary-400 dark:via-purple-400 dark:to-primary-400">
                                Artificial Intelligence
                              </span>
                            </HeadlineGlitch>
                            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} className="inline-block w-1.5 h-7 sm:h-16 md:w-3 md:h-24 bg-primary-500 rounded-sm shadow-[0_0_15px_rgba(99,102,241,0.8)] ml-1" />
                        </div>
                    </motion.div>

                    <motion.p variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="max-w-xl mx-auto text-gray-600 dark:text-gray-300 text-sm md:text-lg font-medium leading-relaxed tracking-wide">
                        Fintech AI Tools developed for Professionals
                    </motion.p>
                </div>
             </div>
          </motion.div>

          <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="flex flex-wrap justify-center gap-3 md:gap-6 mt-10 relative z-10">
            <MagneticButton onClick={() => smoothScrollTo('works')} className="group relative px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl font-bold text-sm md:text-base overflow-hidden shadow-2xl hover:shadow-primary-500/40 transition-all">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 flex items-center gap-2">Explore AI Tools <ArrowDown size={14} className="group-hover:translate-y-1 transition-transform" /></span>
            </MagneticButton>
            <MagneticButton onClick={() => smoothScrollTo('contact')} className="px-6 py-3 bg-white/40 dark:bg-white/5 backdrop-blur-lg border border-white/40 dark:border-white/10 text-gray-900 dark:text-white rounded-xl font-bold text-sm md:text-base hover:bg-white/60 dark:hover:bg-white/10 transition-all shadow-lg hover:shadow-xl">
              Reach Out
            </MagneticButton>
          </motion.div>
        </motion.section>

        {/* PROFILE SECTION - Hierarchy: Reverted CA Sriharri to be Large */}
        <section id="profile" className="relative pt-6">
            <StickySectionHeader title="Profile" subtitle="Identity" />

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col items-center justify-center pb-12 text-center">
                 <div className="relative mb-4 group w-fit mx-auto">
                      {/* Name Text (Large size restored) */}
                      <h2 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl leading-tight tracking-tighter whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white">
                          CA SRIHARRI
                      </h2>
                      <div className="absolute -right-3 -top-1 md:-right-6 md:top-0 rotate-12 z-20">
                          <span className="px-1.5 py-0.5 md:px-2 md:py-1 bg-gradient-to-r from-primary-600 to-purple-600 text-white text-[8px] md:text-xs font-bold rounded-lg shadow-lg border border-white/20">FCA</span>
                      </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                      <div className="text-xs md:text-lg font-medium text-gray-600 dark:text-gray-300 tracking-wide">FinTech Chartered Accountant</div>
                      <span className="hidden md:block text-gray-300 dark:text-gray-600 text-base">/</span>
                      <div className="flex items-center gap-2 text-xs md:text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400">
                          <Terminal size={14} className="text-primary-500" /> AI App Developer
                      </div>
                  </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
                <div className="md:col-span-5 relative z-10">
                  <motion.div whileHover={{ rotate: 1, scale: 1.01 }} className="relative bg-white/70 dark:bg-surface-darkVariant/60 backdrop-blur-2xl border border-white/40 dark:border-white/10 p-8 rounded-[2rem] shadow-xl overflow-hidden group">
                     <div className="absolute top-4 right-4 opacity-30"><Cpu size={24} strokeWidth={1} /></div>
                     <div className="flex items-center gap-4 mb-4">
                       <div className="p-3 bg-primary-100/50 dark:bg-primary-900/30 rounded-xl text-primary-600 dark:text-primary-300 shadow-inner"><Building2 size={24} /></div>
                       <div>
                         <h3 className="text-[8px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold mb-0.5">Base of Operations</h3>
                         <p className="text-lg font-heading font-bold dark:text-white">{PERSONAL_INFO.organization}</p>
                       </div>
                     </div>
                     <div className="flex flex-wrap gap-1.5">
                        {['Automator', 'FinTech', 'Developer'].map((tag) => (
                          <span key={tag} className="px-2 py-1 rounded-full bg-white dark:bg-white/10 text-[8px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/5 shadow-sm">{tag}</span>
                        ))}
                     </div>
                     <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/5"><TechTicker /></div>
                  </motion.div>
                </div>
                
                <div className="md:col-span-7">
                  <div className="space-y-6 text-sm md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-medium px-4 relative border-l border-gray-200 dark:border-gray-800">
                    <p>Spreadsheets are great, but <span className="text-primary-600 dark:text-primary-400 font-bold bg-primary-100 dark:bg-primary-900/30 px-2 py-0.5 rounded-md">intelligent systems</span> are better.</p>
                    <p>{PERSONAL_INFO.bio}</p>
                    <p>I bridge the gap between regulatory complexity and software simplicity, building tools that don't just calculate—they think.</p>
                  </div>
                </div>
            </div>
        </section>

        {/* WORKS SECTION */}
        <section id="works" className="relative">
          <StickySectionHeader title={<span>AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-purple-500">Fintech</span> Tools</span>} subtitle="Portfolio" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2 mt-6">
            {PROJECTS.map((project) => (<ProjectCard key={project.id} project={project} />))}
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 100 }} viewport={{ once: true }} className="bg-white/80 dark:bg-surface-darkVariant/60 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-[3rem] p-10 shadow-xl relative overflow-hidden group">
            <h2 className="font-heading text-3xl md:text-5xl font-bold dark:text-white mb-6 relative z-10">Let's Talk Numbers & Nodes</h2>
            <div className="space-y-6 relative z-10">
              {[
                { icon: Phone, label: "Call", value: CONTACT_INFO.phone, href: `tel:${CONTACT_INFO.phone}` },
                { icon: Mail, label: "Email", value: CONTACT_INFO.email, href: `mailto:${CONTACT_INFO.email}` }
              ].map((item, idx) => (
                <motion.a key={idx} href={item.href || '#'} whileHover={{ x: 10 }} className="flex items-center gap-6 p-6 rounded-2xl hover:bg-white/60 dark:hover:bg-white/5 transition-all">
                  <div className="p-4 rounded-xl bg-white dark:bg-white/5 shadow-md text-gray-900 dark:text-white border border-gray-100 dark:border-white/5"><item.icon size={24} /></div>
                  <div><p className="text-xs font-bold text-primary-500 uppercase tracking-wider opacity-80">{item.label}</p><p className="text-xl font-heading font-bold dark:text-white">{item.value}</p></div>
                </motion.a>
              ))}
            </div>
          </motion.div>
          <div id="social" className="space-y-8">
            <StickySectionHeader title="Social Proof" subtitle="Connect" />
            <div className="flex flex-wrap gap-4">
              {SOCIAL_LINKS.map((link, i) => {
                const Icon = getSocialIcon(link.icon);
                const colorClass = getSocialStyle(link.icon);
                return (
                  <motion.a 
                    key={i} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    whileHover={{ y: -5, scale: 1.02 }} 
                    className="group flex items-center gap-4 px-6 py-4 rounded-[2rem] bg-white/80 dark:bg-[#111] border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/30 transition-all shadow-md hover:shadow-lg flex-grow sm:flex-grow-0 min-w-[160px]"
                  >
                    <Icon size={24} strokeWidth={2} className={colorClass} />
                    <span className="font-heading font-bold text-lg text-gray-800 dark:text-white">{link.name}</span>
                  </motion.a>
                );
              })}
            </div>
          </div>
        </section>

        {/* FOOTER SECTION - Designed & Built with Passion */}
        <section className="pt-8 pb-4">
           <div className="relative bg-white dark:bg-[#050505] rounded-[2.5rem] p-8 md:p-12 overflow-hidden border border-gray-200 dark:border-white/10 shadow-2xl transition-colors duration-500">
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-900/5 dark:bg-primary-900/10 blur-[80px] rounded-full pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                      <p className="font-mono text-gray-500 text-sm md:text-base mb-1">
                        // Designed & Built with
                      </p>
                      <h3 className="font-heading font-bold text-2xl md:text-3xl text-primary-600 dark:text-[#818cf8]">
                        Finance + Technology Passion
                      </h3>
                  </div>
                  
                  {/* Pulse Icon */}
                  <div className="hidden md:block text-gray-200 dark:text-white/10">
                     <Activity size={64} strokeWidth={1} />
                  </div>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-gray-100 dark:bg-white/10 my-8" />

              {/* Bottom Content */}
              <div className="relative z-10 flex justify-between items-center">
                  <p className="font-heading font-bold text-gray-400 dark:text-gray-600 text-xs md:text-sm tracking-[0.2em] uppercase">
                    © 2026 CA SRIHARRI
                  </p>
                  <div className="text-yellow-500">
                    <Sparkles size={20} fill="currentColor" />
                  </div>
              </div>
           </div>
        </section>
      </main>
    </div>
  );
};

export default App;