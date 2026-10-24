'use client';
import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  HiOutlineBuildingOffice2, 
  HiOutlineCog6Tooth, 
  HiOutlineWrenchScrewdriver,
  HiOutlineHomeModern,
  HiOutlineCube,
  HiOutlinePaintBrush
} from "react-icons/hi2";
import axios from 'axios';
import Link from 'next/link';
import Reveal from './Reveal';
import { useOwnedScrollAnimations } from '../lib/scrollAnimations';

const ServicesSection = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  useOwnedScrollAnimations(sectionRef, [loading, error, services.length]);
  const iconRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const apiCall = axios.create({
    baseURL: 'https://api.efengineering-architect.com/api/',
    headers: {
      "Content-Type": "application/json"
    }
  });

  const getServiceImageUrl = useCallback((service: any) => {
    if (service.image_url) return service.image_url;
    if (service.image) return service.image;
    if (service.photo) return service.photo;
    if (service.photos?.length) return service.photos[0];
    if (service.image_urls?.length) return service.image_urls[0];
    return '/images/services/default.jpg';
  }, []);

  const getServiceIcon = useCallback((service: any, index: number) => {
    const title = (service.title || "").toLowerCase();
    const iconClass = "text-[#F54927]";
    const icons = [
      <HiOutlineBuildingOffice2 className={iconClass} style={{ width: '48px', height: '48px', fontWeight: 'bold' }} />,
      <HiOutlineCog6Tooth className={iconClass} style={{ width: '48px', height: '48px', fontWeight: 'bold' }} />,
      <HiOutlineWrenchScrewdriver className={iconClass} style={{ width: '48px', height: '48px', fontWeight: 'bold' }} />,
      <HiOutlineHomeModern className={iconClass} style={{ width: '48px', height: '48px', fontWeight: 'bold' }} />,
      <HiOutlineCube className={iconClass} style={{ width: '48px', height: '48px', fontWeight: 'bold' }} />,
      <HiOutlinePaintBrush className={iconClass} style={{ width: '48px', height: '48px', fontWeight: 'bold' }} />
    ];

    if (title.includes("design") && title.includes("interior")) return icons[5];
    if (title.includes("design")) return icons[3];
    if (title.includes("construction") || title.includes("contracting")) return icons[0];
    if (title.includes("renovation")) return icons[2];
    if (title.includes("architecture") || title.includes("building")) return icons[0];
    if (title.includes("engineering")) return icons[1];
    return icons[index % icons.length];
  }, []);

  const createThreeLineDescription = (description: string) => {
    if (!description) return "Professional service tailored to your specific needs.";
    const stripped = description.replace(/<[^>]*>/g, '');
    return stripped.length <= 100 ? stripped : stripped.substring(0, 100) + '...';
  };

  useEffect(() => {
    const fetchServices = async (retryCount = 0) => {
      const MAX_RETRIES = 2;
      const RETRY_DELAY = 1000; // 1 second

      try {
        setLoading(true);
        setError(false);

        const response = await apiCall.get("services", {
          timeout: 10000, // 10 second timeout
          headers: {
            'Accept': 'application/json',
          }
        });

        if (response.status === 200) {
          const data = response.data as any;
          // Handle both array and object with data property
          const servicesArray = Array.isArray(data) ? data : (data?.data || []);
          if (servicesArray.length > 0) {
            setServices(servicesArray);
          } else {
            console.warn("Services API returned empty array");
            setError(true);
          }
        } else {
          console.error("Services API returned non-200 status:", response.status);
          setError(true);
        }
      } catch (err: any) {
        console.error("Error fetching services:", err);
        
        // Retry logic for network errors
        const isNetworkError = err.code === 'NETWORK_ERROR' || 
                              err.code === 'ECONNABORTED' ||
                              err.message === 'Network Error' || 
                              err.message === 'timeout of 10000ms exceeded' ||
                              !err.response;
        
        if (retryCount < MAX_RETRIES && isNetworkError) {
          console.log(`Retrying services fetch (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
          setTimeout(() => {
            fetchServices(retryCount + 1);
          }, RETRY_DELAY * (retryCount + 1));
          return;
        }

        if (err.response) {
          console.error("Response status:", err.response.status);
          console.error("Response data:", err.response.data);
        }
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

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

            // Apply micro-movements to service icons (works both directions)
            const directionMultiplier = scrollDirection === 'down' ? 1 : -1;
            Object.keys(iconRefs.current).forEach((key, index) => {
              const iconRef = iconRefs.current[parseInt(key)];
              if (iconRef) {
                const offset = Math.sin(scrollProgress * Math.PI * 2 + (index * Math.PI / 3)) * 6 * directionMultiplier;
                iconRef.style.setProperty('--scroll-offset', `${offset}px`);
              }
            });

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
  }, [services]);

  if (loading) {
    return (
      <section ref={sectionRef} data-bind-own-animations className="bg-[#f8f8f8] py-20 engineering-bg">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[#F54927] uppercase tracking-wide font-bold mb-3 text-sm">Our Services</p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900">Explore Our Services</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="w-full h-[300px] bg-gray-300"></div>
                <div className="pt-10 pb-8 px-6">
                  <div className="h-6 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || services.length === 0) {
    return (
      <section ref={sectionRef} data-bind-own-animations className="bg-[#f8f8f8] py-20 engineering-bg">
        <div className="container mx-auto px-6 text-center">
          <p className="text-[#F54927] uppercase tracking-wide font-bold mb-3 text-sm">Our Services</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">Explore Our Services</h2>
          <p className="text-gray-600 text-lg">No services available at the moment. Please check back later.</p>
        </div>
      </section>
    );
  }

  const displayedServices = services.slice(0, 6);
  const colors = [
    { bg: '#F54927', hover: '#042970' },
    { bg: '#042970', hover: '#F54927' },
    { bg: '#F54927', hover: '#042970' },
    { bg: '#042970', hover: '#F54927' },
    { bg: '#F54927', hover: '#042970' },
    { bg: '#042970', hover: '#F54927' }
  ];

  return (
    <section ref={sectionRef} data-bind-own-animations data-scroll-section className="bg-[#f8f8f8] py-24 md:py-32 engineering-bg relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 border-2 border-[#F54927]/10 rounded-full animate-float shape-float-x hidden lg:block"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 border-2 border-[#042970]/10 rounded-lg rotate-45 animate-float-reverse shape-float-x hidden lg:block" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 right-1/4 w-12 h-12 border-2 border-[#F54927]/5 rounded-full continuous-float hidden lg:block" style={{ animationDelay: '2s' }}></div>
      
      {/* Motion lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#F54927]/20 to-transparent motion-line hidden lg:block"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <Reveal>
          <div className="text-center mb-16">
            <p className="text-[#F54927] uppercase tracking-wider font-bold mb-3 text-sm text-fade-in-up reveal-left">Our Services</p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 title-entrance text-shift">
              Explore Our{' '}
              <span className="text-[#042970] relative gradient-text">
                Services
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#F54927] animate-underline-expand"></span>
              </span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto micro-float-up text-fade-in-up reveal-bottom">
              Comprehensive engineering and architectural solutions tailored to your needs, 
              delivered with precision, innovation, and unwavering commitment to excellence.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedServices.map((service: any, i: number) => {
            const colorScheme = colors[i % colors.length];
            return (
              <Reveal key={service.id} delay={i * 100}>
                <div 
                  className="bg-white rounded-xl shadow-lg overflow-hidden text-center flex flex-col h-full interactive-card-3d card-gradient-animated card-shadow-animated card-border-glow group"
                  onMouseEnter={() => setHoveredCard(service.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="relative w-full h-[320px] overflow-hidden">
                    <img
                      src={getServiceImageUrl(service)}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
                      <div 
                        ref={(el) => { if (el) iconRefs.current[service.id] = el; }}
                        className="w-20 h-20 flex items-center justify-center rounded-xl shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 icon-container icon-bg-animate icon-entrance icon-micro-move"
                        style={{ 
                          backgroundColor: hoveredCard === service.id ? colorScheme.hover : colorScheme.bg,
                          animationDelay: `${i * 0.1}s`
                        }}
                      >
                        <div className="icon-glow icon-bounce icon-wiggle icon-scale-pulse icon-float continuous-float flex items-center justify-center w-full h-full card-icon-animate">
                          <div style={{ width: '48px', height: '48px', color: '#F54927', fontWeight: 'bold' }} className="icon-full-color">
                            {getServiceIcon(service, i)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                      <div className="pt-12 pb-8 px-6 flex flex-col justify-between gap-6 flex-grow">
                        <div className="text-center">
                          <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-[#F54927] transition-colors text-shift micro-float-up card-text-animate">
                            {service.title}
                          </h3>
                          <p className="text-gray-600 text-base leading-relaxed line-clamp-3 micro-float-down card-lift-hover">
                            {createThreeLineDescription(service.description)}
                          </p>
                        </div>
                    <Link 
                      href={`/services/${service.id}`}
                      className="text-sm font-bold uppercase tracking-wide text-white px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 inline-flex items-center justify-center gap-2 group/btn"
                      style={{ 
                        backgroundColor: colorScheme.bg 
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colorScheme.hover;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = colorScheme.bg;
                      }}
                    >
                      READ MORE
                      <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
