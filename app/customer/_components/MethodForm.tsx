'use client'

import { BackButton, MyButton, Send } from '@/app/components'
import ButtonIcon from '@/app/components/ButtonIcon'
import ErrorMessage from '@/app/components/ErrorMessage'
import { MethodInfoSchema } from '@/app/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { MethodInfo } from '@prisma/client'
import { Container, TextArea, TextField } from '@radix-ui/themes'
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
      if (method) await axios.patch(`/api/customers/${id}/method/${mid}`, data)
      else await axios.post(`/api/customers/${id}/method`, data)
      router.push(`/customer/${id}`)
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
      <ErrorMessage>{error}</ErrorMessage>
      <form className="flex flex-col gap-4 mt-4">
        <label htmlFor="name">
          Name
          <TextField.Root
            defaultValue={method?.methodName}
            placeholder="Method Name"
            id="name"
            {...register('methodName')}
          />
          <ErrorMessage>{errors.methodName?.message}</ErrorMessage>
        </label>
        <label htmlFor="url">
          URL
          <TextField.Root
            defaultValue={method?.url}
            placeholder="URL"
            id="url"
            {...register('url')}
          />
          <ErrorMessage>{errors.url?.message}</ErrorMessage>
        </label>
        <label htmlFor="username">
          Username
          <TextField.Root
            defaultValue={method?.username}
            placeholder="Username"
            id="username"
            {...register('username')}
          />
          <ErrorMessage>{errors.username?.message}</ErrorMessage>
        </label>
        <label htmlFor="password">
          Password
          <TextField.Root
            defaultValue={method?.password}
            placeholder="Password"
            id="password"
            {...register('password')}
          />
          <ErrorMessage>{errors.password?.message}</ErrorMessage>
        </label>
        <label htmlFor="notes">
          Notes
          <TextArea
            defaultValue={method?.notes}
            placeholder="Notes"
            id="notes"
            {...register('notes')}
          />
          <ErrorMessage>{errors.notes?.message}</ErrorMessage>
        </label>
        <MyButton
          disable={submitting}
          label="Submit"
          Icon={Send}
          iconPosition="right"
          click={onSubmit}
        />
      </form>
    </Container>
  )
}

export default MethodForm
