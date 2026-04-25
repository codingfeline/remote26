'use client'

import { Copy, Pencil } from '@/app/components'
import { useCopyToClipboard } from '@/app/components/CopyToClipboard'
import Iconner from '@/app/components/Iconner'
import { MethodInfo as MethodModel } from '@prisma/client'
import ItemContainer from './ItemContainer'

interface Props {
  method?: MethodModel[]
  cid: string
}

const MethodInfo = ({ method, cid }: Props) => {
  const { copy: handleCopy } = useCopyToClipboard()
  if (!method) return

  return (
    <section className="compo">
      <ItemContainer title="Method Info">
        {method.map(m => {
          const link = `/customer/${cid}/method/${m.id}`

          return (
            <div key={m.id} className="border rounded-lg p-4 shadow-sm">
              <Iconner href={link} Icon={Pencil} />
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
                <Iconner Icon={Copy} func={() => handleCopy(m.username)} />
              </p>
              <p>
                <strong>Password:</strong> {m.password}
                <Iconner Icon={Copy} func={() => handleCopy(m.password)} />
              </p>
              <p className="note">
                <strong>Notes:</strong>{' '}
                <span className="flex self-start whitespace-pre">{m.notes}</span>
              </p>
            </div>
          )
        })}
      </ItemContainer>
    </section>
  )
}

export default MethodInfo
