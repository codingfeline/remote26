'use client'

import { ConfirmDelete, Copy, Pencil } from '@/app/components'
import { useCopyToClipboard } from '@/app/components/CopyToClipboard'
import Iconner from '@/app/components/Iconner'
import { MethodInfo as MethodModel } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import ItemContainer from './ItemContainer'

interface Props {
  method?: MethodModel[]
  cid: string
}

const MethodInfo = ({ method, cid }: Props) => {
  const { copy: handleCopy } = useCopyToClipboard()
  const router = useRouter()

  const handleDelete = async (id: string) => {
    await axios.delete(`/api/customers/${cid}/method/${id}`)
    router.refresh()
  }

  if (!method) return

  return (
    <section className="compo">
      <ItemContainer title="Method Info">
        {method.map(m => {
          const link = `/customer/${cid}/method/${m.id}`

          return (
            <div key={m.id} className="border border-violet-400 rounded-t-lg shadow-sm overflow-hidden">
              <div className="flex justify-between bg-violet-200 px-4 py-2">
                <Iconner href={link} Icon={Pencil} />
                <ConfirmDelete onConfirm={() => handleDelete(m.id)} />
              </div>
              <div className="p-4">
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
            </div>
          )
        })}
      </ItemContainer>
    </section>
  )
}

export default MethodInfo
