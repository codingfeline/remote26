'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function BottomLogo() {
  const path = usePathname()

  if (path !== '/contact') return null

  return (
    <div>
      <motion.form initial={{ y: -520 }} animate={{ y: 0, x: -3 }}>
        <div className="opacity-30">
          <div className="absolute bg-cover bg-[url(/logo.webp)] h-20 w-20 bottom-4 right-1 bg-opacity-10 "></div>
        </div>
      </motion.form>
    </div>
  )
}
