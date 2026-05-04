import MainPage from '@/app/components/MainPage'
import prisma from '@/lib/prisma'
import Link from 'next/link'

const TheLogsPage = async () => {
  const customers = await prisma.customer.findMany({
    select: { id: true, name: true, logs: true },
  })

  const entries = customers
    .flatMap(c => c.logs.map(log => ({ ...log, customerName: c.name, customerId: c.id })))
    .filter(log => log.message)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return (
    <MainPage>
      <div className="px-4 md:px-8 py-6 space-y-4">
        <h1 className="text-2xl font-bold border-t-4 border-violet-400 pt-4">Logs</h1>
        {entries.length === 0 ? (
          <p className="text-gray-500">No logs yet.</p>
        ) : (
          <div className="space-y-3">
            {entries.map(log => (
              <div key={log.id} className="border border-violet-400 rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center mb-1">
                  <Link href={`/customer/${log.customerId}`} className="font-semibold text-violet-700 hover:underline">{log.customerName}</Link>
                  <span className="text-sm text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-800">{log.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainPage>
  )
}

export const dynamic = 'force-dynamic'

export default TheLogsPage
