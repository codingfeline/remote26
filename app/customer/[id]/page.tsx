import { BackToTop, MyButton, Pencil } from '@/app/components'
import Iconner from '@/app/components/Iconner'
import MainPage from '@/app/components/MainPage'
import CustomerList from '@/app/customer/_components/CustomerFilterList'
import CustomerSidebar from '@/app/customer/_components/CustomerSidebar'
import prisma from '@/lib/prisma'
import type { Metadata } from 'next'

import { notFound } from 'next/navigation'
import ArchivedContacts from '../_components/ArchivedContacts'
import ArchivedDevices from '../_components/ArchivedDevices'
import ArchivedDeviceSetups from '../_components/ArchivedDeviceSetups'
import ArchivedMethods from '../_components/ArchivedMethods'
import ArchivedScanToEmail from '../_components/ArchivedScanToEmail'
import ArchivedScanToFolder from '../_components/ArchivedScanToFolder'
import ArchivedServers from '../_components/ArchivedServers'
import ArchivedSolutionSetups from '../_components/ArchivedSolutionSetups'
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
    ssid?: string
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

  const activeMethods = customer.methodInfo.filter(m => !m.archivedAt)
  const archivedMethods = customer.methodInfo.filter(m => m.archivedAt)
  const activeContacts = customer.contact.filter(c => !c.archivedAt)
  const archivedContacts = customer.contact.filter(c => c.archivedAt)
  const activeServers = customer.server.filter(s => !s.archivedAt)
  const archivedServers = customer.server.filter(s => s.archivedAt)
  const activeDevices = customer.devicePassword.filter(d => !d.archivedAt)
  const archivedDevices = customer.devicePassword.filter(d => d.archivedAt)
  const activeDeviceSetups = customer.deviceSetup.filter(e => !e.archivedAt)
  const archivedDeviceSetups = customer.deviceSetup.filter(e => e.archivedAt)
  const activeSolutionSetups = customer.solutionSetup.filter(e => !e.archivedAt)
  const archivedSolutionSetups = customer.solutionSetup.filter(e => e.archivedAt)
  const activeScanToEmail = customer.scanToEmail.filter(e => !e.archivedAt)
  const archivedScanToEmail = customer.scanToEmail.filter(e => e.archivedAt)
  const activeScanToFolder = customer.scanToFolder.filter(e => !e.archivedAt)
  const archivedScanToFolder = customer.scanToFolder.filter(e => e.archivedAt)

  const hasArchived =
    archivedMethods.length +
      archivedContacts.length +
      archivedServers.length +
      archivedDevices.length +
      archivedDeviceSetups.length +
      archivedSolutionSetups.length +
      archivedScanToEmail.length +
      archivedScanToFolder.length >
    0

  return (
    <MainPage>
      <div className="grid md:grid-cols-[250px_1fr] grid-cols-1 ">
        <div className="md:border-r overflow-y-auto bg-gray-100 p-2 md:sticky md:top-0 md:max-h-screen">
          <CustomerSidebar>
            <CustomerList />
          </CustomerSidebar>
        </div>
        <div className=" md:p-2 overflow-y-auto min-h-0 ">
          {/* {JSON.stringify(customer)} */}
          <div className="px-1 md:px-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-t-4 border-violet-400 md:border-none mt-2 md:mt-0">
              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <h1 className="text-2xl font-bold">{customer.name}</h1>
                <Iconner href={`/customer/${cid}/edit`} Icon={Pencil} />
              </div>
              <p className="text-gray-600 flex flex-col md:flex-row gap-2 mt-4 md:mt-0 mr-1">
                Solution: <span>{customer.solution}</span>
              </p>
            </div>
            {/* {cid} */}

            {activeMethods.length > 0 && <MethodInfo cid={cid} method={activeMethods} />}
            <MyButton secondary label="Add Method" url={`/customer/${cid}/method/new`} />

            {activeContacts.length > 0 && <Contact cid={cid} contact={activeContacts} />}
            <MyButton
              secondary
              label="Add Contact"
              url={`/customer/${cid}/contact/new`}
            />

            {activeServers.length > 0 && <ServerInfo server={activeServers} cid={cid} />}
            <MyButton secondary label="Add Server" url={`/customer/${cid}/server/new`} />
            {activeDevices.length > 0 && (
              <DeviceInfo devicePasswords={activeDevices} cid={cid} />
            )}
            <MyButton secondary label="Add Device" url={`/customer/${cid}/device/new`} />

            {activeDeviceSetups.length > 0 && (
              <DeviceSetupInfo deviceSetup={activeDeviceSetups} cid={cid} />
            )}
            <MyButton
              secondary
              label="Add Device Setup"
              url={`/customer/${cid}/device-setup/new`}
            />

            {activeSolutionSetups.length > 0 && (
              <SolutionsInfo solution={activeSolutionSetups} cid={cid} />
            )}
            <MyButton
              secondary
              label="Add Solution Setup"
              url={`/customer/${cid}/solution-setup/new`}
            />

            {activeScanToEmail.length > 0 && (
              <ScanToEmailInfo scan2e={activeScanToEmail} cid={cid} />
            )}
            <MyButton
              secondary
              label="Add Scan To Email"
              url={`/customer/${cid}/scan-to-email/new`}
            />

            {activeScanToFolder.length > 0 && (
              <ScanToFolderInfo scan2e={activeScanToFolder} cid={cid} />
            )}
            <MyButton
              secondary
              label="Add Scan To Folder"
              url={`/customer/${cid}/scan-to-folder/new`}
            />

            {hasArchived && (
              <>
                <hr className="border-2 border-gray-300 mt-10" />
                {archivedMethods.length > 0 && (
                  <ArchivedMethods cid={cid} methods={archivedMethods} />
                )}
                {archivedContacts.length > 0 && (
                  <ArchivedContacts cid={cid} contacts={archivedContacts} />
                )}
                {archivedServers.length > 0 && (
                  <ArchivedServers cid={cid} servers={archivedServers} />
                )}
                {archivedDevices.length > 0 && (
                  <ArchivedDevices cid={cid} devices={archivedDevices} />
                )}
                {archivedDeviceSetups.length > 0 && (
                  <ArchivedDeviceSetups cid={cid} setups={archivedDeviceSetups} />
                )}
                {archivedSolutionSetups.length > 0 && (
                  <ArchivedSolutionSetups cid={cid} setups={archivedSolutionSetups} />
                )}
                {archivedScanToEmail.length > 0 && (
                  <ArchivedScanToEmail cid={cid} entries={archivedScanToEmail} />
                )}
                {archivedScanToFolder.length > 0 && (
                  <ArchivedScanToFolder cid={cid} entries={archivedScanToFolder} />
                )}
              </>
            )}

            {customer.logs.length > 0 && (
              <>
                <hr className="border-2 border-gray-300  mt-10" />
                <section className="compo">
                  <h2 className="text-xl font-semibold mb-3 text-gray-500">Logs</h2>
                  <div className="space-y-2">
                    {[...customer.logs]
                      .sort(
                        (a, b) =>
                          new Date(b.timestamp).getTime() -
                          new Date(a.timestamp).getTime(),
                      )
                      .map(log => (
                        <div
                          key={log.id}
                          className="border border-violet-400 rounded-lg p-3 shadow-sm"
                        >
                          <p className="text-sm text-gray-500 mb-1">
                            {new Date(log.timestamp).toLocaleString()}
                          </p>
                          <p className="text-gray-800">{log.message}</p>
                        </div>
                      ))}
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      </div>
      <BackToTop />
    </MainPage>
  )
}

export const dynamic = 'force-dynamic'

export default page
