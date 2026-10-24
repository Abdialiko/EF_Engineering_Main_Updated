'use client'
import React, { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import Link from 'next/link';
import Reveal from './Reveal';
import { fetchApi, getImageUrl } from '../lib/api';
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineEnvelope, HiOutlineUserGroup } from "react-icons/hi2";

const TeamSection = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 3; // Show 3 items per slide

  useEffect(() => {
    const loadTeams = async () => {
      try {
        setLoading(true);
        const data = await fetchApi('teams');
        const teamList = Array.isArray(data) ? data : [];
        setTeams(teamList);
      } catch (e) {
        console.error('Failed to load teams:', e);
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };
    loadTeams();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    const totalSlides = Math.ceil(teams.length / itemsPerPage);
    if (totalSlides <= 1 || isPaused) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5000); // Change slide every 5 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [teams.length, isPaused, itemsPerPage]);

  const totalSlides = Math.ceil(teams.length / itemsPerPage);
  const currentTeams = teams.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000); // Resume auto-slide after 10 seconds
  };

  const nextSlide = () => {
    goToSlide((currentIndex + 1) % totalSlides);
  };

  const prevSlide = () => {
    goToSlide((currentIndex - 1 + totalSlides) % totalSlides);
  };

  const getPhoto = (member: any) => {
    return getImageUrl(member, '/images/hero/home.jpg');
  };

  return (
    <section className="bg-gradient-to-br from-white via-gray-50 to-white py-24 md:py-32 overflow-hidden engineering-bg relative">
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
              Our Professionals
            </p>
            <h2 className="font-extrabold text-gray-900 leading-tight mb-4 text-3xl md:text-4xl lg:text-5xl">
              <span className="relative inline-block">
                Meet{' '}
                <span className="text-[#042970] relative gradient-text inline-block">
                  Our Team
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-[#F54927] animate-underline-expand"></span>
                </span>
              </span>
            </h2>
            <p className="text-gray-600 text-base lg:text-lg max-w-2xl mx-auto mt-4">
              Experienced professionals dedicated to delivering excellence in every project
            </p>
          </div>
        </Reveal>

        {/* Team Carousel */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {new Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : teams.length > 0 ? (
          <div className="relative">
            {/* Carousel Container */}
            <div 
              ref={carouselRef}
              className="relative overflow-hidden rounded-2xl"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Team Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {currentTeams.map((member: any, index: number) => {
                  const photo = getPhoto(member);
                  const name = member.name || `${member.f_name || ''} ${member.m_name || ''} ${member.l_name || ''}`.trim() || 'Team Member';
                  const title = member.role || member.position || member.profession || 'Team Member';
                  const email = member.email || member.email_address || '';

                  return (
                    <Reveal key={member.id || index} variant="up" delay={index * 100}>
                      <Link 
                        href={`/teams/${member.id}`}
                        className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 interactive-card-3d group hover:shadow-2xl hover:scale-105 block"
                      >
                        {/* Image Container */}
                        <div className="relative h-64 md:h-72 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                          <Image
                            src={photo}
                            alt={name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          {/* Overlay on hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>

                        {/* Content */}
                        <div className="p-6 bg-white">
                          <h3 className="text-xl font-extrabold text-gray-900 mb-1 group-hover:text-[#F54927] transition-colors">
                            {name}
                          </h3>
                          <p className="text-[#042970] font-semibold text-sm mb-4 group-hover:text-[#F54927] transition-colors">
                            {title}
                          </p>
                          
                          {/* Email */}
                          {email && (
                            <div className="flex items-center gap-2 text-gray-600 text-sm group-hover:text-[#042970] transition-colors">
                              <HiOutlineEnvelope className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{email}</span>
                            </div>
                          )}
                        </div>
                      </Link>
                    </Reveal>
                  );
                })}
              </div>
            </div>

            {/* Navigation Controls */}
            {totalSlides > 1 && (
              <>
                {/* Previous Button */}
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-8 z-10 w-12 h-12 lg:w-14 lg:h-14 bg-white hover:bg-[#F54927] rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group border-2 border-gray-200 hover:border-[#F54927]"
                  aria-label="Previous slide"
                >
                  <HiOutlineChevronLeft className="w-6 h-6 lg:w-7 lg:h-7 text-gray-700 group-hover:text-white transition-colors" />
                </button>

                {/* Next Button */}
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-8 z-10 w-12 h-12 lg:w-14 lg:h-14 bg-white hover:bg-[#F54927] rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group border-2 border-gray-200 hover:border-[#F54927]"
                  aria-label="Next slide"
                >
                  <HiOutlineChevronRight className="w-6 h-6 lg:w-7 lg:h-7 text-gray-700 group-hover:text-white transition-colors" />
                </button>

                {/* Dots Indicator */}
                <div className="flex justify-center items-center gap-2 mt-8">
                  {Array.from({ length: totalSlides }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? 'bg-[#F54927] w-8 scale-110'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* View All Teams Button */}
            <Reveal variant="up" delay={300}>
              <div className="mt-12 flex justify-center">
                <Link
                  href="/teams"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-[#042970] to-[#042970] hover:from-[#F54927] hover:to-[#d63e1f] text-white px-8 py-4 rounded-xl font-bold text-base lg:text-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 group animated-gradient"
                >
                  <HiOutlineUserGroup className="w-5 h-5 lg:w-6 lg:h-6 group-hover:scale-110 transition-transform" />
                  <span>View All Team Members</span>
                  <HiOutlineChevronRight className="w-5 h-5 lg:w-6 lg:h-6 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </Reveal>
          </div>
        ) : (
          <Reveal variant="up">
            <div className="text-center py-12">
              <HiOutlineUserGroup className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No team members available at the moment.</p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
};

export default TeamSection;

