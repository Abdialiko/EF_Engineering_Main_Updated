'use client'
import React, { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import Link from 'next/link';
import Reveal from './Reveal';
import { useOwnedScrollAnimations } from '../lib/scrollAnimations';
import { HiOutlineArrowRight, HiOutlineUserGroup } from "react-icons/hi2";

const CEOSection = () => {
  const [animate, setAnimate] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  useOwnedScrollAnimations(sectionRef);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const sectionTop = sectionRef.current.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.8) {
          setAnimate(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} data-bind-own-animations data-scroll-section className="bg-gradient-to-br from-gray-50 via-white to-gray-50 py-24 md:py-32 overflow-hidden engineering-bg relative">
      {/* Floating decorative shapes */}
      <div className="absolute top-20 right-10 w-32 h-32 border-2 border-[#F54927]/10 rounded-full animate-float shape-float-x hidden lg:block"></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 border-2 border-[#042970]/10 rounded-lg rotate-45 animate-float-reverse shape-float-x hidden lg:block" style={{ animationDelay: '1s' }}></div>
      
      {/* Motion lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#F54927]/20 to-transparent motion-line hidden lg:block"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#042970]/20 to-transparent motion-line hidden lg:block" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <Reveal variant="up" delay={0}>
          <div className="text-center mb-12 md:mb-16">
            <p className="text-[#F54927] font-bold uppercase tracking-wider text-sm mb-3">
              Leadership
            </p>
            <h2 className="font-extrabold text-gray-900 leading-tight mb-4 text-3xl md:text-4xl lg:text-5xl">
              <span className="relative inline-block">
                Message from{' '}
                <span className="text-[#042970] relative gradient-text inline-block">
                  Our CEO
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-[#F54927] animate-underline-expand"></span>
                </span>
              </span>
            </h2>
          </div>
        </Reveal>

        {/* CEO Content - Image and Text Side by Side with Equal Heights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-stretch">
          {/* LEFT SIDE - CEO Image Card */}
          <Reveal variant="left" delay={100}>
            <div className="relative w-full flex justify-center lg:justify-start order-2 lg:order-1 h-full">
              <div className={`relative w-full h-full flex flex-col transition-all duration-1000 ease-out ${
                animate ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-20 scale-95'
              }`}>
                {/* Image Container - Equal height card */}
                <div className="relative w-full h-full min-h-[500px] lg:min-h-[600px] rounded-2xl overflow-hidden shadow-2xl group interactive-card-3d hover:shadow-[0_20px_60px_rgba(245,73,39,0.3)] transition-all duration-500 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Image
                    src="/images/CEO.jpg"
                    alt="Eng. Endale Abdisa - CEO and General Manager"
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-[1.02] p-4"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                    priority={false}
                    loading="lazy"
                    quality={85}
                  />
                  {/* Image overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#F54927]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Decorative border on hover */}
                  <div className="absolute inset-0 border-4 border-transparent group-hover:border-[#F54927]/40 rounded-2xl transition-all duration-500"></div>
                  
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  </div>
                  
                  {/* Interactive glow effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-[#F54927]/10 blur-xl"></div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* RIGHT SIDE - CEO Message Card */}
          <Reveal variant="right" delay={200}>
            <div className="order-1 lg:order-2 flex flex-col h-full">
              {/* Message Card - Equal height with image */}
              <div className={`bg-white rounded-2xl shadow-2xl p-6 lg:p-8 h-full min-h-[500px] lg:min-h-[600px] flex flex-col justify-between transition-all duration-700 delay-400 interactive-card-3d hover:shadow-[0_20px_60px_rgba(4,41,112,0.2)] group/card ${
                animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                {/* Message Content - Combined in one card */}
                <div className="flex-1 flex flex-col justify-center space-y-6">
                  <p className="text-gray-700 leading-relaxed text-base lg:text-lg group-hover/card:text-gray-800 transition-colors">
                    At <span className="font-bold text-[#042970] group-hover/card:text-[#F54927] transition-colors cursor-default">EF Architects and Engineers Consulting plc.</span> We have been in the business of studying, planning, designing and consulting for long enough to know construction inside and out, but not so long that we have become unyielding and set in our ways. The truth is we are always looking for better methods of designing & consulting and better solutions to complicated design and construction problems throughout the industry. With EF Architects and Engineers Consulting plc as your branded consulting firm, you will find us bringing a spirited exuberance to your project.
                  </p>

                  <p className="text-gray-700 leading-relaxed text-base lg:text-lg group-hover/card:text-gray-800 transition-colors">
                    You will see us involved in every stage of studying, planning, designing and construction and you will benefit from our experience, skill, designing and consulting expertise. But most of all, you will appreciate our up-front, no-nonsense honesty. These are qualities we expect from our company because our customers expect them from us.
                  </p>
                </div>

                {/* CEO Signature - Centered with Interactive Lines */}
                <div className="mt-8 pt-8 flex flex-col items-center">
                  {/* Top decorative lines */}
                  <div className="w-full flex items-center gap-4 mb-6 group/lines">
                    <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-[#F54927] to-[#F54927] group-hover/lines:h-[3px] transition-all duration-300"></div>
                    <div className="w-3 h-3 bg-[#F54927] rounded-full group-hover/lines:scale-125 group-hover/lines:bg-[#042970] transition-all duration-300"></div>
                    <div className="flex-1 h-[2px] bg-gradient-to-l from-transparent via-[#042970] to-[#042970] group-hover/lines:h-[3px] transition-all duration-300"></div>
                  </div>

                  {/* Signature Content */}
                  <div className="flex flex-col items-center gap-2 group/signature">
                    <p className="text-[#042970] font-bold text-lg lg:text-xl group-hover/signature:text-[#F54927] transition-colors text-center">
                      Eng. Endale Abdisa
                    </p>
                    <p className="text-[#F54927] font-semibold text-base lg:text-lg group-hover/signature:text-[#042970] transition-colors text-center">
                      CEO and General Manager
                    </p>
                  </div>

                  {/* Bottom decorative lines */}
                  <div className="w-full flex items-center gap-4 mt-6 group/lines">
                    <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-[#F54927] to-[#F54927] group-hover/lines:h-[3px] transition-all duration-300"></div>
                    <div className="w-3 h-3 bg-[#042970] rounded-full group-hover/lines:scale-125 group-hover/lines:bg-[#F54927] transition-all duration-300"></div>
                    <div className="flex-1 h-[2px] bg-gradient-to-l from-transparent via-[#042970] to-[#042970] group-hover/lines:h-[3px] transition-all duration-300"></div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* View Our Team Button */}
        <Reveal variant="up" delay={300}>
          <div className="mt-12 md:mt-16 flex justify-center">
            <Link
              href="/teams"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#F54927] to-[#d63e1f] hover:from-[#042970] hover:to-[#042970] text-white px-8 py-4 rounded-xl font-bold text-base lg:text-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 group animated-gradient"
            >
              <HiOutlineUserGroup className="w-5 h-5 lg:w-6 lg:h-6 group-hover:scale-110 transition-transform" />
              <span>View our Team</span>
              <HiOutlineArrowRight className="w-5 h-5 lg:w-6 lg:h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default CEOSection;

