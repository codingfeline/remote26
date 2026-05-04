'use client'

import { ConfirmDelete, Copy, Pencil } from '@/app/components'
import { useCopyToClipboard } from '@/app/components/CopyToClipboard'
import Iconner from '@/app/components/Iconner'
import { SolutionSetup } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import ItemContainer from './ItemContainer'

interface Props {
  solution: SolutionSetup[]
  cid: string
}

const Solution = ({ solution, cid }: Props) => {
  const { copy: handleCopy } = useCopyToClipboard()
  const router = useRouter()

  const handleDelete = async (id: string) => {
    await axios.delete(`/api/customers/${cid}/solution-setup/${id}`)
    router.refresh()
  }

  if (!solution) return

  return (
    <section className="compo">
      <ItemContainer title="Solution Setup">
        {solution.map(s => (
          <div
            key={s.id}
            className="border border-violet-400 rounded-t-lg shadow-sm overflow-hidden"
          >
            <div className="flex justify-between bg-violet-200 px-4 py-2">
              <Iconner href={`/customer/${cid}/solution-setup/${s.id}`} Icon={Pencil} />
              <ConfirmDelete onConfirm={() => handleDelete(s.id)} />
            </div>
            <div className="p-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 items-baseline">
              <strong className="text-right">Comment:</strong>
              <span>{s.comment}</span>

              <strong className="text-right">Path:</strong>
              <span className="flex items-center justify-between">{s.path}{s.path && <Iconner Icon={Copy} func={() => handleCopy(s.path)} />}</span>

              <strong className="text-right">Screenshot:</strong>
              <span className="flex items-center justify-between">{s.screenshot}{s.screenshot && <Iconner Icon={Copy} func={() => handleCopy(s.screenshot)} />}</span>
            </div>
          </div>
        ))}
      </ItemContainer>
    </section>
  )
}

export default Solution
