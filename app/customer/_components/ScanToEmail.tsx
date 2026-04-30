'use client'

import { Copy, Pencil } from '@/app/components'
import { useCopyToClipboard } from '@/app/components/CopyToClipboard'
import Iconner from '@/app/components/Iconner'
import { ScanToEmail } from '@prisma/client'
import ItemContainer from './ItemContainer'

interface Props {
  scan2e: ScanToEmail[]
  cid: string
}

const ScanToEmailInfo = ({ scan2e, cid }: Props) => {
  const { copy: handleCopy } = useCopyToClipboard()
  if (!scan2e) return

  return (
    <section className="compo">
      <ItemContainer title="Scan To Email">
        {scan2e.map(s => (
          <div key={s.id} className="border rounded-xl p-4">
            <Iconner href={`/customer/${cid}/contact/${s.id}`} Icon={Pencil} />
            <p>
              <strong>hostname:</strong> {s.hostname}
              {s.hostname && <Iconner Icon={Copy} func={() => handleCopy(s.hostname)} />}
            </p>
            <p>
              <strong>username:</strong> {s.username}
              {s.username && <Iconner Icon={Copy} func={() => handleCopy(s.username)} />}
            </p>
            <p>
              <strong>password:</strong> {s.password}
              {s.password && <Iconner Icon={Copy} func={() => handleCopy(s.password)} />}
            </p>
            <p>
              <strong>port:</strong> {s.port}
              {s.port && <Iconner Icon={Copy} func={() => handleCopy(s.port)} />}
            </p>
          </div>
        ))}
      </ItemContainer>
    </section>
  )
}

export default ScanToEmailInfo
