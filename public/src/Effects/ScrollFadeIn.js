import React, { useEffect, useRef } from 'react';
import { animateScroll as scroll } from 'react-scroll';

const ScrollFadeIn = ({ children }) => {
  const elementRef = useRef();

  const handleScroll = () => {
    const element = elementRef.current;

    if (element && element.getBoundingClientRect().top < window.innerHeight) {
      element.classList.add('fade-in');
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={elementRef} className="scroll-fade-in">
      {children}
    </div>
  );
};

export default ScrollFadeIn;
