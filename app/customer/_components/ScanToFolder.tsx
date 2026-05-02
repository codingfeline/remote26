'use client'

import { ConfirmDelete, Copy, Pencil } from '@/app/components'
import { useCopyToClipboard } from '@/app/components/CopyToClipboard'
import Iconner from '@/app/components/Iconner'
import { ScanToFolder } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import ItemContainer from './ItemContainer'

interface Props {
  scan2e: ScanToFolder[]
  cid: string
}

const ScanToFolderInfo = ({ scan2e, cid }: Props) => {
  const { copy: handleCopy } = useCopyToClipboard()
  const router = useRouter()

  const handleDelete = async (id: string) => {
    await axios.delete(`/api/customers/${cid}/scan-to-folder/${id}`)
    router.refresh()
  }

  if (!scan2e) return

  return (
    <section className="compo">
      <ItemContainer title="Scan To Folder">
        {scan2e.map(s => (
          <div key={s.id} className="border rounded-xl p-4">
            <div className="flex justify-between">
              <Iconner href={`/customer/${cid}/scan-to-folder/${s.id}`} Icon={Pencil} />
              <ConfirmDelete onConfirm={() => handleDelete(s.id)} />
            </div>
            <p>
              <strong>hostname:</strong> {s.hostname}
              {s.hostname && <Iconner Icon={Copy} func={() => handleCopy(s.hostname)} />}
            </p>
            <p>
              <strong>folder:</strong> {s.folder}
              {s.folder && <Iconner Icon={Copy} func={() => handleCopy(s.folder!)} />}
            </p>
            <p>
              <strong>username:</strong> {s.username}
              {s.username && <Iconner Icon={Copy} func={() => handleCopy(s.username)} />}
            </p>
            <p>
              <strong>password:</strong> {s.password}
              {s.password && <Iconner Icon={Copy} func={() => handleCopy(s.password)} />}
            </p>
          </div>
        ))}
      </ItemContainer>
    </section>
  )
}

export default ScanToFolderInfo
