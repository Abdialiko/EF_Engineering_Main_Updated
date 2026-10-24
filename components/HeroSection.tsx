'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FaProjectDiagram, FaTools, FaEnvelope, FaPhone, FaArrowRight } from 'react-icons/fa';

const HeroSection = () => {
  // Slides: Video (1.mp4) at index 0, then images 2.webp to 13.webp (12 images)
  // Available images: 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 (12 images)
  const heroImages = [
    '/images/hero/2.webp',
    '/images/hero/3.webp',
    '/images/hero/4.webp',
    '/images/hero/5.webp',
    '/images/hero/6.webp',
    '/images/hero/7.webp',
    '/images/hero/8.webp',
    '/images/hero/9.webp',
    '/images/hero/10.webp',
    '/images/hero/11.webp',
    '/images/hero/12.webp',
    '/images/hero/13.webp'
  ];
  const totalSlides = 13; // 1 video + 12 images

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0); // Start with video first
  const [videoEnded, setVideoEnded] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const buttonRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
  const [buttonHovered, setButtonHovered] = useState<{ [key: string]: boolean }>({});
  const [mousePos, setMousePos] = useState<{ [key: string]: { x: number; y: number } }>({});
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // All titles: Video slide 0, then image slides 1-12 (13 slides total)
  const titles = [
    "ENGINEERING EXCELLENCE", // Video slide (index 0)
    "Architectural Vision", // Image slide 1 (image 2.webp)
    "Structural Integrity", // Image slide 2 (image 3.webp)
    "Smart Design Process", // Image slide 3 (image 4.webp)
    "Urban Innovation", // Image slide 4 (image 5.webp)
    "Precision in Every Detail", // Image slide 5 (image 6.webp)
    "Sustainable Engineering", // Image slide 6 (image 7.webp)
    "Collaborative Design", // Image slide 7 (image 8.webp)
    "Future-Driven Engineering", // Image slide 8 (image 9.webp)
    "Digital Transformation", // Image slide 9 (image 10.webp)
    "Innovation at Core", // Image slide 10 (image 11.webp)
    "Your Vision, Our Blueprint", // Image slide 11 (image 12.webp)
    "Engineering Excellence" // Image slide 12 (image 13.webp)
  ];

  // All subtitles: Video slide 0, then image slides 1-12 (13 slides total)
  const subtitles = [
    "Innovative solutions that define modern infrastructure.", // Video slide (index 0)
    "Blending art and engineering to shape sustainable cities.", // Image slide 1
    "Building strength through technology and expertise.", // Image slide 2
    "Every blueprint engineered for performance and efficiency.", // Image slide 3
    "Transforming landscapes with intelligent design systems.", // Image slide 4
    "Engineering that speaks reliability and clarity.", // Image slide 5
    "Creating a balance between progress and the environment.", // Image slide 6
    "Integrating architects, engineers, and visionaries.", // Image slide 7
    "Building smarter, safer, and more resilient systems.", // Image slide 8
    "Empowering design through cutting-edge 3D technology.", // Image slide 9
    "Driven by ideas that redefine engineering excellence.", // Image slide 10
    "Partnering to create lasting impact and value.", // Image slide 11
    "Innovative solutions that define modern infrastructure." // Image slide 12
  ];

  // Preload ALL images for performance - prevents white flash
  const preloadAllImages = useCallback(() => {
    heroImages.forEach((imageUrl, index) => {
      if (!loadedImages.has(index)) {
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
          setLoadedImages((prev) => new Set([...prev, index]));
        };
        img.onerror = () => {
          console.error(`Failed to preload image: ${imageUrl}`);
        };
      }
    });
  }, [heroImages, loadedImages]);

  // Preload specific images (for incremental loading if needed)
  const preloadImages = useCallback((indices: number[]) => {
    indices.forEach((index) => {
      if (!loadedImages.has(index) && index < heroImages.length) {
        const img = new Image();
        img.src = heroImages[index];
        img.onload = () => {
          setLoadedImages((prev) => new Set([...prev, index]));
        };
      }
    });
  }, [heroImages, loadedImages]);

  // Preload ALL images immediately on mount to prevent white flash
  useEffect(() => {
    // Start preloading immediately when component mounts
    preloadAllImages();
    
    // Also preload images with high priority using link tags
    const linkElements: HTMLLinkElement[] = [];
    heroImages.forEach((imageUrl, index) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = imageUrl;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
      linkElements.push(link);
    });
    
    // Cleanup: remove link tags on unmount
    return () => {
      linkElements.forEach(link => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    };
  }, [preloadAllImages, heroImages]);

  // Start slideshow - video first, then all images, then loop back to video
  const startSlideshow = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      setCurrentSlideIndex((prev) => {
        // If on video slide (0), wait for video to end (handled separately)
        if (prev === 0) {
          return prev; // Stay on video until it ends
        }
        
        // On image slides (1-12): advance sequentially
        if (prev >= 1 && prev < 12) {
          const next = prev + 1;
          const imageIndex = next - 1;
          preloadImages([
            imageIndex,
            imageIndex < heroImages.length - 1 ? imageIndex + 1 : 0,
          ]);
          return next;
        }
        
        // After last image (slide 12), loop back to video (slide 0)
        if (prev === 12) {
          // Clear interval so video can play fully before slideshow continues
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          // Reset video state for replay
          setVideoEnded(false);
          const video = videoRef.current;
          if (video) {
            video.currentTime = 0;
          }
          return 0; // Loop back to video
        }
        
        return prev;
      });
    }, 3500); // 3.5 seconds per slide (3-4 second range)
  }, [preloadImages, heroImages.length]);

  // Show buttons immediately when component mounts (visible on video and all images)
  useEffect(() => {
    // Show buttons with animation immediately
    const timer = setTimeout(() => {
      setButtonsVisible(true);
    }, 500); // Small delay for entrance animation after page load
    
    return () => clearTimeout(timer);
  }, []);

  // Handle video end - after video plays, move to first image and start slideshow
  useEffect(() => {
    if (videoEnded && currentSlideIndex === 0) {
      // Wait a small delay to ensure video fully ended, then move to first image
      const timer = setTimeout(() => {
        // Move to first image slide (index 1) after video fully ends
        setCurrentSlideIndex(1);
        // Start slideshow for all images (will loop back to video)
        startSlideshow();
      }, 300); // Small delay to ensure clean transition
      
      return () => clearTimeout(timer);
    }
  }, [videoEnded, currentSlideIndex, startSlideshow]);

  // Handle video ended - ensures video plays FULLY before proceeding
  const handleVideoEnd = () => {
    const video = videoRef.current;
    // Double check video actually ended
    if (video && video.ended && video.currentTime >= video.duration - 0.1) {
      setVideoEnded(true);
    }
  };

  // Handle video play - Video autoplays first on mount
  useEffect(() => {
    const video = videoRef.current;
    if (video && currentSlideIndex === 0 && !videoEnded) {
      // Set video attributes for immediate playback
      video.muted = true;
      video.playsInline = true;
      
      // Reset video for fresh playback
      video.currentTime = 0;
      setVideoEnded(false);
      
      // Attempt to play the video
      const playVideo = async () => {
        try {
          await video.play();
        } catch (error) {
          // Auto-play may fail in some browsers, try loading first
          video.load();
          try {
            await video.play();
          } catch (retryError) {
            console.log('Video autoplay failed:', retryError);
          }
        }
      };
      
      // Play immediately if video is ready, otherwise wait for canplay
      if (video.readyState >= 2) {
        playVideo();
      } else {
        const handleCanPlay = () => {
          playVideo();
          video.removeEventListener('canplay', handleCanPlay);
        };
        video.addEventListener('canplay', handleCanPlay);
        video.load(); // Trigger loading
      }
    }
  }, [currentSlideIndex, videoEnded]);

  // Manual slide navigation (via indicators only - no gestures)
  const goToSlide = useCallback((index: number) => {
    // Stop any running slideshow
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    setCurrentSlideIndex(index);
    
    // Reset video state if going to video slide
    if (index === 0) {
      setVideoEnded(false);
      const video = videoRef.current;
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
      // Don't start slideshow if on video
      return;
    }
    
    // Preload adjacent images (subtract 1 because images start at index 0)
    if (index > 0) {
      const imageIndex = index - 1;
      preloadImages([
        imageIndex, 
        imageIndex < heroImages.length - 1 ? imageIndex + 1 : 0,
        imageIndex > 0 ? imageIndex - 1 : heroImages.length - 1
      ]);
    }
    
    // Start slideshow to continue looping
    startSlideshow();
  }, [startSlideshow, preloadImages, heroImages.length]);

  // Mouse position tracking for hover 3D effects (disabled on mobile for performance)
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!sectionRef.current || !isHovering || isMobile) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    setMousePosition({ x, y });
  }, [isHovering, isMobile]);

  const handleMouseEnter = useCallback(() => {
    if (!isMobile) {
      setIsHovering(true);
    }
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setMousePosition({ x: 0, y: 0 });
  }, []);

  // Detect device type for responsive optimizations
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640); // sm breakpoint
      setIsTablet(width >= 640 && width < 1024); // md breakpoint
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Intersection Observer for scroll-triggered animations
  useEffect(() => {
    if (typeof window === 'undefined' || !window.IntersectionObserver) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('button-in-view');
        }
      });
    }, observerOptions);

    // Observe all button refs
    Object.values(buttonRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(buttonRefs.current).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []); // Empty deps - we'll observe when refs are set

  // Preload images and prepare slideshow (video autoplays first)
  useEffect(() => {
    preloadAllImages();
    // Don't start slideshow on mount - wait for video to end first
  }, [preloadAllImages]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        backgroundColor: 'transparent',
        minHeight: isMobile ? '-webkit-fill-available' : '100vh', // Better mobile viewport handling
        zIndex: 1, // Ensure proper stacking context - below header
        position: 'relative', // Ensure it's in normal document flow
      }}
    >
      {/* Unified Slideshow: Video (slide 0) + Images (slides 1-12) */}
      <div className="absolute inset-0 z-40 overflow-hidden">
        {/* Video Slide (Index 0) */}
        <div
          className={`absolute inset-0 transition-all duration-[1200ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
            currentSlideIndex === 0
              ? 'opacity-100 z-30'
              : 'opacity-0 z-0 pointer-events-none'
          }`}
          style={{ 
            transform: currentSlideIndex === 0
              ? `translateX(0) translateY(0) translateZ(0px) ${isMobile ? '' : 'rotateY(0deg) rotateX(0deg)'} scale(1)`
              : `translateX(-120%) translateY(0) ${isMobile ? 'translateZ(0px)' : 'translateZ(-100px) rotateY(25deg) rotateX(5deg)'} scale(0.9)`,
            transformStyle: isMobile ? 'flat' : 'preserve-3d',
            transformOrigin: 'center center',
            willChange: currentSlideIndex === 0 && !isMobile ? 'transform, opacity' : 'auto',
            backfaceVisibility: 'hidden',
            perspective: isMobile ? 'none' : '2000px',
            backgroundColor: 'transparent',
          }}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
            loop={false}
            preload="auto"
            disablePictureInPicture
            controlsList="nodownload noremoteplayback"
            onEnded={handleVideoEnd}
            onTimeUpdate={(e) => {
              // Prevent manual advancement during video playback
              const video = e.target as HTMLVideoElement;
              if (currentSlideIndex === 0 && !videoEnded && video.currentTime < video.duration - 0.1) {
                // Video is still playing, ensure we stay on slide 0
                if (intervalRef.current) {
                  clearInterval(intervalRef.current);
                }
              }
            }}
            onLoadedData={(e) => {
              // Video autoplays when slide 0 is active (handled by useEffect)
              // This is triggered on mount since we start with slide 0
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center center',
              willChange: isMobile ? 'auto' : 'transform',
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden',
            }}
          >
            <source src="/images/hero/1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Image Slides (Index 1-12: images 2,3,4,5,6,7,8,9,10,11,12,13.webp) - Optimized Display */}
        {heroImages.map((image, imageIndex) => {
          const slideIndex = imageIndex + 1; // Slide index 1-12
          const isActive = slideIndex === currentSlideIndex;
          const isPrev = slideIndex === ((currentSlideIndex - 1 + totalSlides) % totalSlides);
          const isNext = slideIndex === ((currentSlideIndex + 1) % totalSlides);
          
          return (
            <div
              key={`image-${imageIndex}`}
              className={`absolute inset-0 transition-all duration-[1500ms] ease-[cubic-bezier(0.4, 0, 0.2, 1)] ${
                isActive
                  ? 'opacity-100 z-30'
                  : isPrev || isNext
                  ? 'opacity-0 z-20'
                  : 'opacity-0 z-0 pointer-events-none'
              }`}
              style={{
                transform: isActive
                  ? `translateX(0) translateY(0) translateZ(0px) ${isMobile ? '' : 'rotateY(0deg) rotateX(0deg)'} scale(1)`
                  : isPrev
                  ? `translateX(-100%) translateY(0) ${isMobile ? 'translateZ(0px)' : 'translateZ(-80px) rotateY(15deg) rotateX(3deg)'} scale(0.95)`
                  : `translateX(100%) translateY(0) ${isMobile ? 'translateZ(0px)' : 'translateZ(-80px) rotateY(-15deg) rotateX(3deg)'} scale(0.95)`,
                transformStyle: isMobile ? 'flat' : 'preserve-3d',
                transformOrigin: 'center center',
                willChange: (isActive || isPrev || isNext) && !isMobile ? 'transform, opacity' : 'auto',
                backfaceVisibility: 'hidden',
                perspective: isMobile ? 'none' : '2000px',
                backgroundColor: 'transparent',
              }}
            >
              <div
                className="w-full h-full relative"
                style={{
                transformStyle: isMobile ? 'flat' : 'preserve-3d',
                backgroundColor: 'transparent',
                transform: isActive && isHovering && !isMobile
                    ? `translateX(${mousePosition.x * 0.3}px) translateY(${mousePosition.y * 0.3}px) rotateX(${mousePosition.y * 0.02}deg) rotateY(${mousePosition.x * 0.02}deg)`
                    : undefined,
                  transition: isActive && isHovering && !isMobile
                    ? 'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)'
                    : 'none',
                }}
              >
                <img
                  src={image}
                  alt={`Hero slide ${imageIndex + 2}`}
                  className="w-full h-full object-cover"
                  style={{
                    transform: isActive
                      ? `scale(${isMobile ? '1.02' : '1.05'}) ${!isMobile && isHovering ? `translateX(${mousePosition.x * 0.1}px) translateY(${mousePosition.y * 0.1}px)` : ''}`
                      : 'scale(1)',
                    transition: isActive
                      ? `transform ${isMobile ? '8s' : '15s'} cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 1s cubic-bezier(0.4, 0, 0.2, 1)`
                      : 'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 1s cubic-bezier(0.4, 0, 0.2, 1)',
                    willChange: isActive && !isMobile ? 'transform, opacity' : 'auto',
                    imageRendering: isMobile ? 'auto' as const : 'crisp-edges' as const,
                    WebkitBackfaceVisibility: 'hidden',
                    backfaceVisibility: 'hidden',
                    opacity: loadedImages.has(imageIndex) ? 1 : 0,
                    backgroundColor: 'transparent',
                    objectFit: 'cover',
                    objectPosition: 'center center',
                  }}
                  loading={isActive || isNext ? 'eager' : 'lazy'}
                  decoding={isMobile ? 'async' : 'auto'}
                  onLoad={(e) => {
                    // Mark image as loaded when it loads
                    setLoadedImages((prev) => new Set([...prev, imageIndex]));
                  }}
                  onError={(e) => {
                    // Handle missing images gracefully
                    const target = e.target as HTMLImageElement;
                    console.error(`Failed to load image: ${image}`);
                    target.style.opacity = '0';
                  }}
                />
              </div>
            </div>
          );
        })}
            </div>

      {/* Text Overlay - Pure White, High Contrast - Appears on Video and All Images */}
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none px-4 sm:px-6 md:px-8 lg:px-12">
        <div
          className="text-center text-white max-w-6xl mx-auto w-full"
          style={{
            transformStyle: isMobile ? 'flat' : 'preserve-3d',
            paddingTop: isMobile ? '2rem' : '0',
            paddingBottom: isMobile ? '4rem' : '0',
          }}
        >
          {/* Animated text content with 3D Interactive Transition */}
          <div
            key={currentSlideIndex}
            className={isMobile ? 'animate-text-3d' : 'animate-text-3d-interactive'}
          >
            {/* Main Title - Big, Bold, White, Center Aligned - Shows on Video and All Images */}
            <h1
              className="font-black mb-3 sm:mb-4 md:mb-5 lg:mb-7 leading-tight text-center mx-auto w-full"
              style={{
                fontFamily: '"Orbitron", "Rajdhani", "Eurostile", sans-serif',
                color: '#ffffff',
                WebkitTextStroke: isMobile ? '2px #000000' : '2.5px #000000',
                textShadow: 'none',
                transform: isMobile ? 'none' : `translateZ(50px) scale(1)`,
                letterSpacing: isMobile ? '-0.01em' : '-0.02em',
                lineHeight: '1.1',
                maxWidth: '100%',
                fontWeight: 900,
                mixBlendMode: 'normal',
                textAlign: 'center',
                display: 'block',
                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                fontSize: isMobile 
                  ? 'clamp(28px, 8vw, 42px)' 
                  : isTablet 
                    ? 'clamp(42px, 7vw, 72px)' 
                    : 'clamp(56px, 6vw, 108px)',
                paddingLeft: isMobile ? '0.5rem' : '0',
                paddingRight: isMobile ? '0.5rem' : '0',
              }}
            >
              {titles[currentSlideIndex] || titles[0]}
            </h1>

            {/* Subtitle - Medium Size, Bold, Center Aligned - Shows on Video and All Images */}
            <h2
              className="font-bold mb-4 sm:mb-5 md:mb-6 lg:mb-8 max-w-5xl mx-auto text-center w-full"
              style={{
                fontFamily: '"Orbitron", "Rajdhani", "Eurostile", sans-serif',
                color: '#ffffff',
                WebkitTextStroke: isMobile ? '1.5px #000000' : '2px #000000',
                textShadow: 'none',
                transform: isMobile ? 'none' : `translateZ(40px) scale(1)`,
                letterSpacing: '0.01em',
                lineHeight: isMobile ? '1.5' : '1.6',
                fontWeight: 700,
                mixBlendMode: 'normal',
                textAlign: 'center',
                display: 'block',
                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                fontSize: isMobile 
                  ? 'clamp(14px, 4vw, 20px)' 
                  : isTablet 
                    ? 'clamp(20px, 3.5vw, 26px)' 
                    : 'clamp(22px, 3vw, 34px)',
                paddingLeft: isMobile ? '0.75rem' : '0',
                paddingRight: isMobile ? '0.75rem' : '0',
              }}
            >
              {subtitles[currentSlideIndex] || subtitles[0]}
            </h2>
          </div>
        </div>
            </div>

      {/* CTA Buttons - Fully Interactive, Animated Cards - Visible on Video and All Images */}
      {(
        <div className={`absolute bottom-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-8 lg:px-12 ${isMobile ? 'pb-16' : 'pb-12'} pointer-events-none`}>
          <div className="max-w-6xl mx-auto">
            <div className={`bg-transparent ${isMobile ? 'p-4' : 'p-6 md:p-8'} pointer-events-auto`}>
              <div className={`flex flex-wrap ${isMobile ? 'gap-3' : 'gap-4 lg:gap-6'} justify-center items-center`}>
                {/* Our Projects Button - Vibrant Orange Gradient Card with Enhanced Animations */}
                <a
                  ref={(el) => {
                    if (el && buttonRefs.current.projects !== el) {
                      buttonRefs.current.projects = el;
                    }
                  }}
                  href="/projects"
                  onMouseEnter={() => setButtonHovered(prev => ({ ...prev, projects: true }))}
                  onMouseLeave={() => {
                    setButtonHovered(prev => ({ ...prev, projects: false }));
                    setMousePos(prev => ({ ...prev, projects: { x: 0, y: 0 } }));
                  }}
                  onMouseMove={(e) => {
                    if (isMobile) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
                    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
                    setMousePos(prev => ({ ...prev, projects: { x, y } }));
                  }}
                  className={`group relative overflow-hidden interactive-card interactive-card-projects text-white font-bold uppercase ${isMobile ? 'px-6 py-3.5 text-sm min-h-[44px]' : 'px-8 md:px-10 lg:px-12 py-4 md:py-5 text-[15px] md:text-[17px]'} rounded-xl flex items-center justify-center gap-2 sm:gap-3 shadow-2xl touch-manipulation card-float-animation`}
                  style={{
                    WebkitTapHighlightColor: 'transparent',
                    animationDelay: '0.1s',
                    opacity: buttonsVisible ? 1 : 0,
                    transform: buttonsVisible 
                      ? `translateY(0) scale(1) ${!isMobile && buttonHovered.projects ? `perspective(1000px) rotateX(${mousePos.projects?.y * 0.5}deg) rotateY(${mousePos.projects?.x * 0.5}deg)` : ''}` 
                      : 'translateY(20px) scale(0.9)',
                    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    background: 'linear-gradient(135deg, #dc2626 0%, #ea580c 15%, #f97316 30%, #fb923c 50%, #f97316 70%, #ea580c 85%, #dc2626 100%)',
                    backgroundSize: '200% 200%',
                    transformStyle: 'preserve-3d',
                    willChange: 'transform, box-shadow, background-position',
                  }}
                >
                  {/* Animated gradient overlay - More colorful */}
                  <span className="absolute inset-0 bg-gradient-to-r from-[#e34b11] via-[#f05a2a] via-[#05225c] to-[#e34b11] opacity-0 group-hover:opacity-40 transition-opacity duration-500 animate-gradient-x" style={{ backgroundSize: '200% 200%' }}></span>
                  
                  {/* Animated particles effect */}
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="absolute top-2 left-4 w-2 h-2 bg-[#e34b11]/70 rounded-full animate-sparkle" style={{ animationDelay: '0s' }}></span>
                    <span className="absolute top-4 right-8 w-1.5 h-1.5 bg-[#e34b11]/60 rounded-full animate-sparkle" style={{ animationDelay: '0.3s' }}></span>
                    <span className="absolute bottom-3 left-8 w-2 h-2 bg-[#e34b11]/50 rounded-full animate-sparkle" style={{ animationDelay: '0.6s' }}></span>
                    <span className="absolute bottom-4 right-4 w-1.5 h-1.5 bg-[#e34b11]/80 rounded-full animate-sparkle" style={{ animationDelay: '0.9s' }}></span>
                  </span>
                  
                  {/* Shine effect - Enhanced with multiple layers */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1200 ease-in-out" style={{ animationDelay: '0.3s' }}></span>
                  
                  {/* Multi-layer glow effects */}
                  <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl bg-[#e34b11] -z-10 animate-pulse-glow"></span>
                  <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-60 transition-opacity duration-700 blur-xl bg-[#f05a2a] -z-10" style={{ animationDelay: '0.2s' }}></span>
                  
                  {/* Content */}
                  <span className="relative z-10 flex items-center gap-2 sm:gap-3 transform transition-transform duration-300 group-hover:scale-105">
                    <FaProjectDiagram className={`text-white transition-all duration-300 ${isMobile ? 'text-lg' : 'text-xl md:text-2xl'} animate-icon-bounce`} style={{ color: '#ffffff', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
                    <span className="text-white text-shadow-lg font-black tracking-wide animate-text-shimmer" style={{ color: '#ffffff' }}>OUR PROJECTS</span>
                    <FaArrowRight className={`text-white transform transition-all duration-300 ${isMobile ? 'text-base' : 'text-lg md:text-xl group-hover:translate-x-2 group-hover:scale-125 group-hover:rotate-12'} animate-icon-bounce`} style={{ color: '#ffffff', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
                  </span>
                  
                  {/* Animated pulse rings - Multiple layers */}
                  <span className="absolute inset-0 rounded-xl border-2 border-white/50 opacity-0 group-hover:opacity-100 group-hover:scale-110 group-hover:-inset-2 transition-all duration-500 animate-pulse-ring"></span>
                  <span className="absolute inset-0 rounded-xl border border-white/30 opacity-0 group-hover:opacity-100 group-hover:scale-125 group-hover:-inset-4 transition-all duration-700 animate-pulse-ring" style={{ animationDelay: '0.2s' }}></span>
                  
                  {/* Animated corner accents */}
                  <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </a>

                {/* Our Services Button - Vibrant Glassmorphism Card with Enhanced Animations */}
                <a
                  ref={(el) => {
                    if (el && buttonRefs.current.services !== el) {
                      buttonRefs.current.services = el;
                    }
                  }}
                  href="/services"
                  onMouseEnter={() => setButtonHovered(prev => ({ ...prev, services: true }))}
                  onMouseLeave={() => {
                    setButtonHovered(prev => ({ ...prev, services: false }));
                    setMousePos(prev => ({ ...prev, services: { x: 0, y: 0 } }));
                  }}
                  onMouseMove={(e) => {
                    if (isMobile) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
                    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
                    setMousePos(prev => ({ ...prev, services: { x, y } }));
                  }}
                  className={`group relative overflow-hidden interactive-card interactive-card-services text-white font-bold uppercase ${isMobile ? 'px-6 py-3.5 text-sm min-h-[44px]' : 'px-8 md:px-10 lg:px-12 py-4 md:py-5 text-[15px] md:text-[17px]'} rounded-xl flex items-center justify-center gap-2 sm:gap-3 border-2 touch-manipulation shadow-2xl card-float-animation`}
                  style={{
                    WebkitTapHighlightColor: 'transparent',
                    animationDelay: '0.2s',
                    opacity: buttonsVisible ? 1 : 0,
                    transform: buttonsVisible 
                      ? `translateY(0) scale(1) ${!isMobile && buttonHovered.services ? `perspective(1000px) rotateX(${mousePos.services?.y * 0.5}deg) rotateY(${mousePos.services?.x * 0.5}deg)` : ''}` 
                      : 'translateY(20px) scale(0.9)',
                    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(168, 85, 247, 0.25) 25%, rgba(192, 132, 252, 0.3) 50%, rgba(168, 85, 247, 0.25) 75%, rgba(139, 92, 246, 0.2) 100%)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    borderColor: 'rgba(192, 132, 252, 0.4)',
                    borderImage: 'linear-gradient(135deg, rgba(147, 51, 234, 0.6), rgba(192, 132, 252, 0.8), rgba(236, 72, 153, 0.6)) 1',
                    transformStyle: 'preserve-3d',
                    willChange: 'transform, box-shadow, border-color',
                  }}
                >
                  {/* Animated colorful background gradient */}
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-400/30 via-pink-400/30 via-violet-400/30 to-purple-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x" style={{ backgroundSize: '200% 200%' }}></span>
                  
                  {/* Animated rainbow particles */}
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="absolute top-3 left-6 w-2 h-2 bg-purple-300 rounded-full animate-sparkle" style={{ animationDelay: '0s' }}></span>
                    <span className="absolute top-5 right-6 w-1.5 h-1.5 bg-pink-300 rounded-full animate-sparkle" style={{ animationDelay: '0.4s' }}></span>
                    <span className="absolute bottom-4 left-5 w-2 h-2 bg-violet-300 rounded-full animate-sparkle" style={{ animationDelay: '0.8s' }}></span>
                    <span className="absolute bottom-3 right-5 w-1.5 h-1.5 bg-purple-200 rounded-full animate-sparkle" style={{ animationDelay: '1.2s' }}></span>
                  </span>
                  
                  {/* Enhanced shine effect - Multiple layers */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1200 ease-in-out" style={{ animationDelay: '0.3s' }}></span>
                  
                  {/* Multi-layer glow effects - Purple and Pink */}
                  <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-80 transition-opacity duration-500 blur-2xl bg-purple-400 -z-10 animate-pulse-glow"></span>
                  <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-60 transition-opacity duration-700 blur-xl bg-pink-400 -z-10" style={{ animationDelay: '0.2s' }}></span>
                  
                  {/* Content */}
                  <span className="relative z-10 flex items-center gap-2 sm:gap-3 transform transition-transform duration-300 group-hover:scale-105">
                    <FaTools className={`text-white transition-all duration-300 ${isMobile ? 'text-lg' : 'text-xl md:text-2xl'} animate-icon-bounce`} style={{ color: '#ffffff', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
                    <span className="text-white text-shadow-lg font-black tracking-wide animate-text-shimmer" style={{ color: '#ffffff' }}>OUR SERVICES</span>
                    <FaArrowRight className={`text-white transform transition-all duration-300 ${isMobile ? 'text-base' : 'text-lg md:text-xl group-hover:translate-x-2 group-hover:scale-125 group-hover:rotate-12'} animate-icon-bounce`} style={{ color: '#ffffff', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
                  </span>
                  
                  {/* Animated border glow - Colorful */}
                  <span className="absolute inset-0 rounded-xl border-2 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110 group-hover:-inset-2 animate-pulse-ring" style={{ borderColor: 'rgba(192, 132, 252, 0.8)', borderImage: 'linear-gradient(45deg, rgba(147, 51, 234, 0.8), rgba(192, 132, 252, 1), rgba(236, 72, 153, 0.8)) 1' }}></span>
                  <span className="absolute inset-0 rounded-xl border border-purple-300/50 opacity-0 group-hover:opacity-100 group-hover:scale-125 group-hover:-inset-4 transition-all duration-700 animate-pulse-ring" style={{ animationDelay: '0.2s' }}></span>
                  
                  {/* Animated corner accents - Colorful */}
                  <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-purple-300/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-pink-300/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-violet-300/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-purple-300/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </a>

                {/* Contact Button - Vibrant Blue-Cyan Gradient Card with Enhanced Animations */}
                <a
                  ref={(el) => {
                    if (el && buttonRefs.current.contact !== el) {
                      buttonRefs.current.contact = el;
                    }
                  }}
                  href="/contact"
                  onMouseEnter={() => setButtonHovered(prev => ({ ...prev, contact: true }))}
                  onMouseLeave={() => {
                    setButtonHovered(prev => ({ ...prev, contact: false }));
                    setMousePos(prev => ({ ...prev, contact: { x: 0, y: 0 } }));
                  }}
                  onMouseMove={(e) => {
                    if (isMobile) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
                    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
                    setMousePos(prev => ({ ...prev, contact: { x, y } }));
                  }}
                  className={`group relative overflow-hidden interactive-card interactive-card-contact text-white font-bold uppercase ${isMobile ? 'px-6 py-3.5 text-sm min-h-[44px]' : 'px-8 md:px-10 lg:px-12 py-4 md:py-5 text-[15px] md:text-[17px]'} rounded-xl flex items-center justify-center gap-2 sm:gap-3 shadow-2xl touch-manipulation card-float-animation`}
                  style={{
                    WebkitTapHighlightColor: 'transparent',
                    animationDelay: '0.3s',
                    opacity: buttonsVisible ? 1 : 0,
                    transform: buttonsVisible 
                      ? `translateY(0) scale(1) ${!isMobile && buttonHovered.contact ? `perspective(1000px) rotateX(${mousePos.contact?.y * 0.5}deg) rotateY(${mousePos.contact?.x * 0.5}deg)` : ''}` 
                      : 'translateY(20px) scale(0.9)',
                    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 15%, #3b82f6 30%, #60a5fa 50%, #3b82f6 70%, #2563eb 85%, #1e40af 100%)',
                    backgroundSize: '200% 200%',
                    transformStyle: 'preserve-3d',
                    willChange: 'transform, box-shadow, background-position',
                  }}
                >
                  {/* Animated gradient overlay - More vibrant cyan-blue */}
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-blue-400 via-sky-400 to-cyan-300 opacity-0 group-hover:opacity-50 transition-opacity duration-500 animate-gradient-x" style={{ backgroundSize: '200% 200%' }}></span>
                  
                  {/* Animated particles effect - Blue and Cyan */}
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="absolute top-2 left-5 w-2 h-2 bg-cyan-300 rounded-full animate-sparkle" style={{ animationDelay: '0s' }}></span>
                    <span className="absolute top-4 right-6 w-1.5 h-1.5 bg-blue-200 rounded-full animate-sparkle" style={{ animationDelay: '0.3s' }}></span>
                    <span className="absolute bottom-3 left-6 w-2 h-2 bg-sky-300 rounded-full animate-sparkle" style={{ animationDelay: '0.6s' }}></span>
                    <span className="absolute bottom-4 right-5 w-1.5 h-1.5 bg-cyan-200 rounded-full animate-sparkle" style={{ animationDelay: '0.9s' }}></span>
                  </span>
                  
                  {/* Enhanced shine effect - Multiple layers */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1200 ease-in-out" style={{ animationDelay: '0.3s' }}></span>
                  
                  {/* Multi-layer glow effects - Blue and Cyan */}
                  <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl bg-blue-400 -z-10 animate-pulse-glow"></span>
                  <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-70 transition-opacity duration-700 blur-xl bg-cyan-400 -z-10" style={{ animationDelay: '0.2s' }}></span>
                  
                  {/* Content */}
                  <span className="relative z-10 flex items-center gap-2 sm:gap-3 transform transition-transform duration-300 group-hover:scale-105">
                    <FaEnvelope className={`text-white transition-all duration-300 ${isMobile ? 'text-lg' : 'text-xl md:text-2xl'} animate-icon-bounce`} style={{ color: '#ffffff', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
                    <span className="text-white text-shadow-lg font-black tracking-wide animate-text-shimmer" style={{ color: '#ffffff' }}>CONTACT</span>
                    <FaPhone className={`text-white transform transition-all duration-300 ${isMobile ? 'text-base' : 'text-lg md:text-xl group-hover:scale-125 group-hover:rotate-12'} animate-icon-bounce`} style={{ color: '#ffffff', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
                  </span>
                  
                  {/* Animated pulse rings - Multiple layers */}
                  <span className="absolute inset-0 rounded-xl border-2 border-white/50 opacity-0 group-hover:opacity-100 group-hover:scale-110 group-hover:-inset-2 transition-all duration-500 animate-pulse-ring"></span>
                  <span className="absolute inset-0 rounded-xl border border-cyan-300/50 opacity-0 group-hover:opacity-100 group-hover:scale-125 group-hover:-inset-4 transition-all duration-700 animate-pulse-ring" style={{ animationDelay: '0.2s' }}></span>
                  
                  {/* Animated corner accents */}
                  <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-300/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-300/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-sky-300/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-300/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slide Indicators - All 13 slides (video + 12 images) - Touch-Friendly */}
      <div className={`absolute ${isMobile ? 'bottom-20' : 'bottom-6'} left-1/2 transform -translate-x-1/2 z-50 flex ${isMobile ? 'space-x-1.5' : 'space-x-2 md:space-x-3'} overflow-x-auto max-w-[90vw] px-2`}>
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full touch-manipulation ${
              index === currentSlideIndex
                ? `bg-white ${isMobile ? 'w-6 h-2' : 'w-8 md:w-10 h-2 md:h-3'} shadow-lg`
                : `bg-white/50 ${isMobile ? 'hover:bg-white/70 active:bg-white/80' : 'hover:bg-white/80'} ${isMobile ? 'w-2 h-2 min-w-[8px]' : 'w-2 md:w-3 h-2 md:h-3'}`
            }`}
            aria-label={`Go to slide ${index + 1}`}
            style={{
              WebkitTapHighlightColor: 'transparent',
              minHeight: isMobile ? '8px' : undefined,
            }}
          />
        ))}
      </div>

      {/* Video plays without any overlays - pure video content */}

      {/* Cinematic Styles and Animations */}
      <style jsx>{`
        @keyframes text-3d {
          0% {
            opacity: 0;
            transform: translateY(60px) translateZ(-100px) rotateX(15deg) scale(0.85);
            filter: blur(4px);
          }
          60% {
            opacity: 0.9;
            filter: blur(1px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) translateZ(0px) rotateX(0deg) scale(1);
            filter: blur(0);
          }
        }
        
        @keyframes text-3d-interactive {
          0% {
            opacity: 0;
            transform: translateY(80px) translateZ(-150px) rotateX(25deg) rotateY(-20deg) scale(0.7);
            filter: blur(6px);
          }
          40% {
            opacity: 0.6;
            transform: translateY(30px) translateZ(-50px) rotateX(10deg) rotateY(-5deg) scale(0.9);
            filter: blur(2px);
          }
          70% {
            opacity: 0.95;
            transform: translateY(-5px) translateZ(10px) rotateX(-2deg) rotateY(2deg) scale(1.02);
            filter: blur(0.5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) translateZ(0px) rotateX(0deg) rotateY(0deg) scale(1);
            filter: blur(0);
          }
        }

        @keyframes cinematic-zoom {
          0% {
            transform: scale(1) translateZ(0px);
          }
          50% {
            transform: scale(1.03) translateZ(20px);
          }
          100% {
            transform: scale(1.08) translateZ(0px);
          }
        }
        
        @keyframes slideExpand {
          0% {
            transform: translateZ(25px) scaleX(0);
          }
          100% {
            transform: translateZ(25px) scaleX(1);
          }
        }

        .animate-text-3d {
          animation: text-3d 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .animate-text-3d-interactive {
          animation: text-3d-interactive 1.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          transform-style: preserve-3d;
          perspective: 2000px;
        }

        /* Cinematic image zoom animation */
        .cinematic-zoom {
          animation: cinematic-zoom 25s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
        }

        /* Text stroke for high visibility without shadows */
        h1, h2 {
          -webkit-text-stroke-width: 2px;
          -webkit-text-stroke-color: #000000;
          paint-order: stroke fill;
        }

        h2 {
          -webkit-text-stroke-width: 1.5px;
        }

        /* Optimize performance */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* GPU acceleration for smooth animations */
        section, div[style*="transform"], img[style*="transform"] {
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }

        /* Smooth scrolling and interaction */
        * {
          -webkit-tap-highlight-color: transparent;
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Mobile optimizations */
        @media (max-width: 640px) {
          /* Disable 3D transforms on mobile for better performance */
          * {
            transform-style: flat !important;
            perspective: none !important;
          }
          
          /* Reduce animation complexity on mobile */
          .animate-text-3d-interactive {
            animation: text-3d 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          }
          
          /* Better touch targets */
          button, a {
            min-height: 44px;
            min-width: 44px;
          }
        }

        /* Tablet optimizations */
        @media (min-width: 641px) and (max-width: 1023px) {
          /* Moderate 3D effects on tablets */
          * {
            perspective: 1500px;
          }
        }

        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          /* Disable hover effects on touch devices */
          *:hover {
            transform: none !important;
          }
        }

        /* Improve mobile viewport handling */
        @supports (-webkit-touch-callout: none) {
          section {
            min-height: -webkit-fill-available;
          }
        }

        /* Optimize font rendering on mobile */
        @media (max-width: 640px) {
          h1, h2 {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
          }
        }

        /* Better image loading on mobile */
        @media (max-width: 640px) {
          img {
            loading: lazy;
            fetchpriority: auto;
          }
        }

        /* Button entrance animations */
        @keyframes buttonEnter {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.8) rotateX(-15deg);
            filter: blur(4px);
          }
          50% {
            opacity: 0.8;
            filter: blur(1px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1) rotateX(0deg);
            filter: blur(0);
          }
        }

        /* Scroll-triggered animation */
        @keyframes cardSlideIn {
          0% {
            opacity: 0;
            transform: translateY(50px) scale(0.9) rotateX(-10deg);
            filter: blur(8px);
          }
          60% {
            opacity: 0.8;
            filter: blur(2px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1) rotateX(0deg);
            filter: blur(0);
          }
        }

        .interactive-card {
          animation: buttonEnter 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          position: relative;
        }

        .interactive-card.button-in-view {
          animation: cardSlideIn 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        /* Gradient animation */
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }

        /* Enhanced interactive card hover effects with more animations */
        @media (hover: hover) and (pointer: fine) {
          .interactive-card-projects:hover {
            transform: perspective(1000px) translateY(-12px) scale(1.08) rotateX(2deg) !important;
            box-shadow: 
              0 25px 50px rgba(234, 88, 12, 0.5),
              0 0 80px rgba(234, 88, 12, 0.4),
              0 0 120px rgba(249, 115, 22, 0.3),
              0 0 160px rgba(251, 146, 60, 0.2),
              inset 0 0 40px rgba(255, 255, 255, 0.15) !important;
            filter: brightness(1.1) saturate(1.2) !important;
            border-radius: 16px !important;
            animation: cardHoverFloat 2s ease-in-out infinite,
                       cardHoverPulse 1.5s ease-in-out infinite,
                       cardHoverGlow 2s ease-in-out infinite !important;
          }

          .interactive-card-services:hover {
            transform: perspective(1000px) translateY(-12px) scale(1.08) rotateX(2deg) !important;
            box-shadow: 
              0 25px 50px rgba(147, 51, 234, 0.5),
              0 0 80px rgba(168, 85, 247, 0.4),
              0 0 120px rgba(192, 132, 252, 0.3),
              0 0 160px rgba(236, 72, 153, 0.2),
              inset 0 0 40px rgba(255, 255, 255, 0.15) !important;
            border-color: rgba(255, 255, 255, 0.8) !important;
            filter: brightness(1.15) saturate(1.3) !important;
            border-radius: 16px !important;
            backdrop-filter: blur(25px) saturate(200%) !important;
            animation: cardHoverFloat 2s ease-in-out infinite,
                       cardHoverPulse 1.5s ease-in-out infinite,
                       cardHoverGlow 2s ease-in-out infinite !important;
          }

          .interactive-card-contact:hover {
            transform: perspective(1000px) translateY(-12px) scale(1.08) rotateX(2deg) !important;
            box-shadow: 
              0 25px 50px rgba(37, 99, 235, 0.5),
              0 0 80px rgba(59, 130, 246, 0.4),
              0 0 120px rgba(96, 165, 250, 0.3),
              0 0 160px rgba(125, 211, 252, 0.2),
              inset 0 0 40px rgba(255, 255, 255, 0.15) !important;
            filter: brightness(1.1) saturate(1.2) !important;
            border-radius: 16px !important;
            animation: cardHoverFloat 2s ease-in-out infinite,
                       cardHoverPulse 1.5s ease-in-out infinite,
                       cardHoverGlow 2s ease-in-out infinite !important;
          }

          /* Enhanced 3D tilt effect on hover */
          .interactive-card:hover {
            transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1),
                       box-shadow 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
                       filter 0.3s ease-out,
                       border-radius 0.3s ease-out,
                       backdrop-filter 0.3s ease-out !important;
          }

          /* Content animations on hover */
          .interactive-card:hover .relative.z-10 {
            transform: translateY(-2px) scale(1.02) !important;
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
          }

          /* Text scale animation on hover */
          .interactive-card:hover span.font-black {
            transform: scale(1.05) !important;
            letter-spacing: 0.05em !important;
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                       letter-spacing 0.3s ease-out !important;
          }

          /* Enhanced particle animations on hover */
          .interactive-card:hover .absolute.inset-0 span {
            animation: sparkle 1.5s ease-in-out infinite,
                       particleFloat 2s ease-in-out infinite !important;
          }
        }

        /* Additional hover animation keyframes */
        @keyframes cardHoverFloat {
          0%, 100% {
            transform: perspective(1000px) translateY(-12px) scale(1.08) rotateX(2deg);
          }
          50% {
            transform: perspective(1000px) translateY(-16px) scale(1.09) rotateX(3deg);
          }
        }

        @keyframes cardHoverPulse {
          0%, 100% {
            box-shadow: 0 25px 50px rgba(234, 88, 12, 0.5),
                       0 0 80px rgba(234, 88, 12, 0.4),
                       0 0 120px rgba(249, 115, 22, 0.3);
          }
          50% {
            box-shadow: 0 30px 60px rgba(234, 88, 12, 0.6),
                       0 0 100px rgba(234, 88, 12, 0.5),
                       0 0 140px rgba(249, 115, 22, 0.4);
          }
        }

        @keyframes cardHoverGlow {
          0%, 100% {
            filter: brightness(1.1) saturate(1.2);
          }
          50% {
            filter: brightness(1.2) saturate(1.3);
          }
        }

        @keyframes particleFloat {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.2);
          }
        }

        /* Active/press state */
        .interactive-card:active {
          transform: scale(0.98) !important;
          transition: transform 0.1s ease-out;
        }

        /* Continuous subtle pulse for clickability indication */
        @keyframes subtlePulse {
          0%, 100% {
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          }
          50% {
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
          }
        }

        .interactive-card {
          animation: buttonEnter 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
                     subtlePulse 3s ease-in-out infinite;
        }

        /* Text shadow for better readability */
        .text-shadow-lg {
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5),
                       0 1px 3px rgba(0, 0, 0, 0.7);
        }

        /* Ripple effect on click */
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }

        a.button-animate-enter {
          position: relative;
        }

        a.button-animate-enter:active::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          transform: translate(-50%, -50%);
          animation: ripple 0.6s ease-out;
        }

        /* Smooth button transitions */
        a.button-animate-enter {
          will-change: transform, opacity, box-shadow;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        /* Enhanced interactive card styles for desktop */
        @media (min-width: 1024px) {
          .interactive-card {
            cursor: pointer;
            position: relative;
          }

          /* Micro-interaction: Icon bounce */
          .interactive-card:hover span:last-child {
            animation: iconBounce 0.6s ease-in-out;
          }

          @keyframes iconBounce {
            0%, 100% { transform: translateX(0) scale(1) rotate(0deg); }
            25% { transform: translateX(4px) scale(1.2) rotate(10deg); }
            50% { transform: translateX(8px) scale(1.3) rotate(15deg); }
            75% { transform: translateX(4px) scale(1.2) rotate(10deg); }
          }

          /* Smooth focus state */
          .interactive-card:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.5);
          }

          /* Click ripple effect enhancement */
          .interactive-card::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s, opacity 0.6s;
            opacity: 0;
            pointer-events: none;
          }

          .interactive-card:active::before {
            width: 300px;
            height: 300px;
            opacity: 0;
            transition: width 0.3s, height 0.3s, opacity 0.3s;
          }
        }

        /* Mobile optimizations for cards */
        @media (max-width: 640px) {
          .interactive-card {
            transform: none !important;
            animation: buttonEnter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }

          .interactive-card:active {
            transform: scale(0.95) !important;
            transition: transform 0.1s ease-out;
          }
        }

        /* Floating animation for cards */
        @keyframes cardFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .card-float-animation {
          animation: cardFloat 3s ease-in-out infinite;
        }

        /* Sparkle animation for particles */
        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
        }

        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }

        /* Text shimmer effect */
        @keyframes textShimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        .animate-text-shimmer {
          color: #ffffff !important;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5),
                       0 1px 3px rgba(0, 0, 0, 0.7);
          animation: textShimmer 3s linear infinite;
        }
        
        /* Alternative: Subtle white shimmer without changing text color */
        .animate-text-shimmer::after {
          content: attr(data-text);
          position: absolute;
          left: 0;
          top: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: textShimmer 3s linear infinite;
          pointer-events: none;
        }

        /* Enhanced icon animations - More dynamic on hover */
        @keyframes iconBounce {
          0%, 100% {
            transform: translateX(0) scale(1) rotate(0deg);
          }
          25% {
            transform: translateX(4px) scale(1.1) rotate(10deg);
          }
          50% {
            transform: translateX(8px) scale(1.2) rotate(15deg);
          }
          75% {
            transform: translateX(4px) scale(1.1) rotate(10deg);
          }
        }

        /* Icon pulse animation */
        @keyframes iconPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.9;
          }
        }

        /* Icon rotate animation */
        @keyframes iconRotate {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-5deg);
          }
          75% {
            transform: rotate(5deg);
          }
        }

        /* Icon slide animation */
        @keyframes iconSlide {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(6px);
          }
        }

        /* Icon glow pulse */
        @keyframes iconGlow {
          0%, 100% {
            filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
            opacity: 1;
          }
          50% {
            filter: drop-shadow(0 0 16px rgba(255, 255, 255, 0.9));
            opacity: 0.95;
          }
        }

        /* Icon scale bounce */
        @keyframes iconScale {
          0%, 100% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.1);
          }
          50% {
            transform: scale(1.25);
          }
          75% {
            transform: scale(1.1);
          }
        }

        .animate-icon-bounce {
          animation: iconBounce 2s ease-in-out infinite,
                     iconPulse 2.5s ease-in-out infinite;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* Enhanced hover effects for icons */
        .group:hover .animate-icon-bounce:first-child {
          animation: iconBounce 0.6s ease-in-out,
                     iconPulse 0.8s ease-in-out infinite,
                     iconRotate 1s ease-in-out infinite,
                     iconScale 1.2s ease-in-out infinite !important;
          transform: scale(1.3) translateX(-4px) rotate(-5deg) !important;
          filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.8)) 
                  drop-shadow(0 4px 8px rgba(0,0,0,0.4)) !important;
        }

        .group:hover .animate-icon-bounce:last-child {
          animation: iconSlide 0.8s ease-in-out infinite,
                     iconPulse 1s ease-in-out infinite,
                     iconRotate 1.5s ease-in-out infinite !important;
          transform: translateX(8px) scale(1.4) rotate(20deg) !important;
          filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.8)) 
                  drop-shadow(0 4px 8px rgba(0,0,0,0.4)) !important;
        }

        /* Icon glow on hover - Enhanced */
        .group:hover svg.animate-icon-bounce {
          filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.8)) 
                  drop-shadow(0 4px 8px rgba(0,0,0,0.4)) 
                  drop-shadow(0 0 20px rgba(255, 255, 255, 0.5)) !important;
          animation: iconGlow 1.5s ease-in-out infinite !important;
        }

        /* Smooth icon transitions */
        svg.animate-icon-bounce {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                     filter 0.3s ease-out,
                     opacity 0.3s ease-out;
        }

        /* Pulse glow animation */
        @keyframes pulseGlow {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }

        .animate-pulse-glow {
          animation: pulseGlow 2s ease-in-out infinite;
        }

        /* Pulse ring animation */
        @keyframes pulseRing {
          0% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.05);
          }
          100% {
            opacity: 0;
            transform: scale(1.1);
          }
        }

        .animate-pulse-ring {
          animation: pulseRing 2s ease-out infinite;
        }

        /* Enhanced gradient animation for backgrounds */
        .interactive-card {
          animation: buttonEnter 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
                     subtlePulse 3s ease-in-out infinite,
                     gradient-x 5s ease infinite;
          background-position: 0% 50%;
        }

        .interactive-card:hover {
          background-position: 100% 50%;
          transition: background-position 0.5s ease,
                     transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                     box-shadow 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
                     filter 0.3s ease-out,
                     border-radius 0.3s ease-out;
          animation-play-state: running !important;
        }

        /* Additional hover effects for card content */
        @keyframes contentLift {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-3px) scale(1.03);
          }
        }

        .interactive-card:hover .relative.z-10 {
          animation: contentLift 1.5s ease-in-out infinite;
        }

        /* Border animation on hover */
        @keyframes borderPulse {
          0%, 100% {
            border-width: 2px;
            opacity: 0.6;
          }
          50% {
            border-width: 3px;
            opacity: 1;
          }
        }

        .interactive-card:hover {
          animation: buttonEnter 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
                     subtlePulse 3s ease-in-out infinite,
                     gradient-x 5s ease infinite,
                     borderPulse 2s ease-in-out infinite;
        }

        /* Accessibility: Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .interactive-card,
          .card-float-animation,
          .animate-sparkle,
          .animate-text-shimmer,
          .animate-icon-bounce,
          .animate-pulse-glow,
          .animate-pulse-ring {
            animation: none !important;
            transition: opacity 0.3s ease !important;
          }

          .interactive-card:hover {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;