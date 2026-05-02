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
          <div key={c.id} className="border rounded-xl p-4">
            <div className="flex justify-between">
              <Iconner href={`/customer/${cid}/contact/${c.id}`} Icon={Pencil} />
              <ConfirmDelete onConfirm={() => handleDelete(c.id)} />
            </div>
            <p>
              <strong>Name:</strong> {c.name}
            </p>
            <p>
              <strong>Tel:</strong> {c.tel}
              {c.tel && <Iconner Icon={Copy} func={() => handleCopy(c.tel)} />}
              {/* <Iconner Icon={Copy} func={() => handleCopy(c.tel)}  */}
            </p>
            <p>
              <strong>Email:</strong> {c.email}
              {c.email && <Iconner Icon={Copy} func={() => handleCopy(c.email)} />}
            </p>
          </div>
        ))}
      </ItemContainer>
    </section>
  )
}

export default Contact
