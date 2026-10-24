/**
 * Hook to initialize title animations on any page
 */
import { useEffect } from 'react';

export const useTitleAnimations = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const titleObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            entry.target.classList.add('title-animated');
            titleObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    // Find all titles with data-title-animate attribute
    const titles = document.querySelectorAll('[data-title-animate], .title-scroll-reveal');
    titles.forEach((title) => {
      if (!title.classList.contains('title-scroll-reveal')) {
        title.classList.add('title-scroll-reveal');
      }
      titleObserver.observe(title);
    });

    return () => {
      titleObserver.disconnect();
    };
  }, []);
};

