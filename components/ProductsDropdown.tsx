import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ExternalLink, ChevronDown, Sparkles } from 'lucide-react';
import { PROJECTS } from '../constants';

const ProductsDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="fixed top-6 right-24 z-50">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          relative flex items-center gap-2 h-[50px] px-5 rounded-full 
          backdrop-blur-md border transition-all duration-300 shadow-lg
          ${isOpen 
            ? 'bg-white/90 dark:bg-surface-darkVariant/90 border-primary-500/50 ring-2 ring-primary-500/20' 
            : 'bg-white/10 dark:bg-white/5 border-white/20 hover:bg-white/20 dark:hover:bg-white/10 hover:border-white/30'
          }
        `}
      >
        <Package size={20} className="text-primary-600 dark:text-primary-400" />
        <span className="font-heading font-bold text-sm text-gray-800 dark:text-white hidden sm:inline-block">Products</span>
        
        <motion.div 
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
             <ChevronDown size={14} className="text-gray-500 dark:text-gray-400" />
        </motion.div>

        {/* Shine effect on hover */}
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-shimmer" />
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.8, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 15, scale: 0.8, rotateX: -15 }}
            transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 25, 
                mass: 0.8 // Bouncy/Jiggle feel
            }}
            style={{ transformOrigin: "top right" }}
            className="absolute top-[60px] right-0 w-[260px] p-2 rounded-3xl bg-white/80 dark:bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Header of Dropdown */}
            <div className="px-3 py-2 flex items-center justify-between border-b border-gray-100 dark:border-white/5 mb-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">AI Ecosystem</span>
                <Sparkles size={12} className="text-yellow-500" />
            </div>

            <div className="flex flex-col gap-1">
              {PROJECTS.map((project, idx) => {
                 const Icon = project.icon;
                 return (
                    <motion.a
                      key={project.id}
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group flex items-center gap-3 p-2.5 rounded-2xl hover:bg-white/50 dark:hover:bg-white/10 border border-transparent hover:border-gray-100 dark:hover:border-white/5 transition-all relative overflow-hidden"
                    >
                      {/* Icon Container */}
                      <div className={`
                         relative z-10 p-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 
                         group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300
                         ${project.color}
                      `}>
                         <Icon size={18} strokeWidth={1.5} />
                      </div>

                      {/* Text Info - Only Name */}
                      <div className="flex-1 relative z-10 min-w-0">
                         <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                             {project.name}
                         </h4>
                      </div>

                      {/* Arrow */}
                      <div className="relative z-10">
                        <ExternalLink size={14} className="text-gray-300 group-hover:text-primary-500 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                      </div>
                      
                      {/* Hover Background Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-white/60 dark:via-white/5 dark:to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </motion.a>
                 )
              })}
            </div>

            <div className="mt-1 pt-2 border-t border-gray-100 dark:border-white/5 text-center">
                <span className="text-[10px] text-gray-400 font-mono">Select to launch</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsDropdown;
