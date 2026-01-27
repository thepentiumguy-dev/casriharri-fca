export const smoothScrollTo = (targetId: string) => {
  const element = document.getElementById(targetId);
  if (!element) return;

  const startY = window.pageYOffset; // Use pageYOffset for better cross-browser compatibility
  const isMobile = window.innerWidth < 768;
  const offset = isMobile ? 80 : 100;
  
  const rect = element.getBoundingClientRect();
  // rect.top is relative to the viewport. 
  // We want absolute position: rect.top + currentScroll
  const targetY = rect.top + startY - offset;
  
  const distance = targetY - startY;
  
  // Refined duration calculation:
  // Base duration of 800ms, plus a bit more for longer distances.
  // Cap at 1500ms to avoid it feeling "stuck" on long scrolls.
  const duration = Math.min(800 + Math.abs(distance) * 0.5, 1500);
  
  let startTime: number | null = null;

  // Easing function: easeInOutQuart
  // This provides a more pronounced "slow start - fast middle - slow end" curve than Cubic
  const easeInOutQuart = (t: number) => {
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
  };

  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    
    const ease = easeInOutQuart(progress);
    
    window.scrollTo(0, startY + distance * ease);

    if (progress < 1) {
      requestAnimationFrame(animation);
    }
  };

  requestAnimationFrame(animation);
};