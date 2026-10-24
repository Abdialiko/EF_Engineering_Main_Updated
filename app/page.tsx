'use client';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import HeroSection from '../components/HeroSection';

// Fast loading skeleton component
const FastSkeleton = ({ height = '400px' }: { height?: string }) => (
  <div className={`min-h-[${height}] bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 animate-pulse`} style={{ animationDuration: '1s' }} />
);

// Lazy load components below the fold for better initial load performance
const AboutSection = dynamic(() => import('../components/AboutSection'), {
  loading: () => <FastSkeleton height="400px" />,
  ssr: true,
});

const ServicesSection = dynamic(() => import('../components/ServicesSection'), {
  loading: () => <FastSkeleton height="400px" />,
  ssr: true,
});

const ProjectsSection = dynamic(() => import('../components/ProjectsSection'), {
  loading: () => <FastSkeleton height="400px" />,
  ssr: true,
});

const StatsSection = dynamic(() => import('../components/StatsSection'), {
  loading: () => <FastSkeleton height="200px" />,
  ssr: true,
});

const WhyChooseUsSection = dynamic(() => import('../components/WhyChooseUsSection'), {
  loading: () => <FastSkeleton height="500px" />,
  ssr: true,
});

const CEOSection = dynamic(() => import('../components/CEOSection'), {
  loading: () => <FastSkeleton height="400px" />,
  ssr: true,
});

const NewsSection = dynamic(() => import('../components/NewsSection'), {
  loading: () => <FastSkeleton height="400px" />,
  ssr: true,
});

const ClientsSection = dynamic(() => import('../components/ClientsSection'), {
  loading: () => <FastSkeleton height="300px" />,
  ssr: true,
});

const ContactSection = dynamic(() => import('../components/ContactSection'), {
  loading: () => null,
  ssr: true,
});

export default function Home() {
  return (
    <div className="relative">
      <main className="relative">
        <HeroSection />
        <div className="relative z-10">
          <Suspense fallback={<FastSkeleton height="400px" />}>
            <AboutSection />
          </Suspense>
          <Suspense fallback={<FastSkeleton height="400px" />}>
            <ServicesSection />
          </Suspense>
          <Suspense fallback={<FastSkeleton height="400px" />}>
            <ProjectsSection />
          </Suspense>
          <Suspense fallback={<FastSkeleton height="200px" />}>
            <StatsSection />
          </Suspense>
          <Suspense fallback={<FastSkeleton height="500px" />}>
            <WhyChooseUsSection />
          </Suspense>
          <Suspense fallback={<FastSkeleton height="400px" />}>
            <CEOSection />
          </Suspense>
          <Suspense fallback={<FastSkeleton height="400px" />}>
            <NewsSection />
          </Suspense>
          <Suspense fallback={<FastSkeleton height="300px" />}>
            <ClientsSection />
          </Suspense>
          <Suspense fallback={null}>
            <ContactSection />
          </Suspense>
        </div>
      </main>
    </div>
  );
}