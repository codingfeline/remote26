'use client'

import { BackButton, MyButton, Send } from '@/app/components'
import ButtonIcon from '@/app/components/ButtonIcon'
import ErrorMessage from '@/app/components/ErrorMessage'
import { MethodInfoSchema } from '@/app/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { MethodInfo } from '@prisma/client'
import { Callout, Container, TextField } from '@radix-ui/themes'
import axios from 'axios'
import { notFound, useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type MethodFormData = z.infer<typeof MethodInfoSchema>

const MethodForm = ({ method }: { method?: MethodInfo }) => {
  const router = useRouter()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MethodFormData>({
    resolver: zodResolver(MethodInfoSchema),
  })

  const params = useParams()
  const { id, mid } = params
  if (params.id?.length !== 24) notFound()

  const onSubmit = handleSubmit(async data => {
    try {
      setSubmitting(true)
      if (method)
        await axios.patch(`/api/customers/${id}/method/${mid}` + method.id, data)
      else await axios.post(`/api/customers/${id}/method`, data)
      router.push(`/customers/${id}`)
      router.refresh()
    } catch (error) {
      console.log(error)
      setSubmitting(false)
      setError('Unexpected error')
    }
  })

  return (
    <Container>
      <ButtonIcon href={`/customer/${id}`} Icon={BackButton}>
        Back
      </ButtonIcon>
      <Callout.Root color="red" m="2">
        <Callout.Text>error</Callout.Text>
      </Callout.Root>
      {JSON.stringify(method)}
      {/* {id} - {mid} - */}
      <form className="flex flex-col gap-4">
        <TextField.Root
          defaultValue={method?.methodName}
          placeholder="Method Name"
          {...register('methodName')}
        />
        <ErrorMessage>{errors.methodName?.message}</ErrorMessage>
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
        <MyButton label="Submit" Icon={Send} iconPosition="right" />
      </form>
    </Container>
  )
}

export default MethodForm
