'use client'

import { Copy, Pencil } from '@/app/components'
import { useCopyToClipboard } from '@/app/components/CopyToClipboard'
import Iconner from '@/app/components/Iconner'
import { MethodInfo as MethodModel } from '@prisma/client'
import ItemContainer from './ItemContainer'

interface Props {
  method?: MethodModel[]
}

const MethodInfo = ({ method }: Props) => {
  const { copy: handleCopy } = useCopyToClipboard()
  if (!method) return

  return (
    <section className="compo">
      <ItemContainer title="Method Info">
        {method.map(m => (
          <div key={m.id} className="border rounded-xl p-4 shadow-sm">
            <Iconner Icon={Pencil} />
            <p>
              <strong>Name:</strong> {m.methodName}
            </p>
            <p>
              <strong>URL:</strong>
              {m.url}

              <Iconner Icon={Copy} func={() => handleCopy(m.url)} />
            </p>
            <p>
              <strong>Username:</strong> {m.username}
            </p>
            <p>
              <strong>Password:</strong> {m.password}
              <Iconner Icon={Copy} func={() => handleCopy(m.password)} />
            </p>
            <p>
              <strong>Notes:</strong> {m.notes}
            </p>
          </div>
        ))}
      </ItemContainer>
    </section>
  )
}

export default MethodInfo
