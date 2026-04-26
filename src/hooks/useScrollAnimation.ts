import { useEffect, useRef } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const elementRef = useRef<HTMLElement>(null);

  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    delay = 0
  } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add delay if specified
            setTimeout(() => {
              entry.target.classList.add('animated');
            }, delay);

            // Disconnect if triggerOnce is true
            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            // Remove animation class if not triggerOnce
            entry.target.classList.remove('animated');
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, delay]);

  return elementRef;
};

// Hook for staggered animations (multiple elements)
export const useStaggeredAnimation = (
  itemsCount: number,
  options: UseScrollAnimationOptions & { staggerDelay?: number } = {}
) => {
  const containerRef = useRef<HTMLElement>(null);

  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    staggerDelay = 100
  } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const children = Array.from(entry.target.children);

            children.forEach((child, index) => {
              setTimeout(() => {
                child.classList.add('animated');
              }, index * staggerDelay);
            });

            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            const children = Array.from(entry.target.children);
            children.forEach((child) => {
              child.classList.remove('animated');
            });
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [itemsCount, threshold, rootMargin, triggerOnce, staggerDelay]);

  return containerRef;
};

// Hook for hero animations (triggers on mount)
export const useHeroAnimation = () => {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    // Trigger hero animations immediately
    const elements = hero.querySelectorAll('.hero-title, .hero-description, .hero-buttons, .hero-image');
    elements.forEach((element) => {
      element.classList.add('animated');
    });
  }, []);

  return heroRef;
};