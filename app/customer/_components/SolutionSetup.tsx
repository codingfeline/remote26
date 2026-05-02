'use client'

import { Copy, Pencil } from '@/app/components'
import { useCopyToClipboard } from '@/app/components/CopyToClipboard'
import Iconner from '@/app/components/Iconner'
import { SolutionSetup } from '@prisma/client'
import ItemContainer from './ItemContainer'

interface Props {
  solution: SolutionSetup[]
  cid: string
}

const Solution = ({ solution, cid }: Props) => {
  const { copy: handleCopy } = useCopyToClipboard()
  if (!solution) return

  return (
    <section className="compo">
      <ItemContainer title="Solution Setup">
        {solution.map(s => (
          <div key={s.id} className="border border-violet-400 rounded-t-lg shadow-sm overflow-hidden">
            <div className="flex bg-violet-200 px-4 py-2">
              <Iconner href={`/customer/${cid}/solution/${s.id}`} Icon={Pencil} />
            </div>
            <div className="p-4">
            <p>
              <strong>Comment:</strong> {s.comment}
            </p>
            <p>
              <strong>Path:</strong> {s.path}
              {s.path && <Iconner Icon={Copy} func={() => handleCopy(s.path)} />}
            </p>
            <p>
              <strong>Screenshot:</strong> {s.screenshot}
              {s.screenshot && (
                <Iconner Icon={Copy} func={() => handleCopy(s.screenshot)} />
              )}
            </p>
            </div>
          </div>
        ))}
      </ItemContainer>
    </section>
  )
}

export default Solution
