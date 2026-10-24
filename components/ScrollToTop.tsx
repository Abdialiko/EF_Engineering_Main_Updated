'use client';
import React, { useState, useEffect, useRef } from 'react';
import { HiOutlineArrowUp } from 'react-icons/hi2';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let ticking = false;
    
    const toggleVisibility = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = Math.min((scrollTop / scrollHeight) * 100, 100);
          
          setScrollProgress(progress);
          
          if (scrollTop > 300) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    setIsClicked(true);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Reset click state after animation
    setTimeout(() => {
      setIsClicked(false);
    }, 1000);
  };

  // Progress ring calculation
  const circumference = 2 * Math.PI * 22; // radius = 22 (half of 44px)
  const offset = circumference - (scrollProgress / 100) * circumference;

  return (
    <button
      ref={buttonRef}
      onClick={scrollToTop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#F54927] via-[#ff6b4a] to-[#F54927] text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 hover:from-[#042970] hover:via-[#0a3a8a] hover:to-[#042970] hover:scale-125 hover:shadow-[#F54927]/60 hover:shadow-2xl group active:scale-95 ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-75 pointer-events-none'
      } ${isClicked ? 'animate-bounce' : ''}`}
      aria-label="Scroll to top"
      style={{
        willChange: 'transform, opacity',
        backgroundSize: isHovered ? '200% 200%' : '100% 100%',
        animation: isHovered ? 'gradient-shift 3s ease infinite' : 'none',
      }}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#F54927] via-[#EC4899] to-[#8B5CF6] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
      
      {/* Progress ring */}
      <svg 
        className="absolute inset-0 w-full h-full -rotate-90 transform transition-transform duration-300 group-hover:rotate-[-450deg]"
        viewBox="0 0 48 48"
        style={{ width: '100%', height: '100%' }}
      >
        <circle
          cx="24"
          cy="24"
          r="22"
          fill="none"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="2"
        />
        <circle
          cx="24"
          cy="24"
          r="22"
          fill="none"
          stroke="rgba(255, 255, 255, 0.8)"
          strokeWidth="2.5"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300 group-hover:stroke-[#F54927]"
        />
      </svg>

      {/* Pulsing ring effect */}
      <div className={`absolute inset-0 rounded-full border-2 border-white/30 ${isHovered ? 'animate-ping' : ''}`}></div>
      
      {/* Icon with multiple animations */}
      <HiOutlineArrowUp className={`w-6 h-6 md:w-7 md:h-7 relative z-10 transition-all duration-300 ${
        isHovered ? '-translate-y-2 scale-110 rotate-[-5deg]' : 'translate-y-0 scale-100 rotate-0'
      } ${isClicked ? 'animate-bounce' : ''}`} />
      
      {/* Multiple ripple effects */}
      <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-30 group-hover:animate-ping" style={{ animationDelay: '0s' }}></div>
      <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 group-hover:animate-ping" style={{ animationDelay: '0.3s' }}></div>
      
      {/* Glow effect that expands on hover */}
      <div className={`absolute inset-0 rounded-full bg-[#F54927] opacity-0 group-hover:opacity-40 blur-xl transition-all duration-500 ${
        isHovered ? 'scale-150' : 'scale-100'
      }`}></div>
      
      {/* Shine effect */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 transition-transform duration-1000 ${
          isHovered ? 'translate-x-full' : '-translate-x-full'
        }`}></div>
      </div>
      
      {/* Sparkle particles on hover */}
      {isHovered && (
        <>
          <div className="absolute top-1 left-1/2 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-1/2 right-1 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
          <div className="absolute bottom-1 left-1/4 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
          <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0.6s' }}></div>
        </>
      )}
      
      {/* Progress percentage (optional, shows on hover) */}
      {isHovered && scrollProgress > 0 && (
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-[#F54927] bg-white px-2 py-1 rounded shadow-lg whitespace-nowrap">
          {Math.round(scrollProgress)}%
        </span>
      )}
    </button>
  );
};

export default ScrollToTop;

