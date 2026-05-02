import MainPage from '@/app/components/MainPage'
import ScanToFolderForm from '@/app/customer/_components/ScanToFolderForm'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ParamProps } from '../../page'

const EditScanToFolder = async ({ params }: ParamProps) => {
  const { id, stfid } = await params
  if (id.length !== 24) notFound()
  if (stfid?.length !== 24) notFound()

  const customer = await prisma.customer?.findUnique({
    where: { id },
    select: { scanToFolder: true },
  })

  if (!customer) notFound()
  const entry = customer.scanToFolder.find(e => e.id === stfid)
  if (!entry) notFound()

  return (
    <MainPage>
      <ScanToFolderForm entry={entry} />
    </MainPage>
  )
}

export default EditScanToFolder
