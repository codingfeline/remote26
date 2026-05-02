'use client'

import { BackButton, ButtonIcon, ErrorMessage, MyButton, Send } from '@/app/components'
import CompoForm from '@/app/components/CompoForm'
import { useFormSubmit } from '@/app/hooks/useFormSubmit'
import { ScanToEmailSchema } from '@/app/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { ScanToEmail } from '@prisma/client'
import { Container, TextField } from '@radix-ui/themes'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type ScanToEmailFormData = z.infer<typeof ScanToEmailSchema>

const ScanToEmailForm = ({ entry }: { entry?: ScanToEmail }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ScanToEmailFormData>({
    resolver: zodResolver(ScanToEmailSchema),
  })

  const params = useParams()
  const { id, steid } = params

  const { submit, submitting, error } = useFormSubmit<ScanToEmailFormData>()
  const onSubmit = handleSubmit(async data => {
    await submit(data, {
      url: entry
        ? `/api/customers/${id}/scan-to-email/${steid}`
        : `/api/customers/${id}/scan-to-email`,
      method: entry ? 'patch' : 'post',
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
        <label htmlFor="hostname">
          Hostname
          <TextField.Root
            defaultValue={entry?.hostname}
            placeholder="Hostname"
            id="hostname"
            {...register('hostname')}
          />
          <ErrorMessage>{errors.hostname?.message}</ErrorMessage>
        </label>
        <label htmlFor="username">
          Username
          <TextField.Root
            defaultValue={entry?.username}
            placeholder="Username"
            id="username"
            {...register('username')}
          />
          <ErrorMessage>{errors.username?.message}</ErrorMessage>
        </label>
        <label htmlFor="password">
          Password
          <TextField.Root
            defaultValue={entry?.password}
            placeholder="Password"
            id="password"
            {...register('password')}
          />
          <ErrorMessage>{errors.password?.message}</ErrorMessage>
        </label>
        <label htmlFor="port">
          Port
          <TextField.Root
            defaultValue={entry?.port}
            placeholder="Port"
            id="port"
            {...register('port')}
          />
          <ErrorMessage>{errors.port?.message}</ErrorMessage>
        </label>
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

export default ScanToEmailForm
