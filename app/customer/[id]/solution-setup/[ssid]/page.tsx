import MainPage from '@/app/components/MainPage'
import SolutionSetupForm from '@/app/customer/_components/SolutionSetupForm'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ParamProps } from '../../page'

const EditSolutionSetup = async ({ params }: ParamProps) => {
  const { id, ssid } = await params
  if (id.length !== 24) notFound()
  if (ssid?.length !== 24) notFound()

  const customer = await prisma.customer?.findUnique({
    where: { id },
    select: { solutionSetup: true },
  })

  if (!customer) notFound()
  const entry = customer.solutionSetup.find(e => e.id === ssid)
  if (!entry) notFound()

  return (
    <MainPage>
      <SolutionSetupForm entry={entry} />
    </MainPage>
  )
}

export default EditSolutionSetup
