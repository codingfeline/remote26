'use client'

import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useRef, useState } from 'react'

const CustomerSidebar = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (
        !buttonRef.current?.contains(target) &&
        !panelRef.current?.contains(target)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(o => !o)}
        className="md:hidden w-full bg-violet-200 border border-violet-400 rounded-md px-3 py-2 mb-2 text-left font-semibold"
      >
        {open ? 'Hide Customers' : 'Show Customers'}
      </button>
      <div ref={panelRef} className={`${open ? 'block' : 'hidden'} md:block`}>
        {children}
      </div>
    </>
  )
}

export default CustomerSidebar
