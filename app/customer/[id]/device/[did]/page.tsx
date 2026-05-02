import MainPage from '@/app/components/MainPage'
import DeviceForm from '@/app/customer/_components/DeviceForm'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ParamProps } from '../../page'

const EditDevice = async ({ params }: ParamProps) => {
  const { id, did } = await params
  if (id.length !== 24) notFound()
  if (did?.length !== 24) notFound()

  const customer = await prisma.customer?.findUnique({
    where: { id },
    select: { devicePassword: true },
  })

  if (!customer) notFound()
  const deviceProps = customer.devicePassword.find(d => d.id === did)
  if (!deviceProps) notFound()

  return (
    <MainPage>
      <DeviceForm device={deviceProps} />
    </MainPage>
  )
}

export default EditDevice
