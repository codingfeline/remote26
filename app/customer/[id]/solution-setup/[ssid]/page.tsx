import MainPage from '@/app/components/MainPage'
import SolutionSetupForm from '@/app/customer/_components/SolutionSetupForm'
import { CustomerAllProps } from '@/app/schema'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

const EditSolutionSetup = async ({ params }: CustomerAllProps) => {
  const { customerId, ssid } = await params
  if (customerId?.length !== 24) notFound()
  if (ssid?.length !== 24) notFound()

  const customer = await prisma.customer?.findUnique({
    where: { id: customerId },
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
