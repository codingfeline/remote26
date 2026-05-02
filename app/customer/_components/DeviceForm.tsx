'use client'

import { BackButton, ButtonIcon, ErrorMessage, MyButton, Send } from '@/app/components'
import CompoForm from '@/app/components/CompoForm'
import { useFormSubmit } from '@/app/hooks/useFormSubmit'
import { DevicePasswordSchema } from '@/app/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { DevicePassword as Device } from '@prisma/client'
import { Container, TextField } from '@radix-ui/themes'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type DeviceFormData = z.infer<typeof DevicePasswordSchema>

const DeviceForm = ({ device }: { device?: Device }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeviceFormData>({
    resolver: zodResolver(DevicePasswordSchema),
  })

  const params = useParams()
  const { id, did } = params

  const { submit, submitting, error } = useFormSubmit<DeviceFormData>()
  const onSubmit = handleSubmit(async data => {
    await submit(data, {
      url: device ? `/api/customers/${id}/device/${did}` : `/api/customers/${id}/device`,
      method: device ? 'patch' : 'post',
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
        <label htmlFor="make">
          Make
          <TextField.Root
            defaultValue={device?.make}
            placeholder="Make"
            id="make"
            {...register('make')}
          />
          <ErrorMessage>{errors.make?.message}</ErrorMessage>
        </label>
        <label htmlFor="username">
          Username
          <TextField.Root
            defaultValue={device?.username}
            placeholder="Username"
            id="username"
            {...register('username')}
          />
          <ErrorMessage>{errors.username?.message}</ErrorMessage>
        </label>
        <label htmlFor="password">
          Password
          <TextField.Root
            defaultValue={device?.password}
            placeholder="Password"
            id="password"
            {...register('password')}
          />
          <ErrorMessage>{errors.password?.message}</ErrorMessage>
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

export default DeviceForm
