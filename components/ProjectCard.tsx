import React, { useState, useRef, MouseEvent } from 'react';
import { motion, AnimatePresence, Variants, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, X, ChevronDown } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = project.icon;
  const cardRef = useRef<HTMLDivElement>(null);

  // --- 3D Tilt & Glare Physics ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), { stiffness: 150, damping: 20 });
  
  const glareOpacity = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 0.4]), { stiffness: 150, damping: 20 });
  const glareX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), { stiffness: 150, damping: 20 });
  const glareY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), { stiffness: 150, damping: 20 });

  // Fixed: Call hook at top level
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 80%)`;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isOpen || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const xPct = (e.clientX - rect.left) / width - 0.5;
    const yPct = (e.clientY - rect.top) / height - 0.5;
    
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // --- Animation Variants ---
  const containerVariants = {
    collapsed: {
      scale: 1,
      zIndex: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    },
    expanded: {
      scale: 1,
      zIndex: 40,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  const contentVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.3 // Key change: Wait for card expansion
      }
    },
    exit: { 
      opacity: 0, 
      transition: { duration: 0.2 } 
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 200, damping: 20 } 
    }
  };

  return (
    <motion.div
      ref={cardRef}
      layout
      variants={containerVariants}
      animate={isOpen ? "expanded" : "collapsed"}
      initial="collapsed"
      onClick={() => !isOpen && setIsOpen(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isOpen ? 0 : rotateX,
        rotateY: isOpen ? 0 : rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative cursor-pointer transition-colors duration-500
        ${isOpen 
          ? 'col-span-1 md:col-span-2 fixed md:relative inset-4 md:inset-0 h-auto md:h-auto z-50 md:z-auto' 
          : 'h-80 group perspective-1000'
        }
      `}
    >
      {/* Card Container with Deep Glassmorphism */}
      <motion.div 
        layout="position"
        className={`
          relative w-full h-full overflow-hidden border shadow-2xl backdrop-blur-2xl
          ${isOpen 
             ? 'bg-surface-light/95 dark:bg-surface-darkVariant/95 border-gray-200 dark:border-white/10 rounded-[2.5rem] p-8 md:p-10' 
             : 'bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10 rounded-[2rem] p-6 flex flex-col justify-between hover:shadow-primary-500/20'
          }
        `}
      >
        
        {/* Dynamic Glare Effect (Only visible when closed) */}
        {!isOpen && (
          <motion.div 
            className="absolute inset-0 pointer-events-none z-10 mix-blend-overlay"
            style={{
              background: glareBackground,
              opacity: glareOpacity
            }}
          />
        )}

        {/* Floating Gradient Blob */}
        <motion.div 
          layout
          className={`absolute -top-32 -right-32 w-80 h-80 bg-gradient-to-br ${project.color.replace('text-', 'from-')}/20 to-transparent blur-[80px] rounded-full pointer-events-none`} 
          animate={{ scale: isOpen ? 1.5 : 1 }}
        />

        {/* Card Header Content */}
        <motion.div layout="position" className="flex justify-between items-start relative z-20">
          <motion.div 
             layout
             className={`p-4 rounded-2xl bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/10 ${project.color}`}
             whileHover={{ scale: 1.1, rotate: 5 }}
             transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Icon size={isOpen ? 32 : 44} strokeWidth={1.5} />
          </motion.div>
          
          {isOpen ? (
            <motion.button 
              layout
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
              className="p-3 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              <X size={24} />
            </motion.button>
          ) : (
            <motion.div
              layout
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="p-2 text-gray-400 dark:text-gray-500 group-hover:text-primary-500 transition-colors"
            >
              <ChevronDown size={28} />
            </motion.div>
          )}
        </motion.div>

        {/* Card Title & Short Description */}
        <motion.div layout="position" className="mt-4 relative z-20">
          <motion.h3 
            layout="position" 
            className="font-heading font-black text-3xl dark:text-white text-gray-900 mb-2 tracking-tight"
          >
            {project.name}
          </motion.h3>
          
          {!isOpen && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              // Added pr-16 to prevent text overlap with the absolute positioned arrow icon
              className="text-gray-600 dark:text-gray-400 font-medium text-lg line-clamp-2 pr-16"
            >
              {project.shortDescription}
            </motion.p>
          )}
        </motion.div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mt-8 space-y-8 relative z-20"
            >
              <motion.p 
                variants={itemVariants}
                className="text-xl text-gray-700 dark:text-gray-200 leading-relaxed font-medium"
              >
                {project.fullDescription}
              </motion.p>

              <motion.div variants={itemVariants} className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 opacity-80">
                  Key Capabilities
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.features.map((feature, idx) => (
                    <motion.div 
                      key={idx} 
                      variants={itemVariants}
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5"
                    >
                      <CheckCircle2 size={18} className="text-primary-500 shrink-0" />
                      <span className="text-base font-semibold text-gray-800 dark:text-gray-100">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-6 flex justify-end">
                <motion.a 
                  href={project.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full font-bold text-lg overflow-hidden shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <span className="relative z-10">Launch Project</span>
                  <ArrowUpRight size={22} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </motion.a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isOpen && (
           <motion.div 
              className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity z-20"
              initial={false}
              animate={{ rotate: 45 }}
              whileHover={{ rotate: 0, scale: 1.2 }}
           >
             <div className="p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white shadow-lg">
               <ArrowUpRight size={24} />
             </div>
           </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProjectCard;