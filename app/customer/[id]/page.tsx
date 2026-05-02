import { BackToTop, MyButton, Pencil } from '@/app/components'
import Iconner from '@/app/components/Iconner'
import MainPage from '@/app/components/MainPage'
import CustomerList from '@/app/customer/_components/CustomerFilterList'
import prisma from '@/lib/prisma'
import type { Metadata } from 'next'

import { notFound } from 'next/navigation'
import Contact from '../_components/Contact'
import DeviceInfo from '../_components/DeviceInfo'
import DeviceSetupInfo from '../_components/DeviceSetupInfo'
import MethodInfo from '../_components/methodInfo'
import ScanToEmailInfo from '../_components/ScanToEmail'
import ScanToFolderInfo from '../_components/ScanToFolder'
import ServerInfo from '../_components/ServerInfo'
import SolutionsInfo from '../_components/SolutionSetup'

export interface ParamProps {
  params: Promise<{
    id: string
    mid?: string
    ctid?: string
    sid?: string
    did?: string
    dsid?: string
    steid?: string
    stfid?: string
  }> // * making this a Promise to await below (await params)
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
  const { methodInfo: method, contact, server, devicePassword: device } = customer

  return (
    <MainPage>
      <div className="grid md:grid-cols-[250px_1fr] grid-cols-1 ">
        <div className="md:border-r overflow-y-auto bg-gray-100 p-2 sticky top-0 max-h-screen">
          <CustomerList requireSearch={true} />
        </div>
        <div className=" p-2 overflow-y-auto min-h-0 ">
          {/* {JSON.stringify(customer)} */}
          <div className="px-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{customer.name}</h1>
                <Iconner href={`/customer/${cid}/edit`} Icon={Pencil} />
              </div>
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

            {server.length > 0 && <ServerInfo server={customer.server} cid={cid} />}
            <MyButton secondary label="Add Server" url={`/customer/${cid}/server/new`} />
            {device.length > 0 && (
              <DeviceInfo devicePasswords={customer.devicePassword} cid={cid} />
            )}
            <MyButton secondary label="Add Device" url={`/customer/${cid}/device/new`} />

            {customer.deviceSetup.length > 0 && (
              <DeviceSetupInfo deviceSetup={customer.deviceSetup} cid={cid} />
            )}
            <MyButton
              secondary
              label="Add Device Setup"
              url={`/customer/${cid}/device-setup/new`}
            />

            {SolutionsInfo.length > 0 && (
              <SolutionsInfo solution={customer.solutionSetup} cid={cid} />
            )}
            {customer.scanToEmail.length > 0 && (
              <ScanToEmailInfo scan2e={customer.scanToEmail} cid={cid} />
            )}
            <MyButton
              secondary
              label="Add Scan To Email"
              url={`/customer/${cid}/scan-to-email/new`}
            />

            {customer.scanToFolder.length > 0 && (
              <ScanToFolderInfo scan2e={customer.scanToFolder} cid={cid} />
            )}
            <MyButton
              secondary
              label="Add Scan To Folder"
              url={`/customer/${cid}/scan-to-folder/new`}
            />
          </div>
        </div>
      </div>
      <BackToTop />
    </MainPage>
  )
}

export const dynamic = 'force-dynamic'

export default page
