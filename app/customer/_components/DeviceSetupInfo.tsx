'use client'

import { ConfirmDelete, Copy, Pencil } from '@/app/components'
import { useCopyToClipboard } from '@/app/components/CopyToClipboard'
import Iconner from '@/app/components/Iconner'
import { DeviceSetup } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import ItemContainer from './ItemContainer'

interface Props {
  deviceSetup: DeviceSetup[]
  cid: string
}

const DeviceSetupInfo = ({ deviceSetup, cid }: Props) => {
  const { copy: handleCopy } = useCopyToClipboard()
  const router = useRouter()

  const handleDelete = async (id: string) => {
    await axios.delete(`/api/customers/${cid}/device-setup/${id}`)
    router.refresh()
  }

  if (!deviceSetup) return

  return (
    <section className="compo">
      <ItemContainer title="Device Setup">
        {deviceSetup.map(s => (
          <div key={s.id} className="border border-violet-400 rounded-t-lg shadow-sm overflow-hidden">
            <div className="flex justify-between bg-violet-200 px-4 py-2">
              <Iconner href={`/customer/${cid}/device-setup/${s.id}`} Icon={Pencil} />
              <ConfirmDelete onConfirm={() => handleDelete(s.id)} />
            </div>
            <div className="p-4">
            <p>
              <strong>Comment:</strong> {s.comment}
            </p>
            <p>
              <strong>Screenshot:</strong> {s.screenshot}
              {s.screenshot && <Iconner Icon={Copy} func={() => handleCopy(s.screenshot)} />}
            </p>
            <p>
              <strong>Path:</strong> {s.path}
              {s.path && <Iconner Icon={Copy} func={() => handleCopy(s.path)} />}
            </p>
            </div>
          </div>
        ))}
      </ItemContainer>
    </section>
  )
}

export default DeviceSetupInfo
