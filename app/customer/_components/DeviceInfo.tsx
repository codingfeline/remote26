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
          <div key={s.id} className="border rounded-xl p-4">
            <div className="flex justify-between">
              <Iconner href={`/customer/${cid}/device/${s.id}`} Icon={Pencil} />
              <ConfirmDelete onConfirm={() => handleDelete(s.id)} />
            </div>
            <p>
              <strong>Make:</strong> {s.make}
            </p>
            <p>
              <strong>username:</strong> {s.username}
              {s.username && <Iconner Icon={Copy} func={() => handleCopy(s.username)} />}
            </p>
            <p>
              <strong>password:</strong> {s.password}
              {s.password && <Iconner Icon={Copy} func={() => handleCopy(s.password!)} />}
            </p>
          </div>
        ))}
      </ItemContainer>
    </section>
  )
}

export default DeviceInfo
