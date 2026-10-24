/**
 * Global scroll animation utility.
 * Class changes must run after the owning component has hydrated.
 * Dynamic sections opt out of the document pass with data-bind-own-animations
 * and bind themselves from their own effect.
 */
import { useEffect, type DependencyList, type RefObject } from 'react';

const OWNED_ROOT = '[data-bind-own-animations]';

const shouldSkip = (el: Element, root: ParentNode) => {
  const owner = el.closest(OWNED_ROOT);
  if (!owner) return false;
  // Called from the owning component after it has hydrated.
  if (root instanceof Element && (root === owner || owner.contains(root))) return false;
  return true;
};

const collect = (root: ParentNode, selector: string) => {
  const nodes = Array.from(root.querySelectorAll(selector));
  if (root instanceof Element && root.matches(selector)) nodes.unshift(root);
  return nodes;
};

export const initScrollAnimations = (root: ParentNode = document) => {
  if (typeof window === 'undefined') return () => {};

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('scroll-revealed');
        sectionObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        entry.target.classList.add('title-animated');
        titleObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  collect(root, 'section, [data-scroll-section]').forEach((section) => {
    if (shouldSkip(section, root)) return;
    if (!section.classList.contains('scroll-section')) {
      section.classList.add('scroll-section');
    }
    sectionObserver.observe(section);
  });

  collect(root, 'h1, h2, h3, .title-scroll-reveal, [data-title-animate]').forEach((title) => {
    if (shouldSkip(title, root)) return;
    if (title.closest('section[class*="relative"][class*="h-"]')) return;

    const isInsideReveal = title.closest('.reveal-base, [class*="reveal-"]');
    const hasAnimationClass =
      title.classList.contains('title-entrance') ||
      title.classList.contains('text-fade-in-up') ||
      title.classList.contains('text-slide-in-left') ||
      title.classList.contains('text-slide-in-right') ||
      title.classList.contains('text-scale-in') ||
      title.classList.contains('text-shift') ||
      title.classList.contains('title-transition');

    if (!title.classList.contains('title-scroll-reveal') && !isInsideReveal && !hasAnimationClass) {
      title.classList.add('title-scroll-reveal');
    }

    if (title.classList.contains('title-scroll-reveal') || title.hasAttribute('data-title-animate')) {
      titleObserver.observe(title);
    }
  });

  return () => {
    sectionObserver.disconnect();
    titleObserver.disconnect();
  };
};

export const useOwnedScrollAnimations = (
  ref: RefObject<HTMLElement | null>,
  deps: DependencyList = []
) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return initScrollAnimations(el);
    // Caller supplies deps for the tree this ref is attached to.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export const addScrollFadeIn = (element: HTMLElement) => {
  if (typeof window === 'undefined') return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  element.classList.add('fade-in-base');
  observer.observe(element);
};
