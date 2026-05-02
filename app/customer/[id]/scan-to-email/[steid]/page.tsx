import MainPage from '@/app/components/MainPage'
import ScanToEmailForm from '@/app/customer/_components/ScanToEmailForm'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ParamProps } from '../../page'

const EditScanToEmail = async ({ params }: ParamProps) => {
  const { id, steid } = await params
  if (id.length !== 24) notFound()
  if (steid?.length !== 24) notFound()

  const customer = await prisma.customer?.findUnique({
    where: { id },
    select: { scanToEmail: true },
  })

  if (!customer) notFound()
  const entry = customer.scanToEmail.find(e => e.id === steid)
  if (!entry) notFound()

  return (
    <MainPage>
      <ScanToEmailForm entry={entry} />
    </MainPage>
  )
}

export default EditScanToEmail
