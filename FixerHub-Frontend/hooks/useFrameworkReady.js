import { useEffect } from 'react';

export function useFrameworkReady() {
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.frameworkReady === 'function') {
      window.frameworkReady();
    }
  }, []);
}
