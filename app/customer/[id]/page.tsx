import { BackButton } from '@/app/components'
import ButtonIcon from '@/app/components/ButtonIcon'
import MainPage from '@/app/components/MainPage'
import CustomerList from '@/app/customer/_components/CustomerFilterList'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Contact from '../_components/Contact'
import MethodInfo from '../_components/methodInfo'

interface Props {
  params: Promise<{ id: string }> // * making this a Promise to await below (await params)
}

const page = async ({ params }: Props) => {
  if ((await params).id.length !== 24) notFound()
  const customer = await prisma.customer!.findUnique({
    where: { id: (await params).id },
  })
  if (!customer) notFound()

  return (
    <MainPage>
      <div className="grid md:grid-cols-[250px_1fr] grid-cols-1 ">
        <div className="border-r overflow-y-auto min-h- bg-gray-100 p-2">
          <CustomerList requireSearch={true} />
        </div>
        <div className=" p-6 overflow-y-auto min-h-0 ">
          <ButtonIcon href="/" Icon={BackButton}>
            back
          </ButtonIcon>
          <div className="p-6 space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold">{customer.name}</h1>
              <p className="text-gray-600">Solution: {customer.solution}</p>
            </div>

            {customer.methodInfo.length > 0 && (
              <MethodInfo method={customer.methodInfo} />
            )}

            {customer.contact.length > 0 && <Contact contact={customer.contact} />}

            {/* Servers */}
            <section>
              <h2 className="text-xl font-semibold mb-2">Servers</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {customer.server.map(s => (
                  <div key={s.id} className="border rounded-xl p-4">
                    <p>
                      <strong>Name:</strong> {s.name}
                    </p>
                    <p>
                      <strong>IP:</strong> {s.ip}
                    </p>
                    <p>
                      <strong>Username:</strong> {s.username}
                    </p>
                    <p>
                      <strong>Password:</strong> {s.password}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Device Passwords */}
            <section>
              <h2 className="text-xl font-semibold mb-2">Device Passwords</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {customer.devicePassword.map(d => (
                  <div key={d.id} className="border rounded-xl p-4">
                    <p>
                      <strong>Make:</strong> {d.make}
                    </p>
                    <p>
                      <strong>Username:</strong> {d.username}
                    </p>
                    <p>
                      <strong>Password:</strong> {d.password}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Server Setup */}
            <section>
              <h2 className="text-xl font-semibold mb-2">Solution Setup</h2>
              <div className="space-y-4">
                {customer.serverSetup.map(s => (
                  <div key={s.id} className="border rounded-xl p-4">
                    <p>
                      <strong>Comment:</strong> {s.comment}
                    </p>
                    <p>
                      <strong>Screenshot:</strong> {s.screenshot}
                    </p>
                    <p>
                      <strong>Path:</strong> {s.path}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </MainPage>
  )
}

export default page
