'use client';

import { useEffect, useRef, useState } from 'react';

interface MarqueeItem {
  quote: string;
  author: string;
}

interface InfiniteMarqueeProps {
  items: MarqueeItem[];
  speed?: number;
}

export default function InfiniteMarquee({ items, speed = 30 }: InfiniteMarqueeProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const [gsapLoaded, setGsapLoaded] = useState(false);

  useEffect(() => {
    // First check if GSAP is available
    const loadGsap = async () => {
      try {
        const gsapModule = await import('gsap').catch(() => null);
        if (gsapModule) {
          setGsapLoaded(true);
        }
      } catch (err) {
        console.warn('GSAP could not be loaded for animations:', err);
      }
    };
    
    loadGsap();
  }, []);

  useEffect(() => {
    if (!marqueeRef.current || !marqueeInnerRef.current || !gsapLoaded) return;
    
    // This code only runs if GSAP is successfully loaded
    const loadMarqueeAnimation = async () => {
      try {
        const { gsap } = await import('gsap');
        
        const marqueeElement = marqueeRef.current;
        const marqueeInnerElement = marqueeInnerRef.current;
        
        if (!marqueeElement || !marqueeInnerElement) return;
        
        // Clone the inner content for seamless looping
        const clone = marqueeInnerElement.cloneNode(true);
        marqueeElement.appendChild(clone);
        
        // Calculate animation duration based on content width and desired speed
        const calculateDuration = () => {
          if (!marqueeInnerElement) return 10; // default duration
          const marqueeWidth = marqueeInnerElement.offsetWidth;
          return marqueeWidth / speed;
        };
        
        // Set up GSAP animation
        const tl = gsap.timeline({ repeat: -1 });
        
        const animateMarquee = () => {
          if (!marqueeElement || !marqueeInnerElement) return;
          
          const duration = calculateDuration();
          
          tl.clear();
          tl.to(marqueeElement.children, {
            x: `-${marqueeInnerElement.offsetWidth}px`,
            duration: duration,
            ease: 'none',
          });
        };
        
        // Initial animation
        animateMarquee();
        
        // Update animation on window resize
        const handleResize = () => {
          animateMarquee();
        };
        
        window.addEventListener('resize', handleResize);
        return () => {
          window.removeEventListener('resize', handleResize);
          tl.kill();
        };
      } catch (err) {
        console.warn('Failed to initialize marquee animation:', err);
      }
    };
    
    if (gsapLoaded) {
      loadMarqueeAnimation();
    }
  }, [speed, items, gsapLoaded]);

  // CSS-only marquee animation as fallback if GSAP is not available
  if (!gsapLoaded) {
    return (
      <div className="overflow-hidden">
        <div className="flex space-x-6 marquee-container py-4">
          {items.map((item, index) => (
            <div key={index} className="p-6 rounded-lg min-w-[350px] max-w-sm" 
                 style={{
                   backdropFilter: 'blur(12px)',
                   backgroundColor: 'rgba(21,21,21,0.7)',
                   border: '1px solid rgba(51,51,51,0.2)',
                   boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
                 }}>
              <blockquote className="text-white">
                <svg className="h-6 w-6 text-accent mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-white/90 italic mb-4">{item.quote}</p>
                <footer className="text-sm text-white/70">
                  — {item.author}
                </footer>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div ref={marqueeRef} className="flex whitespace-nowrap">
        <div ref={marqueeInnerRef} className="flex space-x-6">
          {items.map((item, index) => (
            <div key={index} className="p-6 rounded-lg min-w-[350px] max-w-sm"
                 style={{
                   backdropFilter: 'blur(12px)',
                   backgroundColor: 'rgba(21,21,21,0.7)',
                   border: '1px solid rgba(51,51,51,0.2)',
                   boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
                 }}>
              <blockquote className="text-white">
                <svg className="h-6 w-6 text-accent mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-white/90 italic mb-4">{item.quote}</p>
                <footer className="text-sm text-white/70">
                  — {item.author}
                </footer>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}