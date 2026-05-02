import MainPage from '@/app/components/MainPage'
import DeviceSetupForm from '@/app/customer/_components/DeviceSetupForm'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ParamProps } from '../../page'

const EditDeviceSetup = async ({ params }: ParamProps) => {
  const { id, dsid } = await params
  if (id.length !== 24) notFound()
  if (dsid?.length !== 24) notFound()

  const customer = await prisma.customer?.findUnique({
    where: { id },
    select: { deviceSetup: true },
  })

  if (!customer) notFound()
  const entry = customer.deviceSetup.find(e => e.id === dsid)
  if (!entry) notFound()

  return (
    <MainPage>
      <DeviceSetupForm entry={entry} />
    </MainPage>
  )
}

export default EditDeviceSetup
