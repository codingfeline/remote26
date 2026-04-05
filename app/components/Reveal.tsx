'use client'

import { useIntersectionObserver } from './useIntersectionObserver'

interface RevealProps {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right'
}

export default function Reveal({ children, delay = 0, direction = 'up' }: RevealProps) {
  const directionClasses = {
    up: 'translate-y-10',
    left: '-translate-x-10',
    right: 'translate-x-10',
  }

  const startClass = directionClasses[direction]

  // Use our custom hook!
  const ref = useIntersectionObserver({ directionClass: startClass })

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out opacity-0 ${startClass}`}
    >
      {children}
    </div>
  )
}
