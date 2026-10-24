'use client'
import React, { useEffect, useState, useRef } from "react";
import { FaPlay } from "react-icons/fa";
import Image from 'next/image';
import { 
  HiOutlineBuildingOffice2, 
  HiOutlineAcademicCap,
  HiOutlineCheckBadge,
  HiOutlineArrowRight,
  HiOutlineMapPin,
  HiOutlineCube,
  HiOutlineMap,
  HiOutlineWrenchScrewdriver,
  HiOutlineChartBar,
  HiOutlineMapPin as HiOutlineLocationMarker,
  HiOutlineDocumentCheck,
  HiOutlineLightBulb,
  HiOutlineStar,
  HiOutlineRocketLaunch,
  HiOutlineArrowTrendingUp,
  HiOutlineClipboardDocumentList,
  HiOutlineShieldCheck,
  HiOutlineBookOpen,
  HiOutlineTrophy
} from "react-icons/hi2";
import Link from 'next/link';
import Reveal from './Reveal';
import { useOwnedScrollAnimations } from '../lib/scrollAnimations';
import TargetIcon from './TargetIcon';

const AboutSection = () => {
  const [mounted, setMounted] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isScrollingDown, setIsScrollingDown] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  useOwnedScrollAnimations(sectionRef);
  const iconRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    // Set mounted immediately and check if section is already in view
      setMounted(true);
    // Check if section is already visible on mount
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top < windowHeight * 0.8) {
        setAnimate(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
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
            setIsScrollingDown(scrollDirection === 'down');
        
        if (sectionTop < windowHeight * 0.8) {
          setAnimate(true);
        }

            const scrollProgress = Math.max(0, Math.min(1, (windowHeight - sectionTop) / windowHeight));
            setScrollY(scrollProgress);

            if (animate) {
              const directionMultiplier = scrollDirection === 'down' ? 1 : -1;
              Object.keys(iconRefs.current).forEach((key, index) => {
                const iconRef = iconRefs.current[key];
                if (iconRef) {
                  const offset = Math.sin(scrollProgress * Math.PI * 2 + (index * Math.PI / 4)) * 6 * directionMultiplier;
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
  }, [mounted, animate]);


  const services = [
    { title: 'Architectural & Engineering Design', icon: HiOutlineCube, description: 'Professional design services' },
    { title: 'Urban Planning & Neighborhood Design', icon: HiOutlineMap, description: 'Comprehensive urban solutions' },
    { title: 'Construction Management & Supervision', icon: HiOutlineWrenchScrewdriver, description: 'Expert project oversight' },
    { title: 'Project Management', icon: HiOutlineChartBar, description: 'Efficient project coordination' },
    { title: 'GIS Applications for Urban Planning', icon: HiOutlineLocationMarker, description: 'Advanced mapping solutions' },
    { title: 'Building Permit Support & Case Handling', icon: HiOutlineDocumentCheck, description: 'Streamlined permit processes' },
  ];


  return (
    <section ref={sectionRef} data-bind-own-animations data-scroll-section className="bg-white py-24 md:py-32 overflow-hidden engineering-bg relative">
      {/* Floating decorative shapes */}
      <div className="absolute top-20 right-10 w-32 h-32 border-2 border-[#F54927]/10 rounded-full animate-float shape-float-x hidden lg:block"></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 border-2 border-[#042970]/10 rounded-lg rotate-45 animate-float-reverse shape-float-x hidden lg:block" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-[#F54927]/5 rounded-full continuous-float hidden lg:block" style={{ animationDelay: '2s' }}></div>
      
      {/* Motion lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#F54927]/20 to-transparent motion-line hidden lg:block"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#042970]/20 to-transparent motion-line hidden lg:block" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Image Section with Previous Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-start mb-16">
          {/* LEFT SIDE - Images with enhanced animations */}
          <div className="relative flex justify-center lg:justify-start items-start order-2 lg:order-1 w-full">
            <div className="relative w-full max-w-full lg:max-w-[500px]">
              {/* Large image */}
              <div className={`relative w-full mb-4 lg:mb-0 transition-all duration-1000 ease-out zoom-fade ${
                mounted ? (animate ? 'opacity-100 translate-x-0 scale-100' : 'opacity-100 translate-x-0 scale-100') : 'opacity-0 -translate-x-20 scale-95'
              }`}>
              <img
                src="/images/about/3d4.webp"
                alt="EF Architect and Engineering Consulting Project"
                  className="w-full h-[400px] sm:h-[500px] lg:h-[600px] object-cover shadow-2xl rounded-xl transition-all duration-500 hover:scale-105 hover:shadow-3xl interactive-card-3d image-hover-effect"
                  loading="eager"
              />
                {/* Image overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#F54927]/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
              </div>

              {/* Overlayed smaller image - positioned relative to container */}
              <div className={`relative lg:absolute lg:right-[-100px] xl:right-[-140px] lg:top-[120px] w-full lg:w-[240px] xl:w-[280px] h-[300px] lg:h-[320px] transition-all duration-1000 ease-out delay-200 zoom-fade mt-4 lg:mt-0 ${
                mounted ? (animate ? 'opacity-100 translate-x-0 scale-100' : 'opacity-100 translate-x-0 scale-100') : 'opacity-0 translate-x-20 scale-95'
              }`}>
              <img
                src="/images/about/bonga.jpg"
                alt="EF Architect and Engineering Consulting Team"
                  className="w-full h-full object-cover shadow-2xl rounded-xl transition-all duration-500 hover:scale-110 hover:shadow-3xl interactive-card-3d image-hover-effect"
                  loading="eager"
                />
                {/* Image overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#042970]/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
              </div>

              {/* Experience badge with icon - positioned relative */}
              <div 
                suppressHydrationWarning
                className={`relative lg:absolute -bottom-4 lg:-bottom-6 lg:right-[-80px] xl:right-[-100px] bg-gradient-to-br from-[#F54927] via-[#F54927] to-[#d63e1f] px-6 lg:px-10 py-6 lg:py-8 flex items-center gap-3 lg:gap-4 rounded-xl shadow-2xl transition-all duration-1000 delay-300 animated-gradient interactive-card-3d hover:scale-110 hover:shadow-[0_0_40px_rgba(245,73,39,0.5)] mt-4 lg:mt-0 group/badge animate-pulse-slow hover:animate-none ${
                  mounted ? (animate ? 'opacity-100 translate-y-0 scale-100 reveal-bottom' : 'opacity-100 translate-y-0 scale-100') : 'opacity-0 translate-y-10 scale-90'
              }`}
              style={{
                animation: 'float-badge 6s ease-in-out infinite, pulse-glow 3s ease-in-out infinite',
              }}>
                {/* Animated background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#F54927] via-[#F54927] to-[#d63e1f] rounded-xl opacity-75 group-hover/badge:opacity-100 transition-opacity duration-500 animate-pulse-glow"></div>
                
                {/* Animated border glow */}
                <div className="absolute inset-0 rounded-xl border-2 border-white/30 group-hover/badge:border-white/60 transition-all duration-500 animate-border-pulse"></div>
                
                <div className="text-white flex-shrink-0 relative z-10">
                  <h3 
                    suppressHydrationWarning
                    className="text-4xl lg:text-5xl font-extrabold leading-none relative inline-block group-hover/badge:scale-110 transition-transform duration-300 animate-number-pulse pr-4 lg:pr-6"
                    style={{
                      animation: 'number-bounce 2s ease-in-out infinite',
                      textShadow: '0 0 20px rgba(255,255,255,0.5)',
                    }}>
                    <span className="inline-block animate-number-rotate">10</span>
                    <span className="absolute -top-2 -right-1 lg:-top-3 lg:-right-2 text-4xl lg:text-5xl xl:text-6xl font-bold animate-sparkle leading-none">+</span>
                  </h3>
                  <span className="text-white text-xs lg:text-sm font-semibold leading-tight block mt-1 group-hover/badge:scale-105 transition-transform duration-300 animate-text-shimmer"
                    style={{
                      animation: 'text-glow 2.5s ease-in-out infinite',
                    }}>
                  Years Experience
                </span>
                </div>
                <div 
                  ref={(el) => { if (el) iconRefs.current['experience-badge'] = el; }}
                  className="w-12 h-12 lg:w-16 lg:h-16 bg-white/20 rounded-full flex items-center justify-center icon-container icon-bg-animate icon-entrance icon-micro-move icon-float continuous-float flex-shrink-0 backdrop-blur-sm card-icon-animate group-hover/badge:bg-white/30 group-hover/badge:scale-110 transition-all duration-300 relative z-10"
                  style={{ 
                    animationDelay: '0.3s',
                    animation: 'icon-rotate 8s linear infinite, icon-pulse 2s ease-in-out infinite',
                  }}
                >
                  <HiOutlineBuildingOffice2 className="text-white icon-hover icon-glow icon-bounce icon-wiggle icon-full-color icon-scale-pulse group-hover/badge:rotate-12 transition-transform duration-300" style={{ width: '32px', height: '32px', fontWeight: 'bold' }} />
                  
                  {/* Rotating ring around icon */}
                  <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-spin-slow"></div>
                </div>
                
                {/* Floating particles effect */}
                <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                  <div className="absolute top-2 left-4 w-2 h-2 bg-white/40 rounded-full animate-particle-float" style={{ animationDelay: '0s' }}></div>
                  <div className="absolute top-6 right-6 w-1.5 h-1.5 bg-white/30 rounded-full animate-particle-float" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute bottom-4 left-8 w-1 h-1 bg-white/50 rounded-full animate-particle-float" style={{ animationDelay: '2s' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Company Introduction */}
          <div className="order-1 lg:order-2 w-full">
            {/* Company Introduction */}
            <div className="text-left mb-8">
              <p suppressHydrationWarning className={`text-[#F54927] font-bold uppercase tracking-wider text-sm mb-3 transition-all duration-700 delay-100 text-fade-in-up reveal-left ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              About Us
            </p>
              
              <h2 
                suppressHydrationWarning
                className={`font-extrabold text-gray-900 leading-tight mb-6 transition-all duration-700 delay-200 title-entrance text-shift ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{
                  fontSize: 'clamp(1rem, 2.5vw + 0.5rem, 2.25rem)',
                  whiteSpace: 'nowrap',
                }}
              >
                <span className="relative inline-block">
                  About{' '}
                  <span className="text-[#042970] relative gradient-text inline-block">
                    EF Architects & Engineers
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-[#F54927] animate-underline-expand"></span>
                  </span>
                </span>
            </h2>
              
              <p className={`text-gray-600 mb-6 leading-relaxed text-base lg:text-lg transition-all duration-700 delay-300 micro-float-up text-fade-in-up reveal-bottom ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
                EF Architects & Engineers Consulting Plc. is a Category I consulting firm established in 2015 GC by Engineer Endale Abdissa. 
                With extensive experience in the architecture and engineering sector, the company delivers professional architectural, engineering, 
                and construction management services across Ethiopia and internationally.
              </p>

              {/* Head Office */}
              <div className={`flex items-center gap-3 mb-8 p-4 bg-gradient-to-r from-[#F54927]/5 to-[#042970]/5 rounded-lg border-l-4 border-[#F54927] transition-all duration-700 delay-400 hover:shadow-lg hover:scale-[1.02] interactive-card-3d ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                <div className="w-12 h-12 bg-[#F54927]/10 rounded-full flex items-center justify-center icon-container icon-micro-move icon-float">
                  <HiOutlineMapPin className="text-[#F54927] text-xl icon-hover icon-glow icon-bounce" style={{ fontWeight: 'bold' }} />
                </div>
                <p className="text-gray-700 font-semibold text-sm lg:text-base">
                  Head Office: Yeka Sub-City, Wereda 09, Addis Ababa, Ethiopia
                </p>
              </div>
            </div>

            {/* Info Cards with icons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch mb-8">
              {/* Certified Professionals Card */}
              <div className={`bg-gradient-to-br from-white via-[#F54927]/5 to-white p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl shadow-xl border-2 border-[#F54927]/20 transition-all duration-700 delay-400 interactive-card-3d card-gradient-animated card-shadow-animated card-border-glow hover:border-[#F54927] hover:shadow-2xl card-colorful-1 card-shimmer ${
                mounted ? 'opacity-100 translate-y-0 reveal-left card-scroll-reveal revealed' : 'opacity-0 translate-y-10 card-scroll-reveal'
              }`}>
                <div className="flex flex-col sm:flex-row gap-4 group/card">
                  <div 
                    ref={(el) => { if (el) iconRefs.current['certified'] = el; }}
                    className="w-20 h-20 bg-gradient-to-br from-[#F54927]/20 to-[#F54927]/10 rounded-xl flex items-center justify-center flex-shrink-0 icon-container icon-bg-animate icon-entrance icon-micro-move icon-float continuous-float group-hover/card:bg-gradient-to-br group-hover/card:from-[#F54927]/30 group-hover/card:to-[#F54927]/20 transition-all duration-300 card-icon-animate mx-auto sm:mx-0"
                    style={{ animationDelay: '0.4s' }}
                  >
                    <HiOutlineAcademicCap className="text-[#F54927] icon-hover icon-glow icon-bounce icon-wiggle icon-scale-pulse icon-full-color" style={{ width: '48px', height: '48px', fontWeight: 'bold' }} />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center text-center sm:text-left">
                    <h4 className="font-extrabold text-gray-900 mb-2 text-lg lg:text-xl leading-[1.2] group-hover/card:text-[#F54927] transition-all duration-300 micro-float-up text-shift card-text-animate group-hover/card:font-black group-hover/card:text-glow-animate">
                    Certified Professionals
                  </h4>
                    <p className="text-gray-600 text-sm leading-relaxed micro-float-down card-lift-hover">
                      Licensed architects and engineers with recognized certifications and industry expertise.
                  </p>
                  </div>
                </div>
                </div>

              {/* Quality Services Card */}
              <div className={`bg-gradient-to-br from-white via-[#042970]/5 to-white p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl shadow-xl border-2 border-[#042970]/20 transition-all duration-700 delay-500 interactive-card-3d card-gradient-animated card-shadow-animated card-border-glow hover:border-[#042970] hover:shadow-2xl card-colorful-2 card-shimmer ${
                mounted ? 'opacity-100 translate-y-0 reveal-right card-scroll-reveal revealed' : 'opacity-0 translate-y-10 card-scroll-reveal'
                }`}>
                <div className="flex flex-col sm:flex-row gap-4 group/card">
                  <div 
                    ref={(el) => { if (el) iconRefs.current['quality'] = el; }}
                    className="w-20 h-20 bg-gradient-to-br from-[#F54927]/20 to-[#F54927]/10 rounded-xl flex items-center justify-center flex-shrink-0 icon-container icon-bg-animate icon-entrance icon-micro-move icon-float continuous-float group-hover/card:bg-gradient-to-br group-hover/card:from-[#F54927]/30 group-hover/card:to-[#F54927]/20 transition-all duration-300 card-icon-animate mx-auto sm:mx-0"
                    style={{ animationDelay: '0.5s' }}
                  >
                    <HiOutlineCheckBadge className="text-[#F54927] icon-hover icon-glow icon-bounce icon-wiggle icon-scale-pulse icon-full-color" style={{ width: '48px', height: '48px', fontWeight: 'bold' }} />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center text-center sm:text-left">
                    <h4 className="font-extrabold text-gray-900 mb-2 text-lg lg:text-xl leading-[1.2] group-hover/card:text-[#042970] transition-all duration-300 micro-float-up text-shift card-text-animate group-hover/card:font-black group-hover/card:text-glow-animate">
                    Quality Services
                  </h4>
                    <p className="text-gray-600 text-sm leading-relaxed micro-float-down card-lift-hover">
                      Comprehensive architectural design and structural engineering solutions.
                  </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
              </div>

        {/* What We Do Section */}
        <div suppressHydrationWarning className={`mb-16 transition-all duration-700 delay-600 ${
          mounted ? 'opacity-100 translate-y-0 reveal-bottom' : 'opacity-0 translate-y-10'
              }`}>
          <div className="text-center mb-10">
            <h3 suppressHydrationWarning className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3 title-entrance text-shift">
              What{' '}
              <span className="text-[#F54927] relative gradient-text">
                We Do
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#042970] animate-underline-expand"></span>
              </span>
            </h3>
            <p className="text-gray-600 text-base lg:text-lg max-w-2xl mx-auto micro-float-up">
              Comprehensive consulting services tailored to your project needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  ref={(el) => { if (el) iconRefs.current[`service-${index}`] = el; }}
                  className="bg-gradient-to-br from-white via-[#042970]/5 to-white p-6 rounded-2xl shadow-xl border-2 border-[#042970]/20 interactive-card-3d card-gradient-animated card-shadow-animated card-border-glow hover:border-[#042970] hover:shadow-2xl group card-colorful-2 card-shimmer transition-all duration-500"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-18 h-18 sm:w-16 sm:h-16 bg-gradient-to-br from-[#F54927]/20 to-[#F54927]/10 rounded-xl flex items-center justify-center flex-shrink-0 icon-container icon-bg-animate icon-entrance icon-micro-move icon-float continuous-float group-hover:bg-gradient-to-br group-hover:from-[#F54927]/30 group-hover:to-[#F54927]/20 transition-all duration-300 card-icon-animate mx-auto sm:mx-0">
                      <Icon className="text-[#F54927] icon-hover icon-glow icon-bounce icon-wiggle icon-scale-pulse icon-full-color" style={{ width: '44px', height: '44px', fontWeight: 'bold' }} />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="font-extrabold text-gray-900 mb-2 text-base lg:text-lg card-text-animate group-hover:text-[#042970] transition-all duration-300">{service.title}</h4>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{service.description}</p>
                      <Link 
                        href="/projects"
                        className="text-[#F54927] text-sm font-bold hover:text-[#042970] transition-all duration-300 inline-flex items-center gap-2 group/link hover:gap-3"
                      >
                        View Projects
                        <HiOutlineArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform icon-full-color" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vision, Mission, Goal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Vision */}
          <div className={`bg-gradient-to-br from-[#042970] via-[#042970] to-[#0a1a3a] p-8 rounded-2xl text-white shadow-2xl interactive-card-3d hover:shadow-[0_0_40px_rgba(4,41,112,0.4)] transition-all duration-700 delay-800 ${
            mounted ? 'opacity-100 translate-y-0 reveal-left card-scroll-reveal revealed' : 'opacity-0 translate-y-10 card-scroll-reveal'
          }`}>
            <div className="flex flex-col items-center text-center mb-6">
              <div 
                ref={(el) => { if (el) iconRefs.current['vision'] = el; }}
                className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 icon-container icon-bg-animate icon-entrance icon-micro-move icon-float continuous-float card-icon-animate"
              >
                <HiOutlineStar className="text-white icon-hover icon-glow icon-bounce icon-wiggle icon-scale-pulse icon-full-color" style={{ width: '44px', height: '44px', fontWeight: 'bold' }} />
              </div>
              <h4 className="text-2xl lg:text-3xl font-extrabold mb-4 title-entrance text-shift">Vision</h4>
            </div>
            <ul className="space-y-4 text-white/90">
              <li className="flex items-start gap-3 group/item">
                <div className="w-8 h-8 bg-[#F54927]/20 rounded-lg flex items-center justify-center flex-shrink-0 icon-container icon-micro-move mt-1">
                  <HiOutlineCheckBadge className="text-[#F54927] text-lg icon-hover icon-glow" style={{ fontWeight: 'bold' }} />
                </div>
                <span className="text-sm lg:text-base leading-relaxed card-text-animate">{'Deliver world-class engineering services that meet global and national standards'}</span>
              </li>
              <li className="flex items-start gap-3 group/item">
                <div className="w-8 h-8 bg-[#F54927]/20 rounded-lg flex items-center justify-center flex-shrink-0 icon-container icon-micro-move mt-1">
                  <HiOutlineCheckBadge className="text-[#F54927] text-lg icon-hover icon-glow" style={{ fontWeight: 'bold' }} />
                </div>
                <span className="text-sm lg:text-base leading-relaxed card-text-animate">{'Become a leading consulting firm in Ethiopia, providing innovative and reliable solutions'}</span>
              </li>
            </ul>
          </div>

          {/* Mission */}
          <div className={`bg-gradient-to-br from-[#F54927] via-[#F54927] to-[#d63e1f] p-8 rounded-2xl text-white shadow-2xl interactive-card-3d hover:shadow-[0_0_40px_rgba(245,73,39,0.4)] transition-all duration-700 delay-900 ${
            mounted ? 'opacity-100 translate-y-0 reveal-bottom card-scroll-reveal revealed' : 'opacity-0 translate-y-10 card-scroll-reveal'
          }`}>
            <div className="flex flex-col items-center text-center mb-6">
              <div 
                ref={(el) => { if (el) iconRefs.current['mission'] = el; }}
                className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 icon-container icon-bg-animate icon-entrance icon-micro-move icon-float continuous-float card-icon-animate"
              >
                <HiOutlineRocketLaunch className="text-white icon-hover icon-glow icon-bounce icon-wiggle icon-scale-pulse icon-full-color" style={{ width: '44px', height: '44px', fontWeight: 'bold' }} />
              </div>
              <h4 className="text-2xl lg:text-3xl font-extrabold mb-4 title-entrance text-shift">Mission</h4>
            </div>
            <ul className="space-y-4 text-white/90 mb-6">
              <li className="flex items-start gap-3 group/item">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 icon-container icon-micro-move mt-1">
                  <HiOutlineCheckBadge className="text-white text-lg icon-hover icon-glow" style={{ fontWeight: 'bold' }} />
                </div>
                <span className="text-sm lg:text-base leading-relaxed card-text-animate">{'Provide efficient, knowledgeable, and high-quality services to help clients achieve their goals'}</span>
              </li>
              <li className="flex items-start gap-3 group/item">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 icon-container icon-micro-move mt-1">
                  <HiOutlineCheckBadge className="text-white text-lg icon-hover icon-glow" style={{ fontWeight: 'bold' }} />
                </div>
                <span className="text-sm lg:text-base leading-relaxed card-text-animate">{'Utilize company resources effectively to exceed client expectations'}</span>
              </li>
            </ul>
            <div className="mt-6 text-center">
              <Link 
                href="/careers"
                className="inline-flex items-center gap-2 bg-white text-[#F54927] px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-110 group"
              >
                Join Us / Work With Us
                <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform icon-full-color" />
              </Link>
              </div>
            </div>

          {/* Goal */}
          <div className={`bg-gradient-to-br from-[#042970] via-[#042970] to-[#0a1a3a] p-8 rounded-2xl text-white shadow-2xl interactive-card-3d hover:shadow-[0_0_40px_rgba(4,41,112,0.4)] transition-all duration-700 delay-1000 ${
            mounted ? 'opacity-100 translate-y-0 reveal-right card-scroll-reveal revealed' : 'opacity-0 translate-y-10 card-scroll-reveal'
            }`}>
            <div className="flex flex-col items-center text-center mb-6">
              <div 
                ref={(el) => { if (el) iconRefs.current['goal'] = el; }}
                className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 icon-container icon-bg-animate icon-entrance icon-micro-move icon-float continuous-float card-icon-animate"
              >
                <HiOutlineArrowTrendingUp className="text-white icon-hover icon-glow icon-bounce icon-wiggle icon-scale-pulse icon-full-color" style={{ width: '44px', height: '44px', fontWeight: 'bold' }} />
              </div>
              <h4 className="text-2xl lg:text-3xl font-extrabold mb-4 title-entrance text-shift">Goal</h4>
            </div>
            <p className="text-white/90 text-center mb-8 text-base lg:text-lg leading-relaxed card-text-animate">
              Build a company that fully satisfies clients and empowers its staff
            </p>
            <div className="text-center">
              <Link 
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#F54927] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#d63e1f] transition-all duration-300 hover:shadow-xl hover:scale-110 group"
              >
                Contact Us / Request Consultation
                <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform icon-full-color" />
              </Link>
            </div>
          </div>
        </div>

        {/* Company Objectives Section - Redesigned */}
        <div suppressHydrationWarning className={`mt-16 md:mt-20 lg:mt-24 mb-20 md:mb-24 transition-all duration-700 delay-1100 ${
          mounted ? 'opacity-100 translate-y-0 reveal-bottom' : 'opacity-0 translate-y-10'
        }`}>
          {/* Title and Subtitle - Top Center - Interactive */}
          <div className="text-center mb-6 md:mb-8 group/header">
            <h3 suppressHydrationWarning className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 mb-3 md:mb-4 title-entrance text-shift group-hover/header:scale-105 transition-transform duration-300">
              Company{' '}
              <span className="text-[#F54927] relative inline-block group-hover/header:text-[#042970] transition-colors duration-300">
                Objectives
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#042970] animate-underline-expand group-hover/header:bg-[#F54927] transition-colors duration-300"></span>
              </span>
            </h3>
            <div className="max-w-3xl mx-auto">
              <p className="text-gray-700 text-base md:text-lg lg:text-xl font-semibold leading-relaxed group-hover/header:text-gray-800 transition-colors duration-300">
              Our commitment to excellence and continuous improvement
              </p>
            </div>
          </div>

          {/* Main Layout - Content and Image Side by Side - Redesigned */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10 items-center max-h-[70vh]">
            {/* Left Side - Objectives Cards */}
            <div className="w-full flex flex-col justify-center order-2 lg:order-1">

              {/* Objectives Grid - Well-Placed Interactive Design */}
              <div className="grid grid-cols-1 gap-3 md:gap-4 overflow-hidden rounded-xl md:rounded-2xl shadow-lg md:shadow-xl overflow-hidden">
            {[
              {
                text: 'We will provide consistent services that meet customer and applicable regulatory requirements.',
                gradient: 'from-[#F54927] via-[#F54927] to-[#d63e1f]'
              },
              {
                text: 'To provide a quality consultancy service saving our clients\' money & time.',
                gradient: 'from-[#042970] via-[#042970] to-[#0a1a3a]'
              },
              {
                text: 'We will achieve 100% customer satisfaction through the intensive application and maintenance of the quality management system by the end of 2023.',
                gradient: 'from-[#10B981] via-[#059669] to-[#047857]'
              },
              {
                text: 'We will provide training for all the company employees every six months starting September 2022 and we will evaluate its contribution to the company.',
                gradient: 'from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9]'
              }
            ].map((item, index) => {
              return (
                <Reveal key={index} variant="up" delay={1200 + (index * 100)}>
                  <div 
                    onMouseEnter={() => setHoveredItem(`objective-${index}`)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`relative group/card h-auto transition-all duration-300 cursor-pointer ${
                      hoveredItem === `objective-${index}` 
                        ? 'z-10 transform-gpu scale-[1.02]' 
                        : 'hover:scale-[1.01] transform-gpu'
                    }`}
                  >
                    {/* Card Background - Colorful Gradient - Well-Placed Design */}
                    <div className={`relative h-auto p-3 md:p-4 lg:p-5 overflow-hidden transition-all duration-300 bg-gradient-to-br ${item.gradient} text-white max-w-full rounded-lg md:rounded-xl shadow-md md:shadow-lg ${
                      hoveredItem === `objective-${index}` 
                        ? 'shadow-xl md:shadow-2xl shadow-[#F54927]/50 ring-2 ring-white/40 scale-[1.02] z-10' 
                        : 'hover:shadow-lg md:hover:shadow-xl hover:scale-[1.01]'
                    }`}>
                      {/* Animated Background Pattern */}
                      <div className={`absolute inset-0 opacity-10 transition-opacity duration-300 ${
                        hoveredItem === `objective-${index}` ? 'opacity-25' : 'group-hover/card:opacity-15'
                      }`}>
                        <div className="absolute inset-0" style={{
                          backgroundImage: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0.1) 50%, transparent 50%)`,
                          backgroundSize: '20px 20px',
                          animation: hoveredItem === `objective-${index}` ? 'pulse 2s ease-in-out infinite' : 'none'
                        }}></div>
        </div>

                      {/* Number Badge - Left Side - Well-Placed */}
                      <div className={`absolute top-3 md:top-4 left-3 md:left-4 w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center font-extrabold text-sm md:text-base transition-all duration-300 bg-white/30 backdrop-blur-sm shadow-lg ${
                        hoveredItem === `objective-${index}` 
                          ? 'scale-125 rotate-12 bg-white/60 shadow-xl ring-2 ring-white/70' 
                          : 'group-hover/card:scale-110 group-hover/card:rotate-6 group-hover/card:bg-white/40'
                      }`}>
                        {index + 1}
          </div>
                      
                      {/* Content - Well-Placed Font Size */}
                      <div className="relative z-10 pl-12 md:pl-14 lg:pl-16 pr-3">
                        <p className={`text-sm md:text-base lg:text-lg leading-relaxed transition-all duration-300 text-white ${
                          hoveredItem === `objective-${index}` 
                            ? 'font-bold' 
                            : 'font-medium group-hover/card:font-semibold'
                        }`}>
                          {item.text}
              </p>
            </div>

                      {/* Hover Effect - Shine Animation */}
                      <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none ${
                        hoveredItem === `objective-${index}` ? 'opacity-100' : 'group-hover/card:opacity-100'
                      }`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover/card:translate-x-[200%] transition-transform duration-1000 ease-in-out"></div>
                      </div>
                      
                      {/* Interactive Border Glow */}
                      <div className={`absolute inset-0 rounded-lg md:rounded-xl border-2 transition-all duration-300 ${
                        hoveredItem === `objective-${index}` 
                          ? 'border-white/60 shadow-[0_0_25px_rgba(255,255,255,0.3)]' 
                          : 'border-transparent group-hover/card:border-white/30'
                      }`}></div>
                      
                      {/* Glow Effect - Enhanced */}
                      <div className={`absolute -inset-1 opacity-0 transition-opacity duration-300 blur-xl ${
                        hoveredItem === `objective-${index}` ? 'opacity-60' : 'group-hover/card:opacity-30'
                      }`} style={{
                        background: `linear-gradient(135deg, ${item.gradient.includes('#F54927') ? '#F54927' : item.gradient.includes('#042970') ? '#042970' : item.gradient.includes('#10B981') ? '#10B981' : '#8B5CF6'}, transparent)`
                      }}></div>
                      
                      {/* Ripple Effect on Click */}
                      <div className={`absolute inset-0 rounded-lg opacity-0 transition-opacity duration-500 ${
                        hoveredItem === `objective-${index}` ? 'opacity-20' : ''
                      }`}>
                        <div className="absolute inset-0 bg-white/20 animate-ping"></div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

            {/* Right Side - Image - Well-Placed Design */}
            <div className="flex justify-center lg:justify-end items-center order-1 lg:order-2 h-full">
              <div className="relative w-full max-w-md lg:max-w-lg h-auto flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl md:rounded-2xl shadow-lg md:shadow-xl p-4 md:p-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                <Image
                  src="/images/objective.webp"
                  alt="Company Objectives"
                  width={500}
                  height={600}
                  className="w-full h-auto max-h-[65vh] object-contain object-center rounded-lg md:rounded-xl"
                  priority={false}
                  loading="lazy"
                  quality={85}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
