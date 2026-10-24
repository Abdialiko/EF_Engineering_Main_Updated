'use client';
import React, { useEffect, useRef, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Reveal from './Reveal';
import { fetchApi } from '../lib/api';
import { useOwnedScrollAnimations } from '../lib/scrollAnimations';
import { 
  HiOutlineMapPin, 
  HiOutlineEnvelope, 
  HiOutlinePhone,
  HiOutlineArrowRight,
  HiOutlinePhoto
} from 'react-icons/hi2';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn, 
  FaTelegramPlane 
} from 'react-icons/fa';

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const mouseGlowRef = useRef<HTMLDivElement>(null);
  const [servicesMap, setServicesMap] = useState<{ [key: string]: string }>({});
  useOwnedScrollAnimations(footerRef, [servicesMap]);

  // Fetch services and create mapping
  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await fetchApi('services');
        const servicesArray = Array.isArray(data) ? data : (data?.data || []);
        const map: { [key: string]: string } = {};
        
        servicesArray.forEach((service: any) => {
          const title = (service.title || service.name || '').toLowerCase();
          map[title] = `/services/${service.id}`;
        });
        
        setServicesMap(map);
      } catch (error) {
        console.error('Failed to load services for footer:', error);
      }
    };
    loadServices();
  }, []);

  // Mouse tracking for interactive glow effect
  useEffect(() => {
    const footer = footerRef.current;
    const glow = mouseGlowRef.current;
    
    if (!footer || !glow) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = footer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      glow.style.left = `${x}px`;
      glow.style.top = `${y}px`;
      glow.style.opacity = '0.4';
    };

    const handleMouseLeave = () => {
      if (glow) {
        glow.style.opacity = '0';
      }
    };

    footer.addEventListener('mousemove', handleMouseMove);
    footer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      footer.removeEventListener('mousemove', handleMouseMove);
      footer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Gallery images from hero folder
  const galleryImages = [
    '/images/hero/2.webp',
    '/images/hero/3.webp',
    '/images/hero/4.webp',
    '/images/hero/5.webp',
    '/images/hero/6.webp',
    '/images/hero/7.webp',
  ];

  // Services list - Updated with new services
  const getServiceHref = (serviceName: string): string => {
    if (serviceName.toLowerCase().includes('request for partnership')) {
      return '/contact';
    }
    const normalizedName = serviceName.toLowerCase();
    return servicesMap[normalizedName] || '/services';
  };

  const services = [
    'Hydraulic and Water work design',
    'Topographic Surveying and Master plan design',
    'Geotechnical Engineering, Material Testing, and Pavement Design',
  ];

  // Useful Links (now contains About Us, Projects, News, Teams, Vacancy, Contact)
  const usefulLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'News', href: '/news' },
    { name: 'Teams', href: '/teams' },
    { name: 'Vacancy', href: '/vacancy' },
    { name: 'Contact', href: '/contact' },
  ];

  const socialLinks = useMemo(() => [
    { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=100063901428377', icon: FaFacebookF },
    { name: 'Twitter', href: 'https://twitter.com', icon: FaTwitter },
    { name: 'Instagram', href: 'https://instagram.com/ef_architecture_consultanting?igshid=YmMyMTA2M2Y', icon: FaInstagram },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/endale-abdissa-a13564234', icon: FaLinkedinIn },
    { name: 'Telegram', href: 'https://t.me/efengineeringandconsulting', icon: FaTelegramPlane },
  ], []);

  return (
    <footer ref={footerRef} data-bind-own-animations className="relative bg-gradient-to-br from-[#0a0a0a] via-[#151515] to-[#0f0f0f] text-white overflow-hidden group" id="footer-container">
      {/* Colorful Interactive Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Multi-layer colorful gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F54927]/40 via-[#042970]/40 via-[#8B5CF6]/30 to-[#EC4899]/30 animate-gradient-shift"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-[#10B981]/25 via-transparent to-[#F59E0B]/25 animate-gradient-shift-reverse"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#06B6D4]/20 to-transparent animate-gradient-shift-slow"></div>
        
        {/* Large colorful floating orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-[#F54927] to-[#EC4899] rounded-full blur-3xl animate-float-orb opacity-30"></div>
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-gradient-to-br from-[#042970] to-[#8B5CF6] rounded-full blur-3xl animate-float-orb-reverse opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-br from-[#10B981] to-[#06B6D4] rounded-full blur-3xl animate-float-orb-slow opacity-25 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-20 right-1/4 w-64 h-64 bg-gradient-to-br from-[#F59E0B] to-[#F54927] rounded-full blur-3xl animate-float-orb-delayed opacity-25"></div>
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-br from-[#EC4899] to-[#8B5CF6] rounded-full blur-3xl animate-float-orb-slow-delayed opacity-20"></div>
        <div className="absolute top-1/3 right-1/3 w-56 h-56 bg-gradient-to-br from-[#06B6D4] to-[#042970] rounded-full blur-3xl animate-float-orb opacity-20"></div>
        
        {/* Animated colorful grid pattern */}
        <div className="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity duration-500" style={{
          backgroundImage: `
            linear-gradient(rgba(245, 73, 39, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(4, 41, 112, 0.3) 1px, transparent 1px),
            linear-gradient(45deg, rgba(139, 92, 246, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px, 60px 60px, 30px 30px',
          animation: 'grid-move 25s linear infinite, grid-rotate 30s linear infinite'
        }}></div>
        
        {/* Colorful animated wave effects */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#F54927]/30 via-[#EC4899]/20 to-transparent animate-wave"></div>
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#042970]/30 via-[#8B5CF6]/20 to-transparent animate-wave-reverse"></div>
        
        {/* Colorful animated particles - Reduced for performance */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => {
            const colors = ['#F54927', '#042970', '#8B5CF6', '#EC4899', '#10B981', '#06B6D4', '#F59E0B'];
            const color = colors[i % colors.length];
            return (
              <div
                key={i}
                className="absolute rounded-full animate-particle"
                style={{
                  width: `${3 + (i % 3) * 2}px`,
                  height: `${3 + (i % 3) * 2}px`,
                  backgroundColor: color,
                  left: `${(i * 6.67) % 100}%`,
                  top: `${(i * 7.5) % 100}%`,
                  animationDelay: `${(i * 0.3) % 5}s`,
                  animationDuration: `${10 + (i % 5) * 2}s`,
                  boxShadow: `0 0 8px ${color}`,
                  willChange: 'transform, opacity'
                }}
              ></div>
            );
          })}
        </div>
        
        {/* Colorful animated shapes */}
        <div className="absolute top-1/4 left-1/5 w-32 h-32 bg-gradient-to-br from-[#F54927] to-[#EC4899] rounded-lg rotate-45 blur-2xl animate-shape-float opacity-20"></div>
        <div className="absolute bottom-1/4 right-1/5 w-40 h-40 bg-gradient-to-br from-[#042970] to-[#8B5CF6] rounded-full blur-2xl animate-shape-float-reverse opacity-20"></div>
        <div className="absolute top-2/3 left-2/3 w-24 h-24 bg-gradient-to-br from-[#10B981] to-[#06B6D4] rounded-lg blur-xl animate-shape-float-slow opacity-15"></div>
        
        {/* Interactive mouse-following glow effect */}
        <div 
          ref={mouseGlowRef}
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-0 transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(245, 73, 39, 0.5) 0%, rgba(139, 92, 246, 0.4) 30%, rgba(236, 72, 153, 0.3) 60%, transparent 100%)',
            transform: 'translate(-50%, -50%)',
            transition: 'opacity 0.3s ease'
          }}
        ></div>
        
        {/* Colorful animated rings - Reduced for performance */}
        <div className="absolute top-1/2 left-1/2 w-96 h-96 border-2 border-[#F54927]/20 rounded-full animate-ring-expand -translate-x-1/2 -translate-y-1/2 will-change-transform"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 border-2 border-[#042970]/20 rounded-full animate-ring-expand-delayed -translate-x-1/2 -translate-y-1/2 will-change-transform"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
          {/* Logo & Description */}
          <Reveal>
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#F54927] to-[#042970] rounded-lg flex items-center justify-center">
                  <Image 
                    src="/images/logo/newlogo.png" 
                    alt="EF Engineering Logo" 
                    width={32}
                    height={32}
                    className="object-contain"
                    priority
                  />
                </div>
          <div>
                  <h3 className="text-lg font-extrabold text-white">EF Engineering</h3>
                  <p className="text-xs text-white/60">Architecture & Consulting</p>
                </div>
              </div>
              <p className="text-sm text-white/70 leading-relaxed mb-4">
                Professional engineering and architectural services delivering innovative solutions for your projects.
              </p>
              {/* Social Media Icons */}
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-white/10 hover:bg-[#F54927] flex items-center justify-center rounded-lg transition-all duration-300 hover:scale-110 hover:rotate-3"
                      aria-label={social.name}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* Contact Us */}
          <Reveal delay={120}>
            <div>
              <h4 className="text-base font-extrabold uppercase tracking-wide mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#F54927]"></span>
                Contact Us
              </h4>
              <ul className="space-y-3 text-white/80 text-sm">
                <li className="flex items-start gap-3 group">
                  <HiOutlineMapPin className="w-5 h-5 text-[#F54927] mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span>
                    Bole Sub-City, Woreda 06<br/>
                    Megenagna to Lamberet Road<br/>
                    Shola Building 1st Floor<br/>
                    Room No. 106, Addis Ababa
                  </span>
                </li>
                <li className="flex items-center gap-3 group">
                  <HiOutlineEnvelope className="w-5 h-5 text-[#F54927] flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <a href="mailto:info@efengineering-architect.com" className="hover:text-[#F54927] transition-colors">
                    info@efengineering-architect.com
                  </a>
                </li>
                <li className="flex items-start gap-3 group">
                  <HiOutlinePhone className="w-5 h-5 text-[#F54927] mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <a href="tel:+2516677479" className="hover:text-[#F54927] transition-colors block">
                      +251-6-677479
                    </a>
                    <a href="tel:+251911240283" className="hover:text-[#F54927] transition-colors block">
                      +251-9-11240283
                    </a>
                  </div>
                </li>
              </ul>
          </div>
          </Reveal>

          {/* Our Services */}
          <Reveal delay={240}>
          <div>
              <h4 className="text-base font-extrabold uppercase tracking-wide mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#F54927]"></span>
                Our Services
              </h4>
              <ul className="space-y-2.5 text-white/80 text-sm">
                {services.map((serviceName, index) => (
                  <li key={index}>
                    <Link 
                      href={getServiceHref(serviceName)} 
                      className="flex items-center gap-2 hover:text-[#F54927] transition-colors group"
                    >
                      <HiOutlineArrowRight className="w-4 h-4 text-[#F54927] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      <span>{serviceName}</span>
                    </Link>
                  </li>
                ))}
                <li className="pt-2">
                  <Link 
                    href="/services" 
                    className="flex items-center gap-2 text-[#F54927] hover:text-white font-semibold transition-colors group"
                  >
                    <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    <span>View All our Services</span>
                  </Link>
                </li>
            </ul>
          </div>
          </Reveal>

          {/* Useful Links */}
          <Reveal delay={360}>
          <div>
              <h4 className="text-base font-extrabold uppercase tracking-wide mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#F54927]"></span>
                Useful Links
              </h4>
              <ul className="space-y-2.5 text-white/80 text-sm">
                {usefulLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={link.href} 
                      className="flex items-center gap-2 hover:text-[#F54927] transition-colors group"
                    >
                      <HiOutlineArrowRight className="w-4 h-4 text-[#F54927] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
          </Reveal>

          {/* Gallery */}
          <Reveal delay={480}>
          <div>
              <h4 className="text-base font-extrabold uppercase tracking-wide mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#F54927]"></span>
                Gallery
              </h4>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {galleryImages.slice(0, 6).map((img, index) => (
                    <Link 
                      key={index} 
                      href="/gallery"
                      className="group relative overflow-hidden rounded-lg aspect-square"
                    >
                      <Image 
                        src={img} 
                        alt={`Gallery ${index + 1}`} 
                        fill
                        sizes="(max-width: 768px) 33vw, 10vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-[#F54927]/0 group-hover:bg-[#F54927]/30 transition-colors"></div>
                    </Link>
                  ))}
                </div>
              <Link 
                href="/gallery"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#F54927] hover:text-white group transition-colors"
              >
                <span>View All Gallery</span>
                <HiOutlinePhoto className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
          </div>
          </Reveal>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <Reveal>
            <div className="text-center text-white/80 text-sm">
              © {new Date().getFullYear()} <span className="text-[#F54927] font-semibold">EF Engineering & Architecture</span>. All Rights Reserved.
            </div>
          </Reveal>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-shift {
          0% { 
            background-position: 0% 50%;
          }
          25% {
            background-position: 100% 0%;
          }
          50% { 
            background-position: 100% 50%;
          }
          75% {
            background-position: 0% 100%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes gradient-shift-reverse {
          0% { 
            background-position: 100% 50%;
          }
          25% {
            background-position: 0% 100%;
          }
          50% { 
            background-position: 0% 0%;
          }
          75% {
            background-position: 100% 0%;
          }
          100% {
            background-position: 100% 50%;
          }
        }
        @keyframes gradient-shift-slow {
          0% { 
            background-position: 50% 50%;
          }
          50% { 
            background-position: 150% 150%;
          }
          100% {
            background-position: 50% 50%;
          }
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 12s ease infinite;
        }
        .animate-gradient-shift-reverse {
          background-size: 200% 200%;
          animation: gradient-shift-reverse 15s ease infinite;
        }
        .animate-gradient-shift-slow {
          background-size: 300% 300%;
          animation: gradient-shift-slow 20s ease infinite;
        }
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
        @keyframes grid-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes float-orb {
          0%, 100% { 
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 0.3;
          }
          25% { 
            transform: translate(50px, -50px) scale(1.2) rotate(90deg);
            opacity: 0.4;
          }
          50% { 
            transform: translate(-30px, 30px) scale(0.9) rotate(180deg);
            opacity: 0.35;
          }
          75% { 
            transform: translate(30px, 50px) scale(1.1) rotate(270deg);
            opacity: 0.4;
          }
        }
        @keyframes float-orb-reverse {
          0%, 100% { 
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 0.3;
          }
          25% { 
            transform: translate(-50px, 50px) scale(0.9) rotate(-90deg);
            opacity: 0.35;
          }
          50% { 
            transform: translate(30px, -30px) scale(1.2) rotate(-180deg);
            opacity: 0.4;
          }
          75% { 
            transform: translate(-30px, -50px) scale(1.05) rotate(-270deg);
            opacity: 0.35;
          }
        }
        @keyframes float-orb-slow {
          0%, 100% { 
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 0.25;
          }
          50% { 
            transform: translate(60px, 60px) scale(1.3) rotate(180deg);
            opacity: 0.35;
          }
        }
        @keyframes float-orb-delayed {
          0%, 100% { 
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 0.25;
          }
          33% { 
            transform: translate(-40px, -40px) scale(1.15) rotate(120deg);
            opacity: 0.3;
          }
          66% { 
            transform: translate(40px, 40px) scale(0.95) rotate(240deg);
            opacity: 0.28;
          }
        }
        @keyframes float-orb-slow-delayed {
          0%, 100% { 
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 0.2;
          }
          50% { 
            transform: translate(-50px, 50px) scale(1.2) rotate(180deg);
            opacity: 0.3;
          }
        }
        @keyframes wave {
          0%, 100% { 
            transform: translateX(0) scaleY(1) scaleX(1);
            opacity: 0.3;
          }
          25% {
            transform: translateX(-30px) scaleY(1.15) scaleX(1.05);
            opacity: 0.4;
          }
          50% { 
            transform: translateX(30px) scaleY(0.95) scaleX(1.1);
            opacity: 0.35;
          }
          75% {
            transform: translateX(-20px) scaleY(1.1) scaleX(0.98);
            opacity: 0.4;
          }
        }
        @keyframes wave-reverse {
          0%, 100% { 
            transform: translateX(0) scaleY(1) scaleX(1);
            opacity: 0.3;
          }
          25% {
            transform: translateX(30px) scaleY(0.95) scaleX(0.95);
            opacity: 0.4;
          }
          50% { 
            transform: translateX(-30px) scaleY(1.15) scaleX(1.05);
            opacity: 0.35;
          }
          75% {
            transform: translateX(20px) scaleY(1.05) scaleX(1.02);
            opacity: 0.4;
          }
        }
        @keyframes particle {
          0% { 
            transform: translateY(100vh) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          50% {
            transform: translateY(50vh) translateX(30px) rotate(180deg);
            opacity: 0.8;
          }
          90% {
            opacity: 1;
          }
          100% { 
            transform: translateY(-10vh) translateX(-20px) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes shape-float {
          0%, 100% { 
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 0.2;
          }
          33% { 
            transform: translate(40px, -40px) rotate(120deg) scale(1.2);
            opacity: 0.3;
          }
          66% { 
            transform: translate(-40px, 40px) rotate(240deg) scale(0.9);
            opacity: 0.25;
          }
        }
        @keyframes shape-float-reverse {
          0%, 100% { 
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 0.2;
          }
          33% { 
            transform: translate(-40px, 40px) rotate(-120deg) scale(0.9);
            opacity: 0.25;
          }
          66% { 
            transform: translate(40px, -40px) rotate(-240deg) scale(1.2);
            opacity: 0.3;
          }
        }
        @keyframes shape-float-slow {
          0%, 100% { 
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 0.15;
          }
          50% { 
            transform: translate(50px, 50px) rotate(180deg) scale(1.3);
            opacity: 0.25;
          }
        }
        @keyframes ring-expand {
          0% { 
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.2;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.3;
          }
          100% { 
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }
        .animate-float-orb {
          animation: float-orb 10s ease-in-out infinite;
        }
        .animate-float-orb-reverse {
          animation: float-orb-reverse 12s ease-in-out infinite;
        }
        .animate-float-orb-slow {
          animation: float-orb-slow 18s ease-in-out infinite;
        }
        .animate-float-orb-delayed {
          animation: float-orb-delayed 14s ease-in-out infinite;
          animation-delay: 2s;
        }
        .animate-float-orb-slow-delayed {
          animation: float-orb-slow-delayed 20s ease-in-out infinite;
          animation-delay: 4s;
        }
        .animate-wave {
          animation: wave 8s ease-in-out infinite;
        }
        .animate-wave-reverse {
          animation: wave-reverse 10s ease-in-out infinite;
        }
        .animate-particle {
          animation: particle linear infinite;
        }
        .animate-shape-float {
          animation: shape-float 12s ease-in-out infinite;
        }
        .animate-shape-float-reverse {
          animation: shape-float-reverse 14s ease-in-out infinite;
        }
        .animate-shape-float-slow {
          animation: shape-float-slow 16s ease-in-out infinite;
        }
        .animate-ring-expand {
          animation: ring-expand 4s ease-out infinite;
        }
        .animate-ring-expand-delayed {
          animation: ring-expand 4s ease-out infinite;
          animation-delay: 1.3s;
        }
        .animate-ring-expand-slow {
          animation: ring-expand 4s ease-out infinite;
          animation-delay: 2.6s;
        }
        /* Performance optimizations */
        @media (prefers-reduced-motion: reduce) {
          .animate-float-orb,
          .animate-float-orb-reverse,
          .animate-float-orb-slow,
          .animate-float-orb-delayed,
          .animate-float-orb-slow-delayed,
          .animate-wave,
          .animate-wave-reverse,
          .animate-particle,
          .animate-shape-float,
          .animate-shape-float-reverse,
          .animate-shape-float-slow,
          .animate-ring-expand,
          .animate-ring-expand-delayed,
          .animate-gradient-shift,
          .animate-gradient-shift-reverse,
          .animate-gradient-shift-slow {
            animation: none !important;
          }
        }
        /* Reduce animations on mobile for better performance */
        @media (max-width: 768px) {
          .animate-float-orb,
          .animate-float-orb-reverse,
          .animate-float-orb-slow,
          .animate-float-orb-delayed,
          .animate-float-orb-slow-delayed {
            animation-duration: 20s !important;
          }
          .animate-particle {
            display: none;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;