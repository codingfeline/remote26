import MainPage from '@/app/components/MainPage'
import ServerForm from '@/app/customer/_components/ServerForm'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ParamProps } from '../../page'

const EditServer = async ({ params }: ParamProps) => {
  const { id, sid } = await params
  if (id.length !== 24) notFound()
  if (sid?.length !== 24) notFound()

  const customer = await prisma.customer?.findUnique({
    where: { id },
    select: {
      server: true,
    },
  })

  if (!customer) notFound()
  const serverProps = customer.server.find(s => s.id === sid)

  if (!serverProps) notFound()

  return (
    <MainPage>
      <ServerForm server={serverProps} />
    </MainPage>
  )
}

export default EditServer
