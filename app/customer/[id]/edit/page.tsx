import MainPage from '@/app/components/MainPage'
import EditCustomerForm from '@/app/customer/_components/EditCustomerForm'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ParamProps } from '../page'

const EditCustomerPage = async ({ params }: ParamProps) => {
  const { id } = await params
  if (id.length !== 24) notFound()

  const customer = await prisma.customer.findUnique({
    where: { id },
    select: { name: true, solution: true },
  })
  if (!customer) notFound()

  return (
    <MainPage>
      <EditCustomerForm name={customer.name} solution={customer.solution} />
    </MainPage>
  )
}

export default EditCustomerPage
