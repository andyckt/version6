"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useCallback } from 'react';

/**
 * A hook for optimized navigation that prefetches common routes
 * and provides a consistent navigation API
 */
export function useNavigation() {
  const router = useRouter();

  // Prefetch common routes when the component using this hook mounts
  useEffect(() => {
    // Add routes that are commonly navigated to
    const commonRoutes = ['/account', '/', '/post/new', '/booklet'];
    commonRoutes.forEach(route => router.prefetch(route));
  }, [router]);

  // Callback for route navigation with consistent behavior
  const navigate = useCallback((path: string) => {
    // Analytics tracking could be added here
    router.push(path);
  }, [router]);

  // Replace current URL without adding to history stack
  const replace = useCallback((path: string) => {
    router.replace(path);
  }, [router]);

  return {
    navigate,
    replace,
    back: router.back,
    forward: router.forward,
    // Add the raw router for advanced use cases
    router
  };
} 