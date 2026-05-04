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
          <div
            key={s.id}
            className="border border-violet-400 rounded-t-lg shadow-sm overflow-hidden"
          >
            <div className="flex justify-between bg-violet-200 px-4 py-2">
              <Iconner href={`/customer/${cid}/server/${s.id}`} Icon={Pencil} />
              <ConfirmDelete onConfirm={() => handleDelete(s.id)} />
            </div>
            <div className="p-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 items-baseline">
              <strong className="text-right">Name:</strong>
              <span className="flex items-center justify-between">{s.name}{s.name && <Iconner Icon={Copy} func={() => handleCopy(s.name)} />}</span>

              <strong className="text-right">IP:</strong>
              <span className="flex items-center justify-between">{s.ip}{s.ip && <Iconner Icon={Copy} func={() => handleCopy(s.ip)} />}</span>

              <strong className="text-right">Username:</strong>
              <span className="flex items-center justify-between">{s.username}{s.username && <Iconner Icon={Copy} func={() => handleCopy(s.username)} />}</span>

              <strong className="text-right">Password:</strong>
              <span className="flex items-center justify-between">{s.password}{s.password && <Iconner Icon={Copy} func={() => handleCopy(s.password)} />}</span>

              <strong className="text-right">Notes:</strong>
              <span className="whitespace-pre-wrap">{s.notes}</span>
            </div>
          </div>
        ))}
      </ItemContainer>
    </section>
  )
}

export default ServerInfo
