import { notFound } from 'next/navigation'
import { ParamProps } from '../../page'

// interface MethodPageProps {
//   params: Promise<{ id: string; mid: string }>
// }

const EditMethod = async ({ params }: ParamProps) => {
  if ((await params).id.length !== 24) notFound()
  if ((await params).mid?.length !== 24) notFound()

  const { id, mid } = await params

  return (
    <div>
      {/* {await params} */}
      <h1>Edit Method</h1>
      <p>Customer ID: {id}</p>
      <p>Method ID: {mid}</p>
    </div>
  )
}

export default EditMethod
