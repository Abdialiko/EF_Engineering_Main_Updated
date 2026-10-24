'use client';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import Reveal from './Reveal';
import Link from 'next/link';
import { useOwnedScrollAnimations } from '../lib/scrollAnimations';
import { 
  HiOutlineShieldCheck, 
  HiOutlineTrophy,
  HiOutlineClock,
  HiOutlineArrowRight
} from 'react-icons/hi2';

const FeatureItem = ({
  icon,
  title,
  description,
  delay,
  iconRef,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  iconRef?: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <Reveal delay={delay} variant="up">
      <div className="flex gap-3 md:gap-4 py-3 md:py-4 border-t border-white/10 first:border-t-0 group hover:bg-white/5 transition-all duration-300 rounded-lg px-2 -mx-2">
        <div 
          ref={iconRef}
          className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex items-center justify-center bg-white text-[#F54927] rounded-lg md:rounded-xl shadow-md md:shadow-lg group-hover:scale-110 group-hover:bg-[#F54927] group-hover:text-white transition-all duration-300 flex-shrink-0 icon-container icon-bg-animate icon-entrance icon-micro-move icon-float continuous-float"
          style={{ animationDelay: `${delay / 1000}s` }}
        >
          <div className="icon-glow icon-bounce icon-wiggle icon-scale-pulse flex items-center justify-center w-full h-full">
            <div style={{ width: '32px', height: '32px', fontWeight: 'bold' }} className="md:w-[40px] md:h-[40px] icon-full-color">
              {icon}
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h4 className="text-white text-base md:text-lg lg:text-xl font-bold tracking-wide mb-1 md:mb-1.5 leading-tight group-hover:text-[#F54927] transition-colors micro-float-up text-shift">
            {title}
          </h4>
          <p className="text-white/70 text-xs md:text-sm leading-relaxed group-hover:text-white/90 transition-colors micro-float-down">
            {description}
          </p>
        </div>
      </div>
    </Reveal>
  );
};

const WhyChooseUsSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  useOwnedScrollAnimations(sectionRef);
  const icon1Ref = useRef<HTMLDivElement>(null);
  const icon2Ref = useRef<HTMLDivElement>(null);
  const icon3Ref = useRef<HTMLDivElement>(null);

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
            const scrollProgress = Math.max(0, Math.min(1, (windowHeight - sectionTop) / windowHeight));
            setScrollY(scrollProgress);

            // Apply micro-movements to feature icons (works both directions)
            const directionMultiplier = scrollDirection === 'down' ? 1 : -1;
            
            if (icon1Ref.current) {
              const offset = Math.sin(scrollProgress * Math.PI * 2) * 4 * directionMultiplier;
              icon1Ref.current.style.setProperty('--scroll-offset', `${offset}px`);
            }
            if (icon2Ref.current) {
              const offset = Math.sin(scrollProgress * Math.PI * 2 + Math.PI / 2) * 4 * directionMultiplier;
              icon2Ref.current.style.setProperty('--scroll-offset', `${offset}px`);
            }
            if (icon3Ref.current) {
              const offset = Math.sin(scrollProgress * Math.PI * 2 + Math.PI) * 4 * directionMultiplier;
              icon3Ref.current.style.setProperty('--scroll-offset', `${offset}px`);
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
  }, []);

  return (
    <section ref={sectionRef} data-bind-own-animations data-scroll-section className="py-0 relative overflow-hidden">
      {/* Title Section - Top Center - Text Only */}
      <div className="text-center py-6 md:py-8">
        <Reveal variant="up" delay={0}>
          <div className="uppercase tracking-[.2em] text-[10px] md:text-xs text-[#F54927] font-bold mb-2">WHATS REASONS</div>
        </Reveal>
        <Reveal variant="up" delay={100}>
          <h2 className="text-gray-900 text-2xl md:text-3xl lg:text-4xl leading-tight font-extrabold title-entrance text-shift">
            Why{' '}
            <span className="text-[#F54927] relative gradient-text">
              Choose Us
              <span className="absolute bottom-0 left-0 w-full h-1 bg-[#042970] animate-underline-expand"></span>
            </span>
          </h2>
        </Reveal>
        <Reveal variant="up" delay={200}>
          <p className="text-gray-700 mt-3 md:mt-4 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Creating spaces that inspire and endure with expertise, skilled teams, and precision.
          </p>
        </Reveal>
      </div>

      <div className="container mx-auto px-0 lg:px-4 grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">
        {/* Left image - Aligned Height */}
        <div className="relative h-[500px] md:h-[550px] lg:h-[600px] order-2 lg:order-1">
          <Image
            src="/images/whychoose.webp"
            alt="Why Choose Us"
            fill
            priority={false}
            loading="lazy"
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
            quality={85}
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
          
          {/* Floating decorative elements */}
          <div className="absolute top-6 right-6 w-16 h-16 border-2 border-white/20 rounded-full animate-float hidden lg:block"></div>
          <div className="absolute bottom-6 left-6 w-12 h-12 border-2 border-white/20 rounded-lg rotate-45 animate-float-reverse hidden lg:block"></div>
        </div>

        {/* Right content - Full Content with Button - Colorful Interactive Background */}
        <div className="relative px-6 md:px-10 lg:px-12 py-8 md:py-10 lg:py-12 flex flex-col justify-between order-1 lg:order-2 overflow-hidden h-[500px] md:h-[550px] lg:h-[600px] group/content">
          {/* Colorful Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#F54927] via-[#042970] to-[#8B5CF6] opacity-90 transition-opacity duration-500 group-hover/content:opacity-100"></div>
          
          {/* Animated Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#042970]/80 via-[#F54927]/70 to-[#10B981]/60 animate-gradient-shift"></div>
          
          {/* Interactive Background Pattern */}
          <div className="absolute inset-0 opacity-20 group-hover/content:opacity-30 transition-opacity duration-500">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: `radial-gradient(circle at 20% 30%, rgba(245, 73, 39, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(4, 41, 112, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)`,
              backgroundSize: '200% 200%',
              animation: 'gradient-move 15s ease infinite'
            }}></div>
          </div>
          
          {/* Animated Mesh Gradient */}
          <div className="absolute inset-0 opacity-30 group-hover/content:opacity-40 transition-opacity duration-500">
            <div className="absolute inset-0" style={{
              background: `linear-gradient(45deg, 
                rgba(245, 73, 39, 0.2) 0%, 
                rgba(4, 41, 112, 0.3) 25%, 
                rgba(139, 92, 246, 0.2) 50%, 
                rgba(16, 185, 129, 0.2) 75%, 
                rgba(245, 73, 39, 0.2) 100%)`,
              backgroundSize: '400% 400%',
              animation: 'gradient-move 20s ease infinite'
            }}></div>
          </div>
          
          {/* Shimmer Effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover/content:translate-x-[200%] transition-transform duration-2000"></div>
          </div>
          
          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${10 + i * 12}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${3 + i * 0.5}s`
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <div className="space-y-1 md:space-y-2">
              <FeatureItem
                icon={<HiOutlineShieldCheck className="text-3xl" />}
                title="Expert & Professional"
                description="Certified professionals with extensive experience ensuring the highest standards of quality."
                delay={300}
                iconRef={icon1Ref}
              />

              <FeatureItem
                icon={<HiOutlineTrophy className="text-3xl" />}
                title="High Quality Work"
                description="Superior craftsmanship and attention to detail in every project from concept to completion."
                delay={400}
                iconRef={icon2Ref}
              />

              <FeatureItem
                icon={<HiOutlineClock className="text-3xl" />}
                title="Professional Approach"
                description="Systematic approach ensuring efficient project management and timely delivery."
                delay={500}
                iconRef={icon3Ref}
              />
            </div>

            <Reveal variant="up" delay={600}>
              <div className="mt-6 md:mt-8">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 md:gap-3 bg-[#F54927] hover:bg-[#042970] text-white px-6 md:px-8 py-3 md:py-4 text-sm md:text-base font-bold uppercase tracking-wide transition-all duration-300 hover:shadow-xl hover:scale-105 group rounded-lg"
                >
                  Learn More
                  <HiOutlineArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
