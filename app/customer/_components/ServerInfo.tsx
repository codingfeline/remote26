'use client'

import { ConfirmDelete, Copy, Pencil } from '@/app/components'
import { useCopyToClipboard } from '@/app/components/CopyToClipboard'
import Iconner from '@/app/components/Iconner'
import { Server as ServerModel } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import ItemContainer from './ItemContainer'

interface Props {
  server: ServerModel[]
  cid: string
}

const ServerInfo = ({ server, cid }: Props) => {
  const { copy: handleCopy } = useCopyToClipboard()
  const router = useRouter()

  const handleDelete = async (id: string) => {
    await axios.delete(`/api/customers/${cid}/server/${id}`)
    router.refresh()
  }

  if (!server) return

  return (
    <section className="compo">
      <ItemContainer title="Server">
        {server.map(s => (
          <div key={s.id} className="border rounded-xl p-4">
            <div className="flex justify-between">
              <Iconner href={`/customer/${cid}/server/${s.id}`} Icon={Pencil} />
              <ConfirmDelete onConfirm={() => handleDelete(s.id)} />
            </div>
            <p>
              <strong>Name:</strong> {s.name}
            </p>
            <p>
              <strong>IP:</strong> {s.ip}
              <Iconner Icon={Copy} func={() => handleCopy(s.ip)} />
            </p>
            <p>
              <strong>username:</strong> {s.username}
              <Iconner Icon={Copy} func={() => handleCopy(s.username)} />
            </p>
            <p>
              <strong>Password:</strong> {s.password}
              <Iconner Icon={Copy} func={() => handleCopy(s.password)} />
            </p>
            <p>
              <strong>Notes:</strong> {s.notes}
              <Iconner
                Icon={Copy}
                {...(s.notes && { func: () => handleCopy(s.notes!) })}
                // only add func if notes is not empty
              />
            </p>
          </div>
        ))}
      </ItemContainer>
    </section>
  )
}

export default ServerInfo
