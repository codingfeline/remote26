import MainPage from '@/app/components/MainPage'
import ContactForm from '@/app/customer/_components/ContactForm'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ParamProps } from '../../page'

const EditContact = async ({ params }: ParamProps) => {
  const { id, ctid } = await params
  if (id.length !== 24) notFound()
  if (ctid?.length !== 24) notFound()

  const customer = await prisma.customer?.findUnique({
    where: { id },
    select: {
      contact: true,
    },
  })

  if (!customer) notFound()
  const contactProps = customer.contact.find(c => c.id === ctid)

  if (!contactProps) notFound()

  return (
    <MainPage>
      <ContactForm contact={contactProps} />
    </MainPage>
  )
}

export default EditContact
