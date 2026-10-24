"use client";
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineCalendar, HiOutlineChatBubbleLeftRight, HiOutlineArrowRight } from 'react-icons/hi2';
import Reveal from './Reveal';
import { useOwnedScrollAnimations } from '../lib/scrollAnimations';

type NewsPhoto = { path: string };
type NewsItem = {
  id: number;
  title: string;
  created_at?: string;
  image?: string;
  photos?: NewsPhoto[];
  category?: string;
  short_description?: string;
  description?: string;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });
};

const NewsSection = () => {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const sectionRef = useRef<HTMLElement>(null);
  useOwnedScrollAnimations(sectionRef, [items.length, mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const load = async (retryCount = 0) => {
      const MAX_RETRIES = 2;
      const RETRY_DELAY = 1000; // 1 second
      let timeoutId: NodeJS.Timeout | null = null;

      setLoading(true);
      try {
        const controller = new AbortController();
        timeoutId = setTimeout(() => {
          controller.abort();
        }, 10000); // 10 second timeout

        const res = await fetch('https://api.efengineering-architect.com/api/news', {
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
          signal: controller.signal,
        });
        
        // Clear timeout if request completed successfully
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }

        if (res.ok) {
          const jsonData = await res.json();
          const data: NewsItem[] = Array.isArray(jsonData) ? jsonData : (jsonData?.data || []);
          setItems(data);
        } else {
          throw new Error(`HTTP ${res.status}`);
        }
      } catch (e: any) {
        // Clear timeout if it exists
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        
        // Check if it's an abort error (timeout)
        const isAbortError = e.name === 'AbortError' || e.message === 'signal is aborted without reason';
        
        // Retry logic for network errors
        if (retryCount < MAX_RETRIES && (isAbortError || e.message === 'Failed to fetch' || e.message.includes('timeout'))) {
          // Don't log abort errors as they're expected for timeouts
          if (!isAbortError) {
            console.log(`Retrying news fetch (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
          }
          setTimeout(() => {
            load(retryCount + 1);
          }, RETRY_DELAY * (retryCount + 1));
          return;
        }
        
        // Only log non-abort errors
        if (!isAbortError) {
          console.error('Failed to fetch news', e);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const three = (items || []).slice(0, 3);

  const stripHtml = (html?: string) => {
    if (!html) return '';
    let text = html
      .replace(/<!--\[if [\s\S]*?<!\[endif\]-->/gi, '')
      .replace(/<!--[^>]*-->/g, '');
    text = text.replace(/<[^>]+>/g, ' ');
    text = text
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
    return text.replace(/\s+/g, ' ').trim();
  };

  return (
    <section ref={sectionRef} data-bind-own-animations data-scroll-section className="py-24 md:py-32 bg-white engineering-bg relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-20 right-10 w-28 h-28 border-2 border-[#F54927]/10 rounded-full animate-float hidden lg:block"></div>
      <div className="absolute bottom-20 left-10 w-20 h-20 border-2 border-[#042970]/10 rounded-lg rotate-45 animate-float-reverse hidden lg:block"></div>

      <div className="container mx-auto px-4 relative z-10">
        <Reveal>
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12">
            <div className="mb-6 md:mb-0">
              <div className="text-[12px] tracking-[.2em] text-[#F54927] font-bold uppercase mb-3 text-fade-in-up">News & Blog</div>
              <h2 className="text-[34px] md:text-[42px] lg:text-[48px] font-extrabold text-[#111] mb-2 text-fade-in-up">
                Latest{' '}
                <span className="text-[#042970] relative gradient-text">
                  News & Articles
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-[#F54927]"></span>
                </span>
              </h2>
              <p className={`text-gray-600 text-lg max-w-2xl micro-float-up ${mounted ? 'text-fade-in-up' : ''}`}>
                Stay updated with our latest projects, insights, and industry news. 
                Discover innovative solutions, expert perspectives, and groundbreaking achievements 
                in architecture and engineering.
              </p>
            </div>
            <Link 
              href="/news" 
              className="inline-flex items-center gap-2 bg-[#042970] text-white px-6 py-3 font-bold uppercase tracking-wide hover:bg-[#F54927] transition-all duration-300 hover:shadow-xl hover:scale-105 group rounded-lg"
            >
              View All News
              <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading && (
            <div className="col-span-3 text-center py-10 text-gray-500">Loading...</div>
          )}

          {!loading && three.map((news, index) => {
            const imageSrc = news.photos && news.photos.length > 0 ? news.photos[0].path : (news.image || '/images/hero/home.jpg');
            const raw = news.short_description || news.description || '';
            const excerpt = stripHtml(raw);
            return (
                  <Reveal key={news.id} delay={index * 100}>
                    <div className="bg-white shadow-lg rounded-xl overflow-hidden interactive-card-3d card-gradient-animated card-shadow-animated card-border-glow group h-full flex flex-col">
                  <div className="relative h-[240px] md:h-[260px] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={imageSrc} 
                      alt={news.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {news.category && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-[#F54927] text-white text-xs font-bold uppercase rounded-full">
                        {news.category}
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-[22px] font-extrabold text-[#111] leading-snug mb-3 group-hover:text-[#F54927] transition-colors card-text-animate">
                      {news.title}
                    </h3>
                    <div className="flex items-center gap-6 text-[13px] text-gray-500 mb-4 flex-wrap">
                      <div className="flex items-center gap-2 group/icon">
                        <div className="icon-container icon-micro-move icon-float flex items-center justify-center card-icon-animate">
                          <HiOutlineCalendar className="w-4 h-4 text-[#042970] icon-hover icon-glow icon-bounce icon-wiggle icon-full-color group-hover/icon:text-[#F54927] transition-colors flex-shrink-0" />
                        </div>
                        <span className="leading-tight">{formatDate(news.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-2 group/icon">
                        <div className="icon-container icon-micro-move icon-float flex items-center justify-center card-icon-animate">
                          <HiOutlineChatBubbleLeftRight className="w-4 h-4 text-[#F54927] icon-hover icon-glow icon-bounce icon-wiggle icon-full-color group-hover/icon:scale-110 transition-transform flex-shrink-0" />
                        </div>
                        <span className="leading-tight">19 Comments</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-[14px] leading-6 mb-5 line-clamp-2 flex-grow">
                      {excerpt}
                    </p>
                    <Link 
                      href={`/news/${news.id}`} 
                      className="inline-flex items-center gap-2 text-[#042970] hover:text-[#F54927] font-bold uppercase text-[13px] group/link transition-colors"
                    >
                      Read More
                      <span className="group-hover/link:translate-x-2 transition-transform">
                        <HiOutlineArrowRight className="w-4 h-4" />
                      </span>
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

export default NewsSection;
