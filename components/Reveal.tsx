'use client';
import React, { useEffect, useRef, useState } from 'react';

type Props = {
  children: React.ReactNode;
  delay?: number; // ms
  className?: string;
  variant?: 'up' | 'left' | 'right' | 'down' | 'fade';
};

const Reveal: React.FC<Props> = ({ children, delay = 0, className = '', variant = 'up' }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Improved IntersectionObserver with better threshold and rootMargin
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setVisible(true), delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { 
        threshold: 0.1, // Trigger earlier (was 0.15)
        rootMargin: '0px 0px -50px 0px' // Start animation 50px before element enters viewport
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`reveal-base reveal-${variant} ${visible ? 'reveal-visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default Reveal;


