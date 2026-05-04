'use client'

import { ConfirmDelete, Copy, Pencil } from '@/app/components'
import { useCopyToClipboard } from '@/app/components/CopyToClipboard'
import Iconner from '@/app/components/Iconner'
import { DevicePassword as Device } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import ItemContainer from './ItemContainer'

interface Props {
  devicePasswords: Device[]
  cid: string
}

const DeviceInfo = ({ devicePasswords: device, cid }: Props) => {
  const { copy: handleCopy } = useCopyToClipboard()
  const router = useRouter()

  const handleDelete = async (id: string) => {
    await axios.delete(`/api/customers/${cid}/device/${id}`)
    router.refresh()
  }

  if (!device) return

  return (
    <section className="compo">
      <ItemContainer title="Device">
        {device.map(s => (
          <div key={s.id} className="border border-violet-400 rounded-t-lg shadow-sm overflow-hidden">
            <div className="flex justify-between bg-violet-200 px-4 py-2">
              <Iconner href={`/customer/${cid}/device/${s.id}`} Icon={Pencil} />
              <ConfirmDelete onConfirm={() => handleDelete(s.id)} />
            </div>
            <div className="p-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 items-baseline">
              <strong className="text-right">Make:</strong>
              <span>{s.make}</span>

              <strong className="text-right">Username:</strong>
              <span className="flex items-center justify-between">{s.username}{s.username && <Iconner Icon={Copy} func={() => handleCopy(s.username)} />}</span>

              <strong className="text-right">Password:</strong>
              <span className="flex items-center justify-between">{s.password}{s.password && <Iconner Icon={Copy} func={() => handleCopy(s.password!)} />}</span>
            </div>
          </div>
        ))}
      </ItemContainer>
    </section>
  )
}

export default DeviceInfo
