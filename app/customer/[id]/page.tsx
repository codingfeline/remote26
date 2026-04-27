import { BackButton, MyButton } from '@/app/components'
import ButtonIcon from '@/app/components/ButtonIcon'
import MainPage from '@/app/components/MainPage'
import CustomerList from '@/app/customer/_components/CustomerFilterList'
import prisma from '@/lib/prisma'
import type { Metadata } from 'next'

import { notFound } from 'next/navigation'
import Contact from '../_components/Contact'
import MethodInfo from '../_components/methodInfo'

export interface ParamProps {
  params: Promise<{ id: string; mid?: string; ctid?: string }> // * making this a Promise to await below (await params)
}

export const metadata: Metadata = {
  title: 'Customer Details -- Remote CMS',
  description: 'Web-based content management system',
}

const page = async ({ params }: ParamProps) => {
  if ((await params).id.length !== 24) notFound()
  const cid = (await params).id
  const customer = await prisma.customer!.findUnique({
    where: { id: cid },
  })
  if (!customer) notFound()
  const { methodInfo: method, contact } = customer

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
            {/* {cid} */}

            {method.length > 0 && <MethodInfo cid={cid} method={customer.methodInfo} />}
            <MyButton secondary label="Add Method" url={`/customer/${cid}/method/new`} />

            {contact.length > 0 && <Contact cid={cid} contact={customer.contact} />}
            <MyButton
              secondary
              label="Add Contact"
              url={`/customer/${cid}/contact/new`}
            />
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
                {customer.solutionSetup.map(s => (
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

export const dynamic = 'force-dynamic'

export default page
