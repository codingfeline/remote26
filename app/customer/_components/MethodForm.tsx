'use client'

import { MethodInfo } from '@prisma/client'
import { notFound, useParams } from 'next/navigation'

const MethodForm = ({ method }: { method: MethodInfo }) => {
  const params = useParams()
  const { id, mid } = params
  if (params.id?.length !== 24) notFound()

  return (
    <>
      {JSON.stringify(method)}
      <form className="flex flex-col gap-4">
        {id} - {mid} -
        <label htmlFor="name">
          Name
          <input type="text" id="name" name="name" />
        </label>
        <label htmlFor="url">
          URL
          <input type="text" id="url" name="url" />
        </label>
        <label htmlFor="username">
          Username
          <input type="text" id="username" name="username" />
        </label>
        <label htmlFor="password">
          Password
          <input type="text" id="password" name="password" />
        </label>
      </form>
    </>
  )
}

export default MethodForm
