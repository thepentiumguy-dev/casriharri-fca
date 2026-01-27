import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, ChevronDown, X } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = project.icon;

  return (
    <motion.div
      layout
      onClick={() => setIsOpen(!isOpen)}
      className={`
        relative w-full overflow-hidden cursor-pointer group
        bg-white/10 dark:bg-surface-darkVariant/40 backdrop-blur-xl 
        border border-white/20 dark:border-white/10 shadow-xl
        transition-all duration-500 ease-out
        ${isOpen 
            ? 'rounded-[2.5rem] bg-white/20 dark:bg-surface-darkVariant/60 border-primary-500/30 ring-1 ring-primary-500/20' 
            : 'rounded-[2rem] hover:border-primary-500/30 hover:shadow-2xl hover:-translate-y-1'
        }
      `}
    >
        {/* Decorative Blob */}
        <motion.div 
           layout="position"
           className={`absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br ${project.color.replace('text-', 'from-')}/20 to-transparent rounded-full blur-[60px] pointer-events-none`}
           animate={{ 
             scale: isOpen ? 1.5 : 1, 
             opacity: isOpen ? 0.3 : 0.5 
           }}
        />

        <div className="relative z-10 p-8 flex flex-col">
            <div className="flex justify-between items-start">
                <motion.div 
                   layout="position"
                   className={`p-4 rounded-2xl bg-white/20 dark:bg-white/5 border border-white/10 ${project.color}`}
                >
                   <Icon size={32} strokeWidth={1.5} />
                </motion.div>

                {/* Toggle Icon */}
                <motion.button
                   layout="position"
                   className={`
                      p-2 rounded-full transition-colors duration-300
                      ${isOpen ? 'bg-white/10 text-gray-500 hover:text-red-500' : 'text-gray-400 group-hover:text-primary-500'}
                   `}
                >
                   {isOpen ? <X size={24} /> : <ArrowUpRight size={24} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                </motion.button>
            </div>

            <motion.div layout="position" className="mt-6">
                <motion.h3 
                   layout="position" 
                   className="font-heading font-black text-3xl text-gray-900 dark:text-white leading-tight mb-2"
                >
                   {project.name}
                </motion.h3>

                <AnimatePresence mode='popLayout'>
                    {!isOpen && (
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-gray-600 dark:text-gray-400 font-medium text-lg line-clamp-2"
                        >
                            {project.shortDescription}
                        </motion.p>
                    )}
                </AnimatePresence>
            </motion.div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        <div className="pt-6 border-t border-white/10 mt-6">
                            <motion.p 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-medium mb-6"
                            >
                                {project.fullDescription}
                            </motion.p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                                {project.features.map((feature, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + idx * 0.05 }}
                                        className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300"
                                    >
                                        <CheckCircle2 size={16} className="text-primary-500 shrink-0" />
                                        {feature}
                                    </motion.div>
                                ))}
                            </div>

                            <div className="flex justify-end">
                                <motion.a 
                                    href={project.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg hover:shadow-primary-500/20 transition-shadow"
                                >
                                    Launch <ArrowUpRight size={16} />
                                </motion.a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {!isOpen && (
               <motion.div layout className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ChevronDown className="text-primary-500 animate-bounce" />
               </motion.div>
            )}
        </div>
    </motion.div>
  );
};

export default ProjectCard;