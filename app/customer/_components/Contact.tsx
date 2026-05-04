'use client'

import { ConfirmDelete, Copy, Pencil } from '@/app/components'
import { useCopyToClipboard } from '@/app/components/CopyToClipboard'
import Iconner from '@/app/components/Iconner'
import { Contact as ContactModel } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import ItemContainer from './ItemContainer'

interface Props {
  contact: ContactModel[]
  cid: string
}

const Contact = ({ contact, cid }: Props) => {
  const { copy: handleCopy } = useCopyToClipboard()
  const router = useRouter()

  const handleDelete = async (id: string) => {
    await axios.delete(`/api/customers/${cid}/contact/${id}`)
    router.refresh()
  }

  if (!contact) return

  return (
    <section className="compo">
      <ItemContainer title="Contact">
        {contact.map(c => (
          <div key={c.id} className="border border-violet-400 rounded-t-lg shadow-sm overflow-hidden">
            <div className="flex justify-between bg-violet-200 px-4 py-2">
              <Iconner href={`/customer/${cid}/contact/${c.id}`} Icon={Pencil} />
              <ConfirmDelete onConfirm={() => handleDelete(c.id)} />
            </div>
            <div className="p-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 items-baseline">
              <strong className="text-right">Name:</strong>
              <span>{c.name}</span>

              <strong className="text-right">Tel:</strong>
              <span className="flex items-center justify-between">{c.tel}{c.tel && <Iconner Icon={Copy} func={() => handleCopy(c.tel)} />}</span>

              <strong className="text-right">Email:</strong>
              <span className="flex items-center justify-between">{c.email}{c.email && <Iconner Icon={Copy} func={() => handleCopy(c.email)} />}</span>
            </div>
          </div>
        ))}
      </ItemContainer>
    </section>
  )
}

export default Contact
