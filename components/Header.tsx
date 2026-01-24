import React, { useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const navItems = useMemo(() => [
    { label: 'Profile', id: 'profile' },
    { label: 'AI Tools', id: 'works' },
    { label: 'Contact', id: 'contact' },
    { label: 'Social', id: 'social' },
  ], []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > 20) setScrolled(true);
    else setScrolled(false);
    if (latest > previous && latest > 150) setHidden(true);
    else setHidden(false);
  });

  useEffect(() => {
    const observerOptions = {
       root: null,
       // Adjusted for mobile: larger active area to catch sections better
       rootMargin: window.innerWidth < 768 ? '-10% 0px -40% 0px' : '-20% 0px -50% 0px',
       threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
           setActiveTab(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    navItems.forEach(item => {
        const el = document.getElementById(item.id);
        if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [navItems]);

  const scrollTo = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const isMobile = window.innerWidth < 768;
      const offset = isMobile ? 80 : 120;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="fixed top-0 left-0 right-0 z-40 flex justify-center pt-20 md:pt-6 pointer-events-none px-4"
        >
          <div 
            className={`
              pointer-events-auto flex items-center gap-1 p-2 rounded-full border transition-all duration-500 transform-gpu
              ${scrolled 
                ? 'bg-white/80 dark:bg-black/60 backdrop-blur-2xl border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]' 
                : 'bg-white/40 dark:bg-black/20 backdrop-blur-md border-white/30 dark:border-white/5'
              }
            `}
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`
                  relative px-5 py-2.5 rounded-full text-sm font-semibold transition-colors z-10
                  ${activeTab === item.id 
                    ? 'text-white dark:text-gray-900' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }
                `}
              >
                {activeTab === item.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gray-900 dark:bg-white rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {item.label}
              </button>
            ))}
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
};

export default Header;