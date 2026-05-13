'use client'

import { Contact as ContactModel } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props {
  contacts: ContactModel[]
  cid: string
}

const ArchivedContacts = ({ contacts, cid }: Props) => {
  const router = useRouter()
  const [pendingId, setPendingId] = useState<string | null>(null)

  const handleRestore = async (id: string) => {
    setPendingId(id)
    try {
      await axios.post(`/api/customers/${cid}/contact/${id}/restore`)
      router.refresh()
    } finally {
      setPendingId(null)
    }
  }

  return (
    <section className="compo">
      <h2 className="text-xl font-semibold mb-3 text-gray-500">Archived Contacts</h2>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-3">
        {contacts.map(c => (
          <div
            key={c.id}
            className="border border-gray-300 rounded-lg shadow-sm overflow-hidden bg-gray-50"
          >
            <div className="flex justify-between bg-gray-200 px-4 py-2">
              <span className="text-xs text-gray-500">
                Archived{' '}
                {c.archivedAt &&
                  new Date(c.archivedAt).toLocaleString()}
              </span>
              <button
                type="button"
                onClick={() => handleRestore(c.id)}
                disabled={pendingId === c.id}
                className="text-sm bg-violet-200 hover:bg-violet-300 disabled:opacity-50 px-2 py-0.5 rounded-sm"
              >
                {pendingId === c.id ? 'Restoring…' : 'Restore'}
              </button>
            </div>
            <div className="p-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 items-baseline text-gray-600">
              <strong className="text-right">Name:</strong>
              <span>{c.name}</span>
              <strong className="text-right">Tel:</strong>
              <span>{c.tel}</span>
              <strong className="text-right">Email:</strong>
              <span>{c.email}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ArchivedContacts
