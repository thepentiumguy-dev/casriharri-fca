import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Zap, CheckCircle2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

// Helper to get random soft colors for the inner feature cards
const getSoftColor = (index: number, isDark: boolean) => {
  const colors = [
    isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-50 text-orange-600',
    isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600',
    isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600',
    isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-50 text-purple-600',
    isDark ? 'bg-pink-500/20 text-pink-400' : 'bg-pink-50 text-pink-600',
  ];
  return colors[index % colors.length];
};

// Unique Animation Variants based on Project ID
const getIconAnimation = (projectId: string) => {
  switch (projectId) {
    case 'finsight': // Robot/AI Theme -> Glitch/Pulse
      return {
        tap: { scale: 0.9, rotate: [0, -5, 5, 0], transition: { duration: 0.2 } },
        hover: { scale: 1.1, filter: "brightness(1.2)" }
      };
    case 'taxplanner': // Money/Calc Theme -> Coin Flip/Jump
      return {
        tap: { y: -10, rotateX: 180, transition: { duration: 0.4 } },
        hover: { y: -5 }
      };
    case 'audit-mate': // Time/Shield Theme -> Spin/Wobble
      return {
        tap: { rotate: 360, transition: { duration: 0.5, ease: "backOut" as const } },
        hover: { rotate: 15 }
      };
    default:
      return {
        tap: { scale: 0.9 },
        hover: { scale: 1.05 }
      };
  }
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isOpen, setIsOpen] = useState(false);
  const MainIcon = project.icon;
  const highlightFeatures = project.highlights;
  const tags = project.features.slice(0, 3);
  const iconAnim = getIconAnimation(project.id);

  return (
    <motion.div
      layout
      className={`
        relative w-full overflow-hidden group
        bg-[#FDFCF6] dark:bg-surface-darkVariant/40 backdrop-blur-xl 
        border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl
        transition-all duration-500 ease-out p-6 md:p-8
        ${isOpen 
            ? 'rounded-[2.5rem] ring-2 ring-primary-500/20 z-20' 
            : 'rounded-[2.5rem] hover:-translate-y-1 z-0'
        }
      `}
    >
        {/* Clickable Header Area */}
        <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
            {/* Header Section: Title & Icon */}
            <div className="flex justify-between items-start mb-8">
                <div>
                   <motion.h3 
                    layout="position"
                    className="font-heading font-bold text-3xl md:text-4xl text-gray-900 dark:text-white leading-tight"
                   >
                    {project.name}
                   </motion.h3>
                   <p className="text-sm font-medium text-gray-400 mt-1 dark:text-gray-500">{project.shortDescription}</p>
                </div>

                <div className="flex flex-col items-end gap-1">
                    <motion.div 
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        className={`p-3 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm text-gray-900 dark:text-white`}
                    >
                        <MainIcon size={24} strokeWidth={1.5} />
                    </motion.div>
                </div>
            </div>

            {/* Middle Section: Specific Highlight Cards Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                {highlightFeatures.map((highlight, idx) => {
                    const CardIcon = highlight.icon;
                    return (
                        <motion.div 
                            key={idx}
                            onClick={(e) => {
                                e.stopPropagation(); // Allow playing with icon without toggling card
                            }}
                            whileTap={iconAnim.tap}
                            whileHover={iconAnim.hover}
                            className="cursor-crosshair flex flex-col items-center justify-center text-center p-3 md:p-4 rounded-[1.5rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm aspect-square md:aspect-auto md:h-32 transition-colors hover:border-primary-200 dark:hover:border-primary-500/30"
                        >
                            <div className={`p-2.5 rounded-xl mb-3 ${getSoftColor(idx, false)} dark:${getSoftColor(idx, true).split(' ')[0]} dark:text-white pointer-events-none`}>
                                <CardIcon size={18} fill="currentColor" className="opacity-80" />
                            </div>
                            <span className="text-[10px] md:text-sm font-bold text-gray-700 dark:text-gray-200 leading-tight line-clamp-2 pointer-events-none">
                                {highlight.title}
                            </span>
                            <span className="text-[9px] uppercase tracking-wider text-gray-400 mt-1 font-bold pointer-events-none">
                                {highlight.tag}
                            </span>
                        </motion.div>
                    );
                })}
            </div>

            {/* Collapsed Bottom Section: Tags & Chevron */}
            {!isOpen && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-between items-center mt-2">
                  <div className="flex flex-wrap gap-2">
                      {tags.map((tag, idx) => (
                          <span 
                              key={idx} 
                              className="px-3 py-1 rounded-full text-[10px] font-bold border bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10"
                          >
                              {tag}
                          </span>
                      ))}
                  </div>
                  <div className="p-2 rounded-full bg-gray-100 dark:bg-white/5 text-gray-400">
                     <ChevronDown size={16} />
                  </div>
               </motion.div>
            )}
        </div>

        {/* Expanded Content - Revamped Design */}
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: "circOut" }}
                    className="overflow-hidden"
                >
                    <div className="pt-6 mt-6 border-t border-dashed border-gray-200 dark:border-white/10">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                           {/* Left Column: Description & Features */}
                           <div className="lg:col-span-3 space-y-8">
                              <div>
                                 <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">
                                    <Sparkles size={12} /> Concept Overview
                                 </h4>
                                 <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed font-medium">
                                     {project.fullDescription}
                                 </p>
                              </div>
                              
                              <div>
                                 <h4 className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-4">Key Features</h4>
                                 <div className="flex flex-wrap gap-3">
                                    {project.features.map((feature, i) => (
                                       <motion.div 
                                         key={i}
                                         initial={{ opacity: 0, scale: 0.9 }}
                                         animate={{ opacity: 1, scale: 1 }}
                                         transition={{ delay: i * 0.05 }}
                                         className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-surface-lightVariant/60 dark:bg-white/5 border border-surface-lightVariant dark:border-white/5 text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-sm hover:bg-white dark:hover:bg-white/10 transition-colors cursor-default"
                                       >
                                          <div className={`p-1 rounded-full ${i % 2 === 0 ? 'bg-primary-100 text-primary-600' : 'bg-secondary-100 text-secondary-500'} dark:bg-transparent`}>
                                            <CheckCircle2 size={12} strokeWidth={3} />
                                          </div>
                                          {feature}
                                       </motion.div>
                                    ))}
                                 </div>
                              </div>
                           </div>

                           {/* Right Column: CTA & Tech */}
                           <div className="lg:col-span-2 flex flex-col justify-between bg-white dark:bg-black/20 rounded-3xl p-5 border border-gray-100 dark:border-white/5">
                               <div className="mb-4">
                                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Experience It</h4>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                                     Launch the live application to see how automation changes the game.
                                  </p>
                               </div>
                               
                               <div className="space-y-3">
                                   <motion.a 
                                      href={project.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      className="w-full py-3.5 rounded-2xl font-bold text-center text-white bg-gradient-to-r from-primary-600 to-purple-600 hover:shadow-lg hover:shadow-primary-500/25 transition-all flex items-center justify-center gap-2 text-sm"
                                   >
                                      <Zap size={16} fill="currentColor" /> Launch App
                                   </motion.a>
                                   <button 
                                      onClick={() => setIsOpen(false)}
                                      className="w-full py-3 rounded-2xl font-bold text-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-sm flex items-center justify-center gap-2"
                                   >
                                      Close Details <ChevronUp size={14} />
                                   </button>
                               </div>
                           </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
  );
};

export default ProjectCard;