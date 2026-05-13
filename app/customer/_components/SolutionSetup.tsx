'use client'

import { ConfirmDelete, Pencil } from '@/app/components'
import Iconner from '@/app/components/Iconner'
import { SolutionSetup } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ItemContainer from './ItemContainer'

interface Props {
  solution: SolutionSetup[]
  cid: string
}

const Solution = ({ solution, cid }: Props) => {
  const router = useRouter()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const handleDelete = async (id: string) => {
    await axios.delete(`/api/customers/${cid}/solution-setup/${id}`)
    router.refresh()
  }

  useEffect(() => {
    if (openIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIndex(null)
      if (e.key === 'ArrowRight' && solution.length > 1) {
        setOpenIndex(i => (i === null ? null : (i + 1) % solution.length))
      }
      if (e.key === 'ArrowLeft' && solution.length > 1) {
        setOpenIndex(i =>
          i === null ? null : (i - 1 + solution.length) % solution.length,
        )
      }
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [openIndex, solution.length])

  if (!solution) return

  const current = openIndex !== null ? solution[openIndex] : null
  const showNav = solution.length > 1

  return (
    <section className="compo">
      <ItemContainer title="Solution Setup">
        {solution.map((s, i) => (
          <div
            key={s.id}
            className="border border-violet-400 rounded-t-lg shadow-sm overflow-hidden"
          >
            <div className="flex justify-between bg-violet-200 px-4 py-2">
              <Iconner href={`/customer/${cid}/solution-setup/${s.id}`} Icon={Pencil} />
              <ConfirmDelete
                onConfirm={() => handleDelete(s.id)}
                title="Archive solution setup"
                description="This solution setup will be moved to the archived list. You can restore it later."
                confirmLabel="Archive"
              />
            </div>
            <div className="p-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 items-start">
              <strong className="text-right">Comment:</strong>
              <span>{s.comment}</span>

              <strong className="text-right">Screenshot:</strong>
              <span className="flex items-start gap-2">
                {s.screenshot && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`/api/blob?url=${encodeURIComponent(s.screenshot)}`}
                    alt="Screenshot"
                    className="h-16 rounded border cursor-zoom-in object-cover"
                    onClick={() => setOpenIndex(i)}
                  />
                )}
              </span>
            </div>
          </div>
        ))}
      </ItemContainer>

      {current && (
        <div
          onClick={() => setOpenIndex(null)}
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-lg shadow-2xl max-w-[90vw] max-h-[90vh] flex flex-col cursor-default"
          >
            <div className="px-4 py-3 border-b">
              <p className="text-gray-800 whitespace-pre-wrap">
                {current.comment || '—'}
              </p>
            </div>
            <div className="relative flex-1 flex items-center justify-center bg-gray-100 overflow-auto min-h-[200px]">
              {current.screenshot ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/api/blob?url=${encodeURIComponent(current.screenshot)}`}
                  alt="Screenshot"
                  className="max-h-[70vh] max-w-full"
                />
              ) : (
                <p className="text-gray-500 p-10">No screenshot</p>
              )}
              {showNav && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenIndex(i =>
                        i === null
                          ? null
                          : (i - 1 + solution.length) % solution.length,
                      )
                    }
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border border-gray-300 rounded-full w-9 h-9 flex items-center justify-center text-xl leading-none"
                    aria-label="Previous"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenIndex(i =>
                        i === null ? null : (i + 1) % solution.length,
                      )
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border border-gray-300 rounded-full w-9 h-9 flex items-center justify-center text-xl leading-none"
                    aria-label="Next"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
            {showNav && (
              <div className="px-4 py-2 text-xs text-gray-500 text-center border-t">
                {(openIndex ?? 0) + 1} of {solution.length}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default Solution
