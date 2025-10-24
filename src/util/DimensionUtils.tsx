import { useState, useEffect } from 'react';

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

/**
 * This component must be executed inside @docusaurus/BrowserOnly
 * 
 * @returns window's dimensions reacted to resizing
 */
export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

export function isWideScreen() {
  const windowDimensions = useWindowDimensions()
  return windowDimensions.width > 996;
}