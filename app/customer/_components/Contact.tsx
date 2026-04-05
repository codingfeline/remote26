'use client'

import { Copy, Pencil } from '@/app/components'
import { useCopyToClipboard } from '@/app/components/CopyToClipboard'
import WrapIcon from '@/app/components/Iconner'
import { Contact as ContactModel } from '@prisma/client'
import ItemContainer from './ItemContainer'

interface Props {
  contact: ContactModel[]
}

const Contact = ({ contact }: Props) => {
  const { copy: handleCopy } = useCopyToClipboard()
  if (!contact) return

  return (
    <section className="compo">
      <ItemContainer title="Contact">
        {contact.map(c => (
          <div key={c.id} className="border rounded-xl p-4">
            <WrapIcon Icon={Pencil} />
            <p>
              <strong>Name:</strong> {c.name}
            </p>
            <p>
              <strong>Tel:</strong> {c.tel}
              <WrapIcon Icon={Copy} func={() => handleCopy(c.tel)} />
            </p>
            <p>
              <strong>Email:</strong> {c.email}
              <WrapIcon Icon={Copy} func={() => handleCopy(c.email)} />
            </p>
          </div>
        ))}
      </ItemContainer>
    </section>
  )
}

export default Contact
