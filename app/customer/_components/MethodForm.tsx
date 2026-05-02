'use client'
import { BackButton, ButtonIcon, ErrorMessage, MyButton, Send } from '@/app/components'
import CompoForm from '@/app/components/CompoForm'
import { useFormSubmit } from '@/app/hooks/useFormSubmit'
import { MethodInfoSchema } from '@/app/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { MethodInfo } from '@prisma/client'
import { Container, TextArea, TextField } from '@radix-ui/themes'
import { notFound, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import z from 'zod'

type MethodFormData = z.infer<typeof MethodInfoSchema>

const MethodForm = ({ method }: { method?: MethodInfo }) => {
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

  const { submit, submitting, error } = useFormSubmit<MethodFormData>()
  const onSubmit = handleSubmit(async data => {
    await submit(data, {
      url: method ? `/api/customers/${id}/method/${mid}` : `/api/customers/${id}/method`,
      method: method ? 'patch' : 'post',
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
      </CompoForm>
    </Container>
  )
}

export default MethodForm
