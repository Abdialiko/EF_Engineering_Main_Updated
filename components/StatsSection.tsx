'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useOwnedScrollAnimations } from '../lib/scrollAnimations';
import { 
  HiOutlineClock, 
  HiOutlineUserGroup, 
  HiOutlineBriefcase, 
  HiOutlineCheckCircle
} from 'react-icons/hi2';

const StatsSection = () => {
  const stats = [
    { value: 10, label: 'Years of Experience', icon: HiOutlineClock, color: '#F54927' },
    { value: 39, label: 'Experienced Specialists', icon: HiOutlineUserGroup, color: '#F54927' },
    { value: 27, label: 'Successful Projects', icon: HiOutlineBriefcase, color: '#F54927' },
    { value: 210, label: 'Completed Tasks / Deliverables', icon: HiOutlineCheckCircle, color: '#F54927' },
  ];

  const [counters, setCounters] = useState([0, 0, 0, 0]);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  useOwnedScrollAnimations(sectionRef);
  const iconRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (sectionRef.current) {
            const sectionTop = sectionRef.current.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            const currentScrollY = window.scrollY;
            const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
            
            if (sectionTop < windowHeight * 0.75 && !hasScrolled) {
              setHasScrolled(true);
            }

            // Scroll-based micro-movement for icons (works both directions)
            const scrollProgress = Math.max(0, Math.min(1, (windowHeight - sectionTop) / windowHeight));
            setScrollY(scrollProgress);

            if (hasScrolled) {
              const directionMultiplier = scrollDirection === 'down' ? 1 : -1;
              stats.forEach((_, index) => {
                const iconRef = iconRefs.current[index];
                if (iconRef) {
                  const offset = Math.sin(scrollProgress * Math.PI * 2 + (index * Math.PI / 2)) * 6 * directionMultiplier;
                  iconRef.style.setProperty('--scroll-offset', `${offset}px`);
                }
              });
            }

            lastScrollY = currentScrollY;
            ticking = false;
          }
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasScrolled]);

  useEffect(() => {
    if (hasScrolled) {
      stats.forEach((stat, index) => {
        const duration = 2000;
        const steps = 60;
        const increment = duration / steps;
        const stepValue = stat.value / steps;

        let current = 0;
        const timer = setInterval(() => {
          current += stepValue;
          if (current >= stat.value) {
            clearInterval(timer);
            setCounters(prev => {
              const newCounters = [...prev];
              newCounters[index] = stat.value;
              return newCounters;
            });
          } else {
            setCounters(prev => {
              const newCounters = [...prev];
              newCounters[index] = Math.floor(current);
              return newCounters;
            });
          }
        }, increment);
      });
    }
  }, [hasScrolled]);

  return (
    <section 
      ref={sectionRef}
      data-bind-own-animations
      data-scroll-section
      className="bg-gradient-to-br from-[#042970] via-[#042970] to-[#0a1a3a] py-20 md:py-28 relative overflow-hidden engineering-bg"
    >
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-20 w-40 h-40 border-2 border-white rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 border-2 border-white rounded-lg rotate-45 animate-float-reverse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white rounded-full animate-rotate-slow"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isVisible = hasScrolled;
            return (
              <div
                key={index}
                className={`
                  bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-xl 
                  flex flex-col items-center justify-center 
                  transition-all duration-700 interactive-card-3d animated-border
                  border border-white/20
                  ${isVisible ? 'opacity-100 translate-y-0 reveal-bottom' : 'opacity-0 translate-y-10'}
                `}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div 
                  ref={(el) => { if (el) iconRefs.current[index] = el; }}
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-5 transition-all duration-300 hover:scale-110 icon-container icon-bg-animate icon-entrance icon-micro-move icon-float mx-auto"
                  style={{ 
                    backgroundColor: `${stat.color}10`, 
                    color: stat.color,
                    animationDelay: `${index * 0.15}s`
                  }}
                >
                      <Icon className="icon-hover icon-glow icon-bounce icon-wiggle icon-scale-pulse icon-full-color continuous-float flex-shrink-0" style={{ color: stat.color, width: '52px', height: '52px', fontWeight: 'bold' }} />
                </div>

                {/* Number */}
                <div className="mb-4 text-center">
                  <span 
                    className="text-transparent font-extrabold text-6xl md:text-7xl leading-none block"
                    style={{ 
                      WebkitTextStroke: `3px ${stat.color}`,
                      color: stat.color
                    }}
                  >
                    {isVisible ? counters[index] : '0'}+
                  </span>
                </div>

                {/* Label */}
                <div className="text-center">
                  <div className="text-sm md:text-base text-white/90 font-semibold leading-tight micro-float-up">
                    {stat.label}
                  </div>
                </div>

                {/* Animated underline */}
                {isVisible && (
                  <div 
                    className="mt-4 h-1 rounded-full transition-all duration-1000"
                    style={{ 
                      width: '60%',
                      backgroundColor: stat.color,
                      animation: 'underline-expand 1s ease-out forwards'
                    }}
                  ></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
