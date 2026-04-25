import MainPage from '@/app/components/MainPage'
import MethodForm from '@/app/customer/_components/MethodForm'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ParamProps } from '../../page'

// interface MethodPageProps {
//   params: Promise<{ id: string; mid: string }>
// }

const EditMethod = async ({ params }: ParamProps) => {
  if ((await params).id.length !== 24) notFound()
  if ((await params).mid?.length !== 24) notFound()

  const { id, mid } = await params

  const customer = await prisma.customer!.findUnique({
    where: { id },
    select: {
      methodInfo: true,
    },
  })

  if (!customer) notFound()

  const methodProps = customer.methodInfo.find(m => m.id === mid)

  if (!methodProps) notFound()

  // console.log(methodProps)
  // const custLink = `/customer/${id}`
  // const methodLink = `${custLink}/method/${mid}`
  return (
    <MainPage>
      {/* <Link href={custLink} className="text-sm text-gray-500 hover:text-violet-700">
        {`Customer`}
      </Link>{' '}
      /{' '}
      <Link href={methodLink} className="text-sm text-gray-500 hover:text-violet-700">
        {methodLink}
      </Link> */}
      {/* <ButtonIcon href={`/customer/${id}`} Icon={BackButton}>
        Back
      </ButtonIcon> */}
      {/* {await params} */}
      <MethodForm method={methodProps} />
    </MainPage>
  )
}

export default EditMethod
