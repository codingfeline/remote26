import { BackButton } from '@/app/components'
import ButtonIcon from '@/app/components/ButtonIcon'
import MainPage from '@/app/components/MainPage'
import { notFound } from 'next/navigation'
import { ParamProps } from '../../page'

// interface MethodPageProps {
//   params: Promise<{ id: string; mid: string }>
// }

const EditMethod = async ({ params }: ParamProps) => {
  if ((await params).id.length !== 24) notFound()
  if ((await params).mid?.length !== 24) notFound()

  const { id, mid } = await params

  // const methodProps = await prisma.customer.findUnique({
  //   where: { id: (await params).id },
  //   select: {
  //     id: true,
  //     name: true,
  //     methodInfo: {
  //       where: { id: (await params).mid },
  //       select: {
  //         methodName: true,
  //         url: true,
  //         username: true,
  //         password: true,
  //         notes: true,
  //       },
  //     },
  //   },
  // })

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
      <ButtonIcon href={`/customer/${id}`} Icon={BackButton}>
        Back
      </ButtonIcon>
      {/* {await params} */}
      {/* <MethodForm method={methodProps} /> */}
    </MainPage>
  )
}

export default EditMethod
