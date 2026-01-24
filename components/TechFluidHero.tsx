import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useVelocity, useMotionTemplate } from 'framer-motion';

const TechFluidHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 300 }); 
  
  const skewX = useTransform(smoothVelocity, [-2000, 2000], [-3, 3]);
  const rotateX = useTransform(scrollY, [0, 500], [10, 0]); 
  const scale = useTransform(smoothVelocity, [-2000, 2000], [1, 0.98]);

  // Bubble Physics
  const bubbleY1 = useTransform(smoothVelocity, [-2000, 2000], [-30, 30]);
  const bubbleY2 = useTransform(smoothVelocity, [-2000, 2000], [30, -30]);

  return (
    <div className="flex justify-center items-center w-full py-10 relative z-10 perspective-[1200px]">
        <motion.div 
            style={{ rotateX, scale, skewX }}
            className="relative group"
            ref={containerRef}
        >
             {/* Main Minimal Glass Card */}
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative bg-white/5 dark:bg-white/5 backdrop-blur-3xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-2 shadow-2xl"
            >
                {/* Inner Content Area */}
                <div className="relative w-[90vw] md:w-[650px] h-[280px] rounded-[2rem] overflow-hidden flex flex-col items-center justify-center relative bg-gradient-to-b from-white/10 to-transparent">
                    
                    {/* Animated Spring Bubbles */}
                    <motion.div 
                        style={{ y: bubbleY1 }}
                        className="absolute top-10 left-10 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen" 
                    />
                    <motion.div 
                        style={{ y: bubbleY2 }}
                        className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen" 
                    />

                    {/* Minimal UI Indicators */}
                    <div className="absolute top-6 flex gap-2 opacity-30">
                       <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
                       <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
                       <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
                    </div>

                    {/* Text Content */}
                    <div className="relative z-10 text-center px-4">
                      <motion.div className="font-heading font-black text-3xl md:text-5xl leading-tight text-gray-800 dark:text-white tracking-tight">
                         <span className="block text-sm font-bold tracking-[0.3em] text-gray-400 mb-2">BUILT FOR</span>
                         <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 dark:from-white dark:via-gray-400 dark:to-white">
                            AUTOMATION
                         </span>
                         <br />
                         <span className="text-primary-500/80 dark:text-primary-400/80">& INNOVATION</span>
                      </motion.div>
                    </div>

                    {/* Bottom Status Bar */}
                    <div className="absolute bottom-6 w-full px-8 flex justify-between items-center opacity-40 text-[10px] font-mono font-medium tracking-widest text-gray-500 dark:text-gray-400">
                        <span>SYS.READY</span>
                        <motion.div 
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                        />
                    </div>
                </div>

                {/* Subtle White Gloss Reflection */}
                <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
            </motion.div>
        </motion.div>
    </div>
  );
};

export default TechFluidHero;