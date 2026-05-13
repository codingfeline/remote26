'use client'

import { Server as ServerModel } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props {
  servers: ServerModel[]
  cid: string
}

const ArchivedServers = ({ servers, cid }: Props) => {
  const router = useRouter()
  const [pendingId, setPendingId] = useState<string | null>(null)

  const handleRestore = async (id: string) => {
    setPendingId(id)
    try {
      await axios.post(`/api/customers/${cid}/server/${id}/restore`)
      router.refresh()
    } finally {
      setPendingId(null)
    }
  }

  return (
    <section className="compo">
      <h2 className="text-xl font-semibold mb-3 text-gray-500">Archived Servers</h2>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-3">
        {servers.map(s => (
          <div
            key={s.id}
            className="border border-gray-300 rounded-lg shadow-sm overflow-hidden bg-gray-50"
          >
            <div className="flex justify-between bg-gray-200 px-4 py-2">
              <span className="text-xs text-gray-500">
                Archived {s.archivedAt && new Date(s.archivedAt).toLocaleString()}
              </span>
              <button
                type="button"
                onClick={() => handleRestore(s.id)}
                disabled={pendingId === s.id}
                className="text-sm bg-violet-200 hover:bg-violet-300 disabled:opacity-50 px-2 py-0.5 rounded-sm"
              >
                {pendingId === s.id ? 'Restoring…' : 'Restore'}
              </button>
            </div>
            <div className="p-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 items-baseline text-gray-600">
              <strong className="text-right">Name:</strong>
              <span>{s.name}</span>
              <strong className="text-right">IP:</strong>
              <span>{s.ip}</span>
              <strong className="text-right">Username:</strong>
              <span>{s.username}</span>
              <strong className="text-right">Password:</strong>
              <span>{s.password}</span>
              <strong className="text-right">Notes:</strong>
              <span className="whitespace-pre-wrap">{s.notes}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ArchivedServers
