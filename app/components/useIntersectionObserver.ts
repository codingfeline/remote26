'use client'

import { RefObject, useEffect, useRef } from 'react'

interface UseIntersectionOptions {
  threshold?: number
  rootMargin?: string
  directionClass: string
}

export function useIntersectionObserver({
  threshold = 0.1,
  rootMargin = '0px',
  directionClass,
}: UseIntersectionOptions): RefObject<HTMLDivElement | null> {
  const elementRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const node = elementRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('opacity-100', 'translate-x-0', 'translate-y-0')
          node.classList.remove('opacity-0', directionClass)
        }
        // else {
        //   node.classList.add('opacity-0', directionClass)
        //   node.classList.remove('opacity-100', 'translate-x-0', 'translate-y-0')
        // }
      },
      { threshold, rootMargin }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [directionClass, threshold, rootMargin])

  return elementRef
}