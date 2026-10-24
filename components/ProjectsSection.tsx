'use client';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';
import Reveal from './Reveal';
import Link from 'next/link';
import { useOwnedScrollAnimations } from '../lib/scrollAnimations';

interface Project {
  id: number;
  title: string;
  category?: string;
  year?: string | number;
  description?: string;
  short_description?: string;
  image_url?: string;
  image?: string;
  photos?: Array<string | { path?: string; url?: string; src?: string }>;
}

const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  useOwnedScrollAnimations(sectionRef, [loading, error, projects.length]);

  const apiCall = axios.create({
    baseURL: 'https://api.efengineering-architect.com/api/',
    headers: { 'Content-Type': 'application/json' },
  });

  const getProjectImageUrl = (project: Project) => {
    if (project.photos && project.photos.length > 0) {
      const first = project.photos[0];
      if (typeof first === 'string') return first;
      return first?.path || first?.url || first?.src || '';
    }
    return project.image_url || project.image || '/placeholder.jpg';
  };

  useEffect(() => {
    const fetchProjects = async (retryCount = 0) => {
      const MAX_RETRIES = 2;
      const RETRY_DELAY = 1000; // 1 second

      try {
        setLoading(true);
        setError(false);

        const response = await apiCall.get('projects', {
          timeout: 10000, // 10 second timeout
          headers: {
            'Accept': 'application/json',
          }
        });

        if (response.status === 200) {
          const data = response.data as any;
          // Handle both array and object with data property
          const projectsArray = Array.isArray(data) ? data : (data?.data || []);
          if (projectsArray.length > 0) {
            setProjects(projectsArray);
          } else {
            console.warn("Projects API returned empty array");
            setError(true);
          }
        } else {
          console.error("Projects API returned non-200 status:", response.status);
          setError(true);
        }
      } catch (err: any) {
        console.error('Error fetching projects:', err);
        
        // Retry logic for network errors
        const isNetworkError = err.code === 'NETWORK_ERROR' || 
                              err.code === 'ECONNABORTED' ||
                              err.message === 'Network Error' || 
                              err.message === 'timeout of 10000ms exceeded' ||
                              !err.response;
        
        if (retryCount < MAX_RETRIES && isNetworkError) {
          console.log(`Retrying projects fetch (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
          setTimeout(() => {
            fetchProjects(retryCount + 1);
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
    fetchProjects();
  }, []);

  const scrollContainer = (dir: 'left' | 'right') => {
    const container = document.getElementById('projects-scroll');
    if (container) {
      const scrollAmount = dir === 'left' ? -500 : 500;
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return (
      <section ref={sectionRef} data-bind-own-animations className="py-20 text-center bg-white">
        <p className="text-lg text-gray-500">Loading projects...</p>
      </section>
    );
  }

  if (error || projects.length === 0) {
    return (
      <section ref={sectionRef} data-bind-own-animations className="py-20 text-center bg-white">
        <p className="text-lg text-gray-500">No projects found.</p>
      </section>
    );
  }

  return (
    <section ref={sectionRef} data-bind-own-animations data-scroll-section className="relative py-24 md:py-32 bg-white overflow-hidden engineering-bg">
      {/* Floating shapes */}
      <div className="absolute top-20 left-20 w-24 h-24 border-2 border-[#042970]/10 rounded-full animate-float hidden lg:block"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 border-2 border-[#F54927]/10 rounded-lg rotate-45 animate-float-reverse hidden lg:block"></div>

      {/* Header */}
      <Reveal>
        <div className="text-center mb-16 relative z-10">
          <p className="uppercase text-xs text-[#F54927] font-bold tracking-[0.3em] mb-4 border-2 border-[#F54927] px-4 py-2 rounded-full inline-block text-fade-in-up">
            OUR PROJECTS
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-4 text-fade-in-up">
            BUILDING{' '}
            <span className="text-[#042970] relative gradient-text">
              LANDMARKS
              <span className="absolute bottom-0 left-0 w-full h-1 bg-[#F54927]"></span>
            </span>{' '}
            THAT INSPIRE
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto micro-float-up text-fade-in-up">
            Showcasing our portfolio of innovative engineering and architectural achievements 
            that transform visions into reality, creating lasting impact and inspiring communities.
          </p>
        </div>
      </Reveal>

      {/* Left Controls */}
      <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-6 z-20">
        <button
          onClick={() => scrollContainer('left')}
          className="p-3 bg-white rounded-full shadow-lg hover:bg-[#F54927] hover:text-white transition-all duration-300 hover:scale-110 group"
          aria-label="Scroll left"
        >
          <FaArrowLeft className="text-gray-700 group-hover:text-white" />
        </button>
        <div className="rotate-[-90deg] tracking-widest text-[#042970] text-sm font-bold">
          {projects.length > 0 ? `01 / ${projects.length.toString().padStart(2, '0')}` : '00 / 00'}
        </div>
        <p className="rotate-[-90deg] text-[10px] tracking-[0.2em] uppercase text-gray-400">
          All Projects
        </p>
        <button
          onClick={() => scrollContainer('right')}
          className="p-3 bg-[#F54927] text-white rounded-full shadow-lg hover:bg-[#042970] transition-all duration-300 hover:scale-110 group"
          aria-label="Scroll right"
        >
          <FaArrowRight />
        </button>
      </div>

      {/* Scrollable Project List */}
      <div
        id="projects-scroll"
        className="
          flex gap-6 
          overflow-x-auto 
          scrollbar-hide 
          scroll-smooth 
          pl-20 md:pl-32 lg:pl-40 
          pr-8 md:pr-20
          transition-all
          pb-8
        "
        style={{ scrollSnapType: 'x proximity' }}
      >
        {projects.slice(0, 7).map((project, index) => (
          <div
            key={project.id}
            onMouseEnter={() => setActive(project.id)}
            onMouseLeave={() => setActive(null)}
            className={`
              relative flex-shrink-0 cursor-pointer transition-all duration-700 ease-out rounded-xl overflow-hidden group
              ${active === project.id
                ? 'w-[650px] md:w-[750px] shadow-2xl'
                : 'w-[220px] md:w-[280px] shadow-lg'
              }
            `}
            style={{ scrollSnapAlign: 'start' }}
          >
            {/* Project Image */}
            <div className="relative w-full h-[550px] overflow-hidden">
              <img
                src={getProjectImageUrl(project)}
                alt={project.title || 'Project'}
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  active === project.id ? 'scale-110' : 'scale-100'
                }`}
                loading="eager"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.jpg';
                }}
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-500 ${
                active === project.id ? 'opacity-100' : 'opacity-0'
              }`}></div>
            </div>

            {/* Hover Overlay */}
            {active === project.id && (
              <div className="absolute inset-0 flex flex-col justify-between p-6">
                {/* Top-right icon */}
                <div className="flex justify-end">
                  <Link 
                    href={`/projects/${project.id}`}
                    className="bg-white p-3 rounded-full shadow-xl hover:bg-[#F54927] hover:text-white transition-all duration-300 hover:scale-110 group"
                  >
                    <FiExternalLink className="w-5 h-5 text-gray-700 group-hover:text-white" />
                  </Link>
                </div>

                {/* Bottom info card */}
                <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-xl animate-scale-in">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {project.title || 'Untitled Project'}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    {project.category && (
                      <span className="px-3 py-1 bg-[#F54927]/10 text-[#F54927] rounded-full font-semibold">
                        {project.category}
                      </span>
                    )}
                    {project.year && (
                      <span className="font-medium">{project.year}</span>
                    )}
                  </div>
                  {project.short_description && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {project.short_description.replace(/<[^>]*>/g, '')}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Inactive state overlay */}
            {active !== project.id && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <h3 className="text-white font-bold text-lg truncate">
                  {project.title || 'Project'}
                </h3>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* View All Link */}
      <Reveal delay={400}>
        <div className="text-center mt-12 relative z-10">
          <Link 
            href="/projects"
            className="inline-flex items-center gap-3 bg-[#042970] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#F54927] transition-all duration-300 hover:shadow-xl hover:scale-105 group"
          >
            VIEW ALL PROJECTS
            <span className="text-xl group-hover:translate-x-2 transition-transform">→</span>
          </Link>
        </div>
      </Reveal>
    </section>
  );
};

export default ProjectsSection;
