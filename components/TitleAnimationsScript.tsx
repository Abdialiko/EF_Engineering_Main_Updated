'use client';
import { useEffect } from 'react';
import { initScrollAnimations } from '../lib/scrollAnimations';

export default function TitleAnimationsScript() {
  useEffect(() => {
    // Runs after this component hydrates. Subtrees marked
    // data-bind-own-animations are skipped until they bind themselves.
    return initScrollAnimations(document);
  }, []);

  return null;
}
