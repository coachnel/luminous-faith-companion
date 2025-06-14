
import React, { useState, useEffect, useRef } from 'react';

interface LazyLoadComponentProps {
  children: React.ReactNode;
  className?: string;
  placeholder?: React.ReactNode;
  threshold?: number;
}

const LazyLoadComponent: React.FC<LazyLoadComponentProps> = ({
  children,
  className = '',
  placeholder = null,
  threshold = 0.1
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasLoaded(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} className={className}>
      {hasLoaded ? children : placeholder}
    </div>
  );
};

export default LazyLoadComponent;
