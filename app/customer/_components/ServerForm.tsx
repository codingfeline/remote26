'use client'

import { BackButton, ButtonIcon, ErrorMessage, MyButton, Send } from '@/app/components'
import CompoForm from '@/app/components/CompoForm'
import { useFormSubmit } from '@/app/hooks/useFormSubmit'
import { ServerSchema } from '@/app/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Server } from '@prisma/client'
import { Container, TextField } from '@radix-ui/themes'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type ServerFormData = z.infer<typeof ServerSchema>

const ServerForm = ({ server }: { server?: Server }) => {
  const router = useRouter()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ServerFormData>({
    resolver: zodResolver(ServerSchema),
  })
  const params = useParams()
  const { id, sid } = params

  const { submit, submitting, error } = useFormSubmit<ServerFormData>()
  const onSubmit = handleSubmit(async data => {
    await submit(data, {
      url: server ? `/api/customers/${id}/server/${sid}/` : `/api/customers/${id}/server`,
      method: server ? 'patch' : 'post',
      onSuccessRedirect: `/customer/${id}`,
    })
  })

  return (
    <Container>
      <ButtonIcon href={`/customer/${id}`} Icon={BackButton}>
        Back
      </ButtonIcon>
      <CompoForm>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <label htmlFor="name">
          Name
          <TextField.Root
            defaultValue={server?.name}
            placeholder="Name"
            id="name"
            {...register('name')}
          />
          <ErrorMessage>{errors.name?.message}</ErrorMessage>
        </label>
        <label htmlFor="ip">
          IP Address
          <TextField.Root
            defaultValue={server?.ip}
            placeholder="IP Address"
            id="ip"
            {...register('ip')}
          />
          <ErrorMessage>{errors.ip?.message}</ErrorMessage>
        </label>
        <label htmlFor="username">
          Username
          <TextField.Root
            defaultValue={server?.username}
            placeholder="Username"
            id="username"
            {...register('username')}
          />
          <ErrorMessage>{errors.username?.message}</ErrorMessage>
        </label>
        <label htmlFor="password">
          Password
          <TextField.Root
            defaultValue={server?.password}
            placeholder="Password"
            id="password"
            {...register('password')}
          />
          <ErrorMessage>{errors.password?.message}</ErrorMessage>
        </label>
        {/* <label htmlFor="notes">
          Notes
          <TextArea
            defaultValue={server?.notes}
            placeholder="Notes"
            id="notes"
            {...register('notes')}
          />
          <ErrorMessage>{errors.notes?.message}</ErrorMessage>
        </label> */}
        <MyButton
          disable={submitting}
          label={submitting ? 'Saving...' : 'Save'}
          Icon={Send}
          iconPosition="right"
          click={onSubmit}
        />
      </CompoForm>
    </Container>
  )
}

export default ServerForm
