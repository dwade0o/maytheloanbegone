import { useState, useEffect } from 'react';

export function useResponsive() {
  // Start with a default that matches server-side rendering
  const [isMobile, setIsMobile] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Mark as hydrated and check initial screen size
    setIsHydrated(true);
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    // Check initial screen size
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup event listener
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // During SSR and before hydration, always return desktop layout
  // This prevents hydration mismatches
  if (!isHydrated) {
    return { isMobile: false, isDesktop: true };
  }

  return { isMobile, isDesktop: !isMobile };
}
