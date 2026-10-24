'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

type Props = {
  title: string;
  backgroundImage?: string; // path under public
  breadcrumb?: { label: string; href?: string }[];
};

const PageHeader: React.FC<Props> = ({ title, backgroundImage = '/images/pageheader.jpg', breadcrumb = [{ label: 'Home', href: '/' }] }) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const breadcrumbRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate title immediately when component mounts (for page headers)
    setIsVisible(true);
  }, []);

  return (
    <section data-bind-own-animations="true" className="relative min-h-[260px] sm:min-h-[320px] md:min-h-[400px] flex items-center justify-center text-white overflow-hidden pt-24 pb-10 sm:pt-28 sm:pb-12 md:pt-32">
      {/* Background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={backgroundImage} alt={title} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 text-center w-full max-w-5xl mx-auto px-4 sm:px-6">
        <h1 
          ref={titleRef}
          className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-wide leading-tight break-words title-transition ${
            isVisible ? 'title-visible' : ''
          }`}
        >
          {title}
        </h1>
        <div 
          ref={breadcrumbRef}
          className={`mt-4 text-sm md:text-base opacity-90 break-words breadcrumb-transition ${
            isVisible ? 'breadcrumb-visible' : ''
          }`}
        >
          {breadcrumb.map((b, i) => (
            <span key={i}>
              {b.href ? (
                <Link href={b.href} className="hover:text-orange-400">{b.label}</Link>
              ) : (
                <span>{b.label}</span>
              )}
              {i < breadcrumb.length - 1 && <span className="mx-2">›</span>}
            </span>
          ))}
          <span className="mx-2">›</span>
          <span>{title}</span>
        </div>
      </div>
    </section>
  );
};

export default PageHeader;


