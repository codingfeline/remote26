'use client'

import { ArrowUp } from '@/app/components'
import { useEffect, useState } from 'react'

const BackToTop = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 0)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 bg-white border border-gray-300 shadow-md rounded-full p-3 text-gray-500 hover:text-violet-700 hover:border-violet-700 cursor-pointer transition-colors"
      aria-label="Back to top"
    >
      <ArrowUp className="text-xl" />
    </button>
  )
}

export default BackToTop
