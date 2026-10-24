"use client";
import React, { useEffect, useRef, useState } from 'react';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2';
import Reveal from './Reveal';
import { fetchApi } from '../lib/api';
import { useOwnedScrollAnimations } from '../lib/scrollAnimations';

type Client = {
  id: number | string;
  name?: string;
  title?: string;
  logo?: string;
  logo_url?: string;
  category?: string;
};

const formatImageUrl = (imagePath?: string) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/api/')) return `https://api.efengineering-architect.com${imagePath}`;
  if (imagePath.startsWith('/')) return `https://api.efengineering-architect.com${imagePath}`;
  return `https://api.efengineering-architect.com/api/${imagePath}`;
};

const ClientsSection = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const autoScrollId = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  useOwnedScrollAnimations(sectionRef, [clients.length, loading]);

  useEffect(() => {
    const loadClients = async () => {
      setLoading(true);
      try {
        const data = await fetchApi<Client[]>('clients', { cache: 'no-store' });
        
        // Handle different response structures
        let clientsArray: Client[] = [];
        if (Array.isArray(data)) {
          clientsArray = data;
        } else if (data && typeof data === 'object' && 'data' in data) {
          clientsArray = Array.isArray((data as any).data) ? (data as any).data : [];
        }
        
        // Filter by category if needed, but don't filter if no clients match
        const onlyClients = clientsArray.filter((c: Client) => {
          const category = (c.category || '').toLowerCase();
          return category === 'client' || category === '' || !c.category;
        });
        
        // Use filtered clients if we have any, otherwise use all
        const finalClients = onlyClients.length > 0 ? onlyClients : clientsArray;
        
        console.log('Clients loaded:', finalClients.length); // Debug log
        setClients(finalClients);
      } catch (e: any) {
        console.error('Failed to load clients:', e);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadClients();
  }, []);

  const startAutoScroll = () => {
    stopAutoScroll();
    if (clients.length === 0 || isPaused) return;
    
    const scrollContainer = scrollerRef.current;
    if (!scrollContainer) {
      setTimeout(startAutoScroll, 100);
      return;
    }

    // Smooth auto-scroll - faster speed
    const scrollSpeed = 1.3; // pixels per frame (smooth and faster)
    let lastTime = performance.now();
    let scrollPosition = scrollContainer.scrollLeft;

    const animate = (currentTime: number) => {
      if (!scrollContainer || clients.length === 0 || isPaused) {
        stopAutoScroll();
        return;
      }
      
      const elapsed = currentTime - lastTime;
      lastTime = currentTime;
      
      // Normalize to 60fps for consistent smooth scrolling
      const frameTime = Math.min(elapsed, 16.67); // Cap at 60fps
      const scrollAmount = scrollSpeed * (frameTime / 16.67);
      scrollPosition += scrollAmount;
      
      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      
      // Infinite scroll logic - seamless loop with smooth reset
      if (scrollPosition >= maxScroll - 10) {
        // Smooth reset to beginning for seamless infinite scroll
        scrollPosition = scrollPosition - maxScroll;
        scrollContainer.scrollLeft = scrollPosition;
      } else {
        // Use requestAnimationFrame for smooth scrolling
        scrollContainer.scrollLeft = scrollPosition;
      }
      
      autoScrollId.current = requestAnimationFrame(animate);
    };
    
    autoScrollId.current = requestAnimationFrame(animate);
  };

  const stopAutoScroll = () => {
    if (autoScrollId.current !== null) {
      cancelAnimationFrame(autoScrollId.current);
      autoScrollId.current = null;
    }
  };

  useEffect(() => {
    if (clients.length > 0 && !loading) {
      // Start auto-scroll after a short delay to ensure DOM is ready
      const startTimer = setTimeout(() => {
        if (scrollerRef.current) {
          // Initialize scroll position
          scrollerRef.current.scrollLeft = 0;
          // Start auto-scroll if not paused
          if (!isPaused) {
            startAutoScroll();
          }
        }
      }, 500);
      
      const handleResize = () => {
        stopAutoScroll();
        setTimeout(() => {
          if (clients.length > 0 && !isPaused && scrollerRef.current) {
            startAutoScroll();
          }
        }, 300);
      };
      
      // Restart auto-scroll when pause state changes
      if (!isPaused && scrollerRef.current) {
        startAutoScroll();
      }
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        clearTimeout(startTimer);
        window.removeEventListener('resize', handleResize);
        stopAutoScroll();
      };
    }
    return () => {
      stopAutoScroll();
    };
  }, [clients.length, loading, isPaused]);

  const handleMouseEnter = () => {
    setIsPaused(true);
    stopAutoScroll();
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    if (clients.length > 0 && scrollerRef.current) {
      // Restart auto-scroll after mouse leaves
      setTimeout(() => {
        if (!isPaused && scrollerRef.current) {
          startAutoScroll();
        }
      }, 200);
    }
  };

  const scrollByAmount = (direction: number) => {
    const el = scrollerRef.current;
    if (!el || clients.length === 0) return;
    
    // Stop auto-scroll when manually scrolling
    stopAutoScroll();
    setIsPaused(true);
    
    // Calculate scroll distance based on card width
    const cardWidth = 160; // Base card width (lg breakpoint)
    const gap = 32; // Gap between cards (lg:gap-8 = 32px)
    const scrollDistance = (cardWidth + gap) * (direction > 0 ? 1 : -1);
    
    el.scrollBy({ left: scrollDistance, behavior: 'smooth' });
    
    // Resume auto-scroll after a delay
    setTimeout(() => {
      setIsPaused(false);
      if (clients.length > 0 && !isPaused) {
        startAutoScroll();
      }
    }, 3000);
  };

  // Duplicate clients for seamless infinite scroll
  const duplicatedClients = clients.length > 0 ? [...clients, ...clients, ...clients] : [];

  return (
    <section ref={sectionRef} data-bind-own-animations data-scroll-section className="py-12 md:py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#F54927]/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#042970]/5 rounded-full blur-3xl animate-float-reverse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#F54927]/5 to-[#042970]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-6 relative z-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-3 relative z-20 inline-block group cursor-default">
            <span className="bg-gradient-to-r from-[#F54927] via-[#042970] to-[#F54927] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift hover:scale-105 transition-transform duration-300 inline-block">
              Our Clients
            </span>
            <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-[#F54927] to-[#042970] group-hover:w-full transition-all duration-500 ease-in-out"></span>
          </h1>
          <Reveal>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2 title-scroll-reveal relative z-20">
              Trusted by{' '}
              <span className="text-[#042970] relative gradient-text">
                Industry Leaders
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#F54927] animate-underline-expand"></span>
              </span>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-3 relative z-20">
              We're proud to work with leading organizations across various industries.
            </p>
          </Reveal>
        </div>


        {/* Auto-Scrolling Carousel Container */}
        <div 
          ref={containerRef}
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Left Arrow - Centered Vertically */}
          <button
            onClick={() => scrollByAmount(-1)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white shadow-xl hover:bg-[#042970] hover:text-white rounded-full transition-all duration-300 hover:scale-110 group border-2 border-gray-200 hover:border-[#042970]"
            aria-label="Scroll left"
          >
            <HiOutlineChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700 group-hover:text-white transition-transform group-hover:-translate-x-1" />
          </button>

          {/* Right Arrow - Centered Vertically */}
          <button
            onClick={() => scrollByAmount(1)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-[#F54927] text-white shadow-xl hover:bg-[#042970] rounded-full transition-all duration-300 hover:scale-110 group border-2 border-[#F54927] hover:border-[#042970]"
            aria-label="Scroll right"
          >
            <HiOutlineChevronRight className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Gradient Fade Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 via-gray-50/80 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent z-10 pointer-events-none"></div>

          <div
            ref={scrollerRef}
            className="overflow-x-auto scrollbar-hide px-12 md:px-16"
            style={{ 
              scrollSnapType: 'none', // Disable snap for smoother auto-scroll
              WebkitOverflowScrolling: 'touch',
              scrollBehavior: 'auto' // Use auto for programmatic scrolling
            }}
          >
            <div className="flex items-center gap-4 md:gap-6 lg:gap-8 py-6 px-4" style={{ minWidth: 'max-content' }}>
              {loading ? (
                // Loading skeleton - minimized size
                Array.from({ length: 12 }).map((_, idx) => (
                  <div
                    key={`loading-${idx}`}
                    className="flex-none w-[120px] md:w-[140px] lg:w-[160px] h-[120px] md:h-[140px] lg:h-[160px] bg-gray-200 rounded-xl animate-pulse"
                  />
                ))
              ) : clients.length > 0 ? (
                duplicatedClients.map((client, idx) => {
                  const baseIndex = idx % clients.length;
                  const src = formatImageUrl(client.logo_url || client.logo);
                  const name = client.name || client.title || 'Client';
                  const isHovered = hoveredIndex === idx;
                  
                  return (
                    <div
                      key={`client-${client.id || baseIndex}-${idx}`}
                      className="flex-none transition-all duration-500 ease-out"
                      style={{
                        scrollSnapAlign: 'center',
                        scrollSnapStop: 'always'
                      }}
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <div 
                        className={`
                          w-[120px] md:w-[140px] lg:w-[160px] 
                          h-[120px] md:h-[140px] lg:h-[160px]
                          rounded-xl overflow-hidden relative
                          transition-all duration-500 ease-out
                          bg-white shadow-md
                          ${isHovered 
                            ? 'shadow-xl scale-110 border-2 border-[#F54927] ring-2 ring-[#F54927]/30' 
                            : 'hover:shadow-lg hover:scale-105 border border-gray-200'
                          }
                        `}
                      >
                        {/* Animated Background Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-500 ${
                          isHovered 
                            ? 'opacity-100 from-[#F54927]/10 via-[#042970]/10 to-[#F54927]/5' 
                            : 'opacity-0'
                        }`}></div>

                        {/* Glow Effect */}
                        {isHovered && (
                          <div className="absolute inset-0 bg-gradient-to-br from-[#F54927]/20 to-[#042970]/20 blur-lg -z-10"></div>
                        )}

                        {/* Logo Image */}
                        {src ? (
                          <div className="relative w-full h-full flex items-center justify-center p-3 md:p-4 lg:p-5">
                            <img 
                              src={src} 
                              alt={name} 
                              className={`w-full h-full object-contain transition-all duration-500 ${
                                isHovered ? 'scale-110 brightness-110' : 'scale-100'
                              }`}
                              onError={(e: any) => {
                                (e.target as HTMLImageElement).src = '/images/logo/newlogo.png';
                              }} 
                              loading={idx < 12 ? "eager" : "lazy"}
                              decoding="async"
                              fetchPriority={idx < 6 ? "high" : "auto"}
                            />
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium px-2 text-center">
                            {name}
                          </div>
                        )}

                        {/* Hover Overlay */}
                        {isHovered && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
                        )}

                        {/* Shine Effect */}
                        {isHovered && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] animate-shine pointer-events-none"></div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="w-full text-center py-12 min-w-full">
                  <p className="text-gray-500 text-lg">No clients found</p>
                  <p className="text-gray-400 text-sm mt-2">Loading clients from API...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Indicator - Compact */}
        {clients.length > 0 && (
          <Reveal variant="up" delay={300}>
            <div className="flex justify-center items-center gap-1.5 mt-8">
              {clients.slice(0, Math.min(clients.length, 15)).map((_, idx) => (
                <div
                  key={idx}
                  className="h-1.5 rounded-full transition-all duration-300 bg-gray-200 hover:bg-[#F54927] cursor-pointer"
                  style={{
                    width: idx === Math.floor((hoveredIndex ?? 0) % clients.length) ? '20px' : '6px',
                    backgroundColor: idx === Math.floor((hoveredIndex ?? 0) % clients.length) ? '#F54927' : undefined
                  }}
                />
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
};

export default ClientsSection;
